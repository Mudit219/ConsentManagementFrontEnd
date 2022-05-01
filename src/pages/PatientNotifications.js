import React from 'react';
import {useState,useEffect} from 'react'
import { Card,CardHeader,CardContent,CardActions } from '@mui/material';
import { typography } from '@mui/system';
import { useSelector } from 'react-redux';
import { selectUser } from "../Components/Redux/userSlice";
import axios from 'axios';
import { Grid, Button,Container } from '@mui/material';
import baseURL from '../BackendApi/BackendConnection';
import NotificationProp from '../Components/General/NotficationProp';

const PatientNotifications=({web3})=>{

    useEffect(()=>{
        fetchConnectionRequests();
        fetchConsentRequest();
    },[])

    const [acceptedconnection,setAcceptedConnection] = useState([]);
    const user = useSelector(selectUser);
    const [requestedConsents,setRequestedConsents] = useState([]);

    const fetchConsentRequest = async () => {
    
      let abi = require("../contracts/ConsentManagementSystem.json")["abi"];  
      console.log(web3);  
      let consentJson = {"metaId":"","description":""};
      let contract = new web3.eth.Contract(abi,process.env.REACT_APP_CONTRACTADDRESS); 
      await contract.methods.GetConsents().call({from: user.account, gas: 4712388}).then(async function (consents){
        var allRequestedConsents = [];
        console.log(consents.length);
        for(var i=0;i<consents.length;i++){
            consentJson = {"metaId":"","description":""};
            let consent_abi = require("../contracts/Consent.json")["abi"];
            const _consent = new web3.eth.Contract(consent_abi,consents[i]);
            const status = await _consent.methods.getStatus().call({from: user.account, gas: 4712388})
            console.log("Consent Status: " + status);
            if(status == 3){
                await _consent.methods.getTemplate().call({from: user.account, gas: 4712388}).then(async function (template){
                let consentTemplate_abi = require("../contracts/ConsentTemplate.json")["abi"];
                const _template = new web3.eth.Contract(consentTemplate_abi,template);
                var consentDescription = await _template.methods.GetRequestedDesc().call({from: user.account, gas: 4712388});
                consentJson['description']= consentDescription;
                console.log("YOOOOOOOOOOO");
                console.log("Consent Description",consentDescription);
                console.log(consentJson);
                // return consentJson;
                })
            }
            var consentDoctorId = await _consent.methods.getDoctor().call({from: user.account,gas: 4712388})
            consentJson["metaId"]=consentDoctorId;

            allRequestedConsents.push(consentJson);
        }
        setRequestedConsents(allRequestedConsents);
        }).catch(console.error);
    }

    const fetchConnectionRequests = async () =>  {
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
        
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS);        

        await contract.methods.GetConnectionFile().call({from : user.account},async function(err,res) {

            let ConnectionFileAbi = require("../contracts/ConnectionFile.json")["abi"];
            let ConnectionFileContract = new web3.eth.Contract(ConnectionFileAbi,res);
            
            await ConnectionFileContract.methods.GetTypeConnections(1).call({from : user.account},
                async(err,AcceptedConnectionList) => {
                console.log(AcceptedConnectionList)
                AcceptedConnectionList.forEach(async (doctorId) => {
                    console.log(doctorId);
                    axios.get(`${baseURL}/Doc/${doctorId}/Profile-public`).then(
                        (response)=>{
                            setAcceptedConnection([...acceptedconnection,response.data]);
                        },
                        (error)=>{
                            console.log("No doctor");
                            throw(error);
                        }
                    )
                });
            })
        })
        .catch(console.error);

    }


    return (
        <Grid container spacing={5}>
        {
            acceptedconnection.map((connection)=>{
                return <NotificationProp title={"Accepted Connection"} data={connection}/>
            })
        }
        {
            requestedConsents.map((request)=>{
                return <NotificationProp title={"Request Consent"} data={request} button1Val="Create Consent" button2Val="Reject" />
            })
        }

        </Grid>
    );
}

export default PatientNotifications;