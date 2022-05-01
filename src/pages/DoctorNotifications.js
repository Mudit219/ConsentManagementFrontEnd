import React from 'react';
import {useState,useEffect} from 'react'
import { Card,CardHeader,CardContent } from '@mui/material';
import { typography } from '@mui/system';
import { useSelector } from 'react-redux';
import { selectUser } from "../Components/Redux/userSlice";
import axios from 'axios';
import { Grid, Button } from '@mui/material';
import baseURL from '../BackendApi/BackendConnection';
import NotificationProp from '../Components/General/NotficationProp';

const DoctorNotifications=({web3})=>{

    useEffect(()=>{
        fetchConnectionRequests();
        fetchConsentRequest();
    },[])

    const [requestedRecords,setRequestedRecords] = useState([]);
    const [connectionRequests,setConnectionRequests] = useState([]);
    const user = useSelector(selectUser);

 

    const AcceptConnection = async (patientId) => {
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
        
        console.log(CONTRACT_ADDRESS,web3,abi);
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS); 
      
        console.log(contract);
    
        await contract.methods.DoctorAcceptConnection(patientId).send({from : user.account, gas: 5500000}).then(console.log)
        .catch(console.error);
        return;
    }

    const fetchConsentRequest=()=>{
        
    }

    const fetchConnectionRequests = async () =>  {
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
        
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS);        

        await contract.methods.GetConnectionFile().call({from : user.account},async function(err,res) {

            let ConnectionFileAbi = require("../contracts/ConnectionFile.json")["abi"];
            let ConnectionFileContract = new web3.eth.Contract(ConnectionFileAbi,res);
            
            await ConnectionFileContract.methods.GetTypeConnections(2).call({from : user.account},
                async(err,RequestedConnectionList) => {
                console.log(RequestedConnectionList)
                RequestedConnectionList.forEach(async (patientId) => {
                    console.log(patientId);
                    axios.get(`${baseURL}/Pat/${patientId}/Profile-public`).then(
                        (response)=>{
                            var data = response.data;
                            data['msg'] = " has requested to connect with you";
                            setConnectionRequests([...connectionRequests,data]);
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
        <Grid container>
        {
            connectionRequests.map((connection)=>{
                return <NotificationProp title="Request Conneciton" data={connection} button1Val={"Accept Request"} button2Val={"Reject"} button1ValClick={AcceptConnection} button2ValClick={() => {}} />
            })
        }
        </Grid>
    );
}

export default DoctorNotifications;