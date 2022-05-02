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
    const [acceptedconnection,setAcceptedConnection] = useState();
    const user = useSelector(selectUser);
    const [requestedConsents,setRequestedConsents] = useState();
    const [timeBasedSequenceEvents,setTimeBasedSequenceEvents] = useState([]);
    const reqConsentDoc = useRef("")

    const handleClickOpen=(request)=>{
        reqConsentDoc.current = request.metaId;
        // console.log(reqConsentDoc.current)
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    useEffect(async ()=>{
        await fetchConnectionRequests();
        await fetchConsentRequest();
        await GetNotificationViaEvents();
    },[])

    useEffect(async () => {
        // GetNotificationViaEvents()
    },[acceptedconnection,requestedConsents,timeBasedSequenceEvents])



    const FilterEvents = async (events) => {
            let FilteredEvents = [];
            
            for(const event of events) {
                if(event['event'] == "CMSConnectionStatusEvent") {
                    let connection_abi = require("../contracts/Connection.json")["abi"];
                    const _connection = new web3.eth.Contract(connection_abi,event['returnValues']['conn']);
                    var associatedPatient = await _connection.methods.getPatient().call({from : user.account});
                    var status = await _connection.methods.getStatus().call({from : user.account});
                    if((status == 1) && (event['returnValues']['status'] == 1) && (associatedPatient == user.account) && (events[events.length - 1]['blockNumber'] - event['blockNumber'] < 10)) {
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
                if(event["event"] == "CMSConsentRequestedEvent") {
                    let consent_abi = require("../contracts/Consent.json")["abi"];
                    const _consent = new web3.eth.Contract(consent_abi,event['returnValues']['consent']);
                    var associatedPatient = await _consent.methods.getPatient().call({from : user.account});
                    var status = await _consent.methods.getStatus().call({from : user.account});
                    if((status == 3) && (associatedPatient == user.account)) {
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

    const fetchConsentRequest = async () => {
    
      let abi = require("../contracts/ConsentManagementSystem.json")["abi"];  
    //   console.log(web3);  
      let consentJson = {"metaId":"","description":"","name":""};
    //   console.log(process.env.REACT_APP_CONTRACTADDRESS);
      let contract = new web3.eth.Contract(abi,process.env.REACT_APP_CONTRACTADDRESS); 
      await contract.methods.GetConsents().call({from: user.account, gas: 4712388}).then(async function (consents){
        var allRequestedConsents = [];
        // console.log(consents.length);
        for(var i=0;i<consents.length;i++){
            consentJson = {"Id" : consents[i],"metaId":"","description":"","name" : ""};
            let consent_abi = require("../contracts/Consent.json")["abi"];

            const _consent = new web3.eth.Contract(consent_abi,consents[i]);
            const status = await _consent.methods.getStatus().call({from: user.account, gas: 4712388})
            // console.log("Consent Status: " + status);
            if(status == 3){
                await _consent.methods.getTemplate().call({from: user.account, gas: 4712388}).then(async function (template){
                let consentTemplate_abi = require("../contracts/ConsentTemplate.json")["abi"];
                const _template = new web3.eth.Contract(consentTemplate_abi,template);
                var consentDescription = await _template.methods.GetRequestedDesc().call({from: user.account, gas: 4712388});
                consentJson['description']= consentDescription;
                
                // console.log("Consent Description",consentDescription);
                // console.log(consentJson);
                // return consentJson;
                })
                var consentDoctorId = await _consent.methods.getDoctor().call({from: user.account,gas: 4712388})
                
                consentJson["metaId"] =consentDoctorId;
                axios.get(`${baseURL}/Doc/${consentDoctorId}/Profile-public`).then(
                    (response)=>{
                        var data = response.data;
                        consentJson['name'] = data['name'];
                        // setRequestedConsents([...requestedConsents,consentJson]);
                    },
                    (error)=>{
                        console.log("No doctor");
                        throw(error);
                    }
                )

                allRequestedConsents.push(consentJson);
            }
            
        }
        setRequestedConsents(allRequestedConsents);
        console.log("Requested Shit",allRequestedConsents);

        }).catch(console.error);
    }

    const fetchConnectionRequests = async () =>  {
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
        let connectionJson = {"Id" : "","metaId" : "","name" : "","msg" : ""}
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS);        

        await contract.methods.GetConnectionFile().call({from : user.account},async function(err,res) {
            // console.log(res);
            let AllAcceptedConnections = [];
            let ConnectionFileAbi = require("../contracts/ConnectionFile.json")["abi"];
            let ConnectionFileContract = new web3.eth.Contract(ConnectionFileAbi,res);
            await ConnectionFileContract.methods.getListOfConnections().call({from : user.account},
                async(err,connections) => {
                    // console.log(connections);
                    for(var i=0;i<connections.length;i++){
                        connectionJson = {"Id" : connections[i],"metaId" : "","name" : "","msg" : ""};
                        let connection_abi = require("../contracts/Connection.json")["abi"];
                        const _connection = new web3.eth.Contract(connection_abi,connections[i]);
                        const status = await _connection.methods.getStatus().call({from : user.account, gas: 4712388})
                        console.log("Connection Status: " + status);
                        if(status == 1){
                            var doctorMetaId = await _connection.methods.getDoctor().call({from : user.account, gas: 4712388})
                            connectionJson['metaId'] = doctorMetaId;
                            axios.get(`${baseURL}/Doc/${doctorMetaId}/Profile-public`).then(
                                (response)=>{
                                    var data = response.data;
                                    connectionJson['name'] = data['name'];
                                    connectionJson['msg'] = " has Accepted your connection";
                                    AllAcceptedConnections.push(connectionJson)
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

                setAcceptedConnection(AllAcceptedConnections);
                // console.log("Accepted Shit : ",AllAcceptedConnections);
        })
        .catch(console.error);


    }

    return (
        <Grid container spacing={5}>
        <CreateConsentDialog open={open} handleClose={handleClose} web3={web3} whichDoctor={reqConsentDoc.current}/>
        {
            // console.log("Time based render data is here",timeBasedSequenceEvents,timeBasedSequenceEvents.length)
            timeBasedSequenceEvents && requestedConsents && acceptedconnection && (
                timeBasedSequenceEvents.map((elem) => {
                    console.log("Display render Time Data:",requestedConsents,acceptedconnection)
                    
                    
                    console.log("I was here",elem)

                    if(elem["type"] == "consent"){
                        var request = requestedConsents.find(x => x["Id"] == elem["Id"]);
                        if(request) {
                            return <NotificationProp title={"Request Consent"} data={request} button1Val="Create Consent" button2Val="Reject" button1ValClick = {() => handleClickOpen(request)} button2ValClick={()=>{}} />
                        }
                    } 
                    else{
                        var connection = acceptedconnection.find(x => x["Id"] == elem["Id"]);
                        if(connection) {
                            return <NotificationProp title={"Accepted Connection"} data={connection}/>
                        }
                    }
                })
            )
        }
        
        {/* {
            // console.log("ahahahahahahahahahah",acceptedconnection)
            acceptedconnection.map((connection)=>{
                return <NotificationProp title={"Accepted Connection"} data={connection}/>
            })
        }
        {
            // console.log(requestedConsents)
            requestedConsents.map((request)=>{
            return <NotificationProp title={"Request Consent"} data={request} button1Val="Create Consent" button2Val="Reject" button1ValClick = {() => handleClickOpen(request)} button2ValClick={()=>{}} />
            })
        } */}
        <Button onClick={GetNotificationViaEvents}> Calling All Events Data </Button>
        </Grid>
    );
}

export default PatientNotifications;