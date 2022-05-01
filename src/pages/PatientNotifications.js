import React from 'react';
import {useState,useEffect,useRef} from 'react'
import { Card,CardHeader,CardContent,CardActions } from '@mui/material';
import { typography } from '@mui/system';
import { useSelector } from 'react-redux';
import { selectUser } from "../Components/Redux/userSlice";
import axios from 'axios';
import { Grid, Button,Container } from '@mui/material';
import baseURL from '../BackendApi/BackendConnection';
import NotificationProp from '../Components/General/NotficationProp';
import CreateConsentDialog from '../Components/PatientDashboard/CreateConsentDialog';

const PatientNotifications=({web3})=>{

    const [open,setOpen] = useState(false);
    const reqConsentDoc = useRef("")

    const handleClickOpen=(request)=>{
        reqConsentDoc.current = request.metaId;
        console.log(reqConsentDoc.current)
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    useEffect(()=>{
        fetchConnectionRequests();
        fetchConsentRequest();
    },[])

    const [acceptedconnection,setAcceptedConnection] = useState([]);
    const user = useSelector(selectUser);
    const [requestedConsents,setRequestedConsents] = useState([]);

    const FilterEvents = async (events) => {
        console.log(events);
        events.forEach( async (event) => {
            if(event['event'] == "CMSConnectionStatusEvent") {
                let connection_abi = require("../contracts/Connection.json")["abi"];
                const _connection = new web3.eth.Contract(connection_abi,event['returnValues']['conn']);
                var associatedPatient = await _connection.methods.getPatient().call({from : user.account});
                var status = await _connection.methods.getStatus().call({from : user.account});
                if((status == 1) && (event['returnValues']['status'] == 1) && (associatedPatient == user.account) && (events[events.length - 1]['blockNumber'] - event['blockNumber'] < 5)) {
                    console.log(event)
                }
            }
            if(event["event"] == "CMSConsentRequestedEvent") {
                let consent_abi = require("../contracts/Consent.json")["abi"];
                const _consent = new web3.eth.Contract(consent_abi,event['returnValues']['consent']);
                var associatedPatient = await _consent.methods.getPatient().call({from : user.account});
                var status = await _consent.methods.getStatus().call({from : user.account});
                if((status == 3) && (associatedPatient == user.account)) {
                    console.log(event)
                }
            }
        });
    }
    const GetNotificationViaEvents = async () => {
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
        
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS); 
        console.log(contract);
        await contract.getPastEvents('AllEvents',{fromBlock:0,toBlock:'latest'},async function(err,res) {
            console.log(FilterEvents(res));
            // setRequestedConsents(res);
        });
    }

    const fetchConsentRequest = async () => {
    
      let abi = require("../contracts/ConsentManagementSystem.json")["abi"];  
      console.log(web3);  
      let consentJson = {"metaId":"","description":""};
      console.log(process.env.REACT_APP_CONTRACTADDRESS);
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
                var consentDoctorId = await _consent.methods.getDoctor().call({from: user.account,gas: 4712388})
                consentJson["metaId"] =consentDoctorId;

                allRequestedConsents.push(consentJson);
            }
            
        }
        setRequestedConsents(allRequestedConsents);
        console.log(allRequestedConsents,requestedConsents);
        }).catch(console.error);
    }

    const fetchConnectionRequests = async () =>  {
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
        
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS);        

        await contract.methods.GetConnectionFile().call({from : user.account},async function(err,res) {
            console.log(res);
            let ConnectionFileAbi = require("../contracts/ConnectionFile.json")["abi"];
            let ConnectionFileContract = new web3.eth.Contract(ConnectionFileAbi,res);
            
            await ConnectionFileContract.methods.GetTypeConnections(1).call({from : user.account},
                async(err,AcceptedConnectionList) => {
                console.log(AcceptedConnectionList)
                AcceptedConnectionList.forEach(async (doctorId) => {
                    console.log(doctorId);
                    axios.get(`${baseURL}/Doc/${doctorId}/Profile-public`).then(
                        (response)=>{
                            var data = response.data;
                            data['msg'] = " has accepted your connection request";
                            setAcceptedConnection([...acceptedconnection,data]);
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
        <CreateConsentDialog open={open} handleClose={handleClose} web3={web3} whichDoctor={reqConsentDoc.current}/>
        {
            acceptedconnection.map((connection)=>{
                return <NotificationProp title={"Accepted Connection"} data={connection}/>
            })
        }
        {
            requestedConsents.map((request)=>{
            return <NotificationProp title={"Request Consent"} data={request} button1Val="Create Consent" button2Val="Reject" button1ValClick = {() => handleClickOpen(request)} button2ValClick={()=>{}} />
            })
        }
        <Button onClick={GetNotificationViaEvents}> Calling All Events Data </Button>
        </Grid>
    );
}

export default PatientNotifications;