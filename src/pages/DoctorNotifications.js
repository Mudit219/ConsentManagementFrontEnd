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

    
    const [consentedRecords,setConsentedRecords] = useState();
    const [connectionRequests,setConnectionRequests] = useState();
    const [timeBasedSequenceEvents,setTimeBasedSequenceEvents] = useState([]);
    const user = useSelector(selectUser);

    useEffect(async ()=>{
        await fetchConnectionRequests();
        await fetchConsentGivenRequest();
        await GetNotificationViaEvents();
    },[])


    useEffect(async () => {
        // GetNotificationViaEvents()
    },[connectionRequests,consentedRecords,timeBasedSequenceEvents])



    const FilterEvents = async (events) => {
            let FilteredEvents = [];
            // console.log(events)
            for(const event of events) {
                // console.log(FilteredEvents,event)
                if(event['event'] == "CMSConnectionStatusEvent") {
                    let connection_abi = require("../contracts/Connection.json")["abi"];
                    const _connection = new web3.eth.Contract(connection_abi,event['returnValues']['conn']);
                    var associatedDoctor = await _connection.methods.getDoctor().call({from : user.account});
                    // console.log(associatedDoctor,user.account)
                    var status = await _connection.methods.getStatus().call({from : user.account});
                    
                    console.log(status,associatedDoctor,user.account,event['returnValues']['status'])
                    if((status != 3) && (event['returnValues']['status'] === "2") && (associatedDoctor == user.account)) {
                        if(FilteredEvents.find(x => x["Id"] == event['returnValues']['conn'])) { 
                            var index = FilteredEvents.findIndex(x => x["Id"] == event['returnValues']['conn']); 
                            FilteredEvents.splice(index,1);
                            FilteredEvents.push(
                                {
                                    "Id" : event['returnValues']['conn'],
                                    "type" : "connection"
                                }
                            )
                        }
                        else {
                            FilteredEvents.push(
                                {
                                    "Id" : event['returnValues']['conn'],
                                    "type" : "connection"
                                }
                            )
                        }
                    }
                }
                if(event["event"] == "CMSConsentCreatedEvent") {
                    let consent_abi = require("../contracts/Consent.json")["abi"];
                    const _consent = new web3.eth.Contract(consent_abi,event['returnValues']['consent']);
                    var associatedDoctor = await _consent.methods.getDoctor().call({from : user.account});
                    var status = await _consent.methods.getStatus().call({from : user.account});
                    // console.log(associatedDoctor,user.account)
                    if((status == 2) && (associatedDoctor == user.account) && (events[events.length - 1]['blockNumber'] - event['blockNumber'] < 6)) {
                        if(FilteredEvents.find(x => x["Id"] == event['returnValues']['consent'])) { 
                            var index = FilteredEvents.findIndex(x => x["Id"] == event['returnValues']['consent']); 
                            FilteredEvents.splice(index,1);
                            FilteredEvents.push(
                                {
                                    "Id" : event['returnValues']['consent'],
                                    "type" : "consent"
                                }
                            )
                        }
                        else {
                            FilteredEvents.push(
                                {
                                    "Id" : event['returnValues']['consent'],
                                    "type" : "consent"
                                }
                            )
                        }
                    }
                }
            }

            console.log(FilteredEvents)
            return FilteredEvents
  
    }

    const GetNotificationViaEvents = async () => {
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
        
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS); 
        // console.log(contract);
        await contract.getPastEvents('AllEvents',{fromBlock:0,toBlock:'latest'},async function(err,res) {
            FilterEvents(res).then(async(responses) => {
                console.log("Time based responses",responses)
                setTimeBasedSequenceEvents(responses);
                
                console.log("Time based Current responses",timeBasedSequenceEvents)

            });
            
        });
    }

 

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

    const fetchConsentGivenRequest= async()=>{
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];  
        let contract = new web3.eth.Contract(abi,process.env.REACT_APP_CONTRACTADDRESS);

        await contract.methods.GetConsents().call({from: user.account, gas: 4712388}).then(async function (consents){
        var allGivenConsents = [];
        console.log("Waited till here");
        for(var i=0;i<consents.length;i++){
            let consentJson = {"Id" : consents[i],"metaId":"","msg": "","name" : ""};
            let consent_abi = require("../contracts/Consent.json")["abi"];

            const _consent = new web3.eth.Contract(consent_abi,consents[i]);
            const status = await _consent.methods.getStatus().call({from: user.account, gas: 4712388})
            // console.log("Consent Status: " + status);
            if(status == 2){
                await _consent.methods.getTemplate().call({from: user.account, gas: 4712388}).then(async function (template){
                let consentTemplate_abi = require("../contracts/ConsentTemplate.json")["abi"];
                const _template = new web3.eth.Contract(consentTemplate_abi,template);
                var records = await _template.methods.GetConsentedRecords().call({from: user.account, gas: 4712388});
                consentJson['description']= "Records : " + records.toString();
                
                // console.log("Consent Description",consentDescription);
                // console.log(consentJson);
                // return consentJson;
                })

                var consentPatientId = await _consent.methods.getPatient().call({from: user.account,gas: 4712388})
                consentJson["metaId"] = consentPatientId;

                axios.get(`${baseURL}/Pat/${consentPatientId}/Profile-public`).then(
                    (response)=>{
                        var data = response.data;
                        consentJson['name'] = data['name'];
                    },
                    (error)=>{
                        console.log("No doctor");
                        throw(error);
                    }
                )

                allGivenConsents.push(consentJson);
                console.log("All Given Consents",allGivenConsents);
            }
        }
        console.log(allGivenConsents)
        setConsentedRecords(allGivenConsents);
        })
    
    }

    const fetchConnectionRequests = async () =>  {
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
        
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS);        

        await contract.methods.GetConnectionFile().call({from : user.account},async function(err,res) {

            let ConnectionFileAbi = require("../contracts/ConnectionFile.json")["abi"];
            let ConnectionFileContract = new web3.eth.Contract(ConnectionFileAbi,res);
            let AllRequestedConnections = [];

            await ConnectionFileContract.methods.getListOfConnections().call({from : user.account},
                async(err,connections) => {
                    // console.log(connections);
                    for(var i=0;i<connections.length;i++){
                        let connectionJson = {"Id" : connections[i],"metaId" : "","name" : "","msg" : ""};
                        let connection_abi = require("../contracts/Connection.json")["abi"];
                        const _connection = new web3.eth.Contract(connection_abi,connections[i]);
                        const status = await _connection.methods.getStatus().call({from : user.account, gas: 4712388})
                        console.log("Connection Status: " + status);
                        if(status == 2){
                            var doctorMetaId = await _connection.methods.getDoctor().call({from : user.account, gas: 4712388})
                            connectionJson['metaId'] = doctorMetaId;
                            axios.get(`${baseURL}/Doc/${doctorMetaId}/Profile-public`).then(
                                (response)=>{
                                    var data = response.data;
                                    connectionJson['name'] = data['name'];
                                    connectionJson['msg'] = " has requested connection";
                                    AllRequestedConnections.push(connectionJson)
                                    // setAcceptedConnection([...acceptedconnection,connectionJson]);
                                    console.log(connectionJson);
                            
                                },
                                (error)=>{
                                    console.log("No doctor");
                                    throw(error);
                                })
                        }
                    }
                    // console.log("Connection Shit",acceptedconnection);
                });
                // console.log(AllRequestedConnections)
                setConnectionRequests(AllRequestedConnections);
        })
        .catch(console.error);

    }


    return (
        <Grid container>
        {
            timeBasedSequenceEvents && connectionRequests && consentedRecords && (
                timeBasedSequenceEvents.map((elem) => {
                    console.log("Display render Time Data:",consentedRecords,connectionRequests)
                    
                    console.log("I was here",elem)

                    if(elem["type"] == "consent"){
                        var request = consentedRecords.find(x => x["Id"] == elem["Id"]);
                        if(request) {
                            return <NotificationProp title={"Consent Given"} data={request}/>
                        }
                        
                    } 
                    else{
                        var connection = connectionRequests.find(x => x["Id"] == elem["Id"]);
                        if(connection) {
                            return <NotificationProp title={"Request Connection"} data={connection}button1Val={"Accept Request"} button2Val={"Reject"} button1ValClick={AcceptConnection} button2ValClick={() => {}} />
                        }
                    }
                })
            )
        }
            
        {
        //     connectionRequests.map((connection)=>{
        //         return <NotificationProp title="Request Conneciton" data={connection} button1Val={"Accept Request"} button2Val={"Reject"} button1ValClick={AcceptConnection} button2ValClick={() => {}} />
        //     })
        }
        </Grid>
    );
}

export default DoctorNotifications;