import React from 'react'
import {useState,useEffect,useRef} from 'react'
import LogProps from '../Components/LogProp'
import {selectUser} from "../Components/Redux/userSlice";
import {useSelector} from "react-redux";
import { Container,Grid } from '@mui/material';
import axios from 'axios';
import baseURL from '../BackendApi/BackendConnection';


const Logs=({web3})=>{

    const [logs,setLogs] = React.useState([]);
    const associatedLogs = useRef([]);

    const user =  useSelector(selectUser);

    const mapEventToText = {
        "CMSConnectionStatusEvent": "Connection Status Changed : ",
        "CMSConsentCreatedEvent": "Consent Created : ",
        "CMSConsentRequestedEvent": "Consent Requested : ",
        "ConsentStatusChanged" : "Consent Status Changed : "
    }

    const ConnectionToStatus = {
        0 : "created",
        1 : "accepted",  /* The giver has accepted the consent */ 
        2 : "requested", /* The company has requested a consent, user has not yet responded */
        3 : "cancelled"  /* The company has cancelled the consent because he no longer needs it */
    }

    const ConsentToStatus = {
        0 : "created",
        1 : "denied",    /* The giver has denied the consent */
	    2 : "accepted",  /* The giver has accepted the consent */ 
	    3 : "requested", /* The company has requested a consent, user has not yet responded */
	    4 : "cancelled"  /* The company has cancelled the consent because he no longer needs it */
    }

    
    useEffect(() => {
        GetLogs();
      
      }, [])

    const FilterEvents = async (events) => {
        // console.log(events);

        for(var i=0;i<events.length;i++) {
            var event = events[i];
            if(event['event'] == "CMSConnectionStatusEvent") {
                let connection_abi = require("../contracts/Connection.json")["abi"];
                const _connection = new web3.eth.Contract(connection_abi,event['returnValues']['conn']);
                try{
                    var associatedDoctor = await _connection.methods.getDoctor().call({from : user.account});
                    var associatedPatient = await _connection.methods.getPatient().call({from : user.account});

                    if(user.role == "Doc") {
                        if(associatedDoctor == user.account) {
                            event["doctor"] = associatedDoctor;
                            event["patient"] = associatedPatient;
                            associatedLogs.current = [...associatedLogs.current,event]
                        }
                        // console.log(associatedLogs.current)
                    }
                    else {
                        if(associatedPatient == user.account) {
                            event["doctor"] = associatedDoctor;
                            event["patient"] = associatedPatient;
                            associatedLogs.current = [...associatedLogs.current,event]
                        }
                    }
                
                }
                catch{

                }
                
            }
            if(event["event"] == "CMSConsentCreatedEvent" || event["event"] == "CMSConsentRequestedEvent" || event["event"] == "ConsentStatusChanged") {
                let consent_abi = require("../contracts/Consent.json")["abi"];
                const _consent = new web3.eth.Contract(consent_abi,event['returnValues']['consent']);
                
                try{
                    var associatedDoctor = await _consent.methods.getDoctor().call({from : user.account});
                    var associatedPatient = await _consent.methods.getPatient().call({from : user.account});

                    if(user.role == "Doc") {
                        if(associatedDoctor == user.account) {
                            event["doctor"] = associatedDoctor;
                            event["patient"] = associatedPatient;
                            associatedLogs.current = [...associatedLogs.current,event]
                        }
                    }
                    else {
                        if(associatedPatient == user.account) {    
                            event["doctor"] = associatedDoctor;
                            event["patient"] = associatedPatient;
                            associatedLogs.current = [...associatedLogs.current,event]
                        }
                    }
                }
                catch{
                    
                }
                
            }
        }
        console.log("Associated Logs: ",associatedLogs.current)
        return associatedLogs.current
    }
    
    const GetMessageFromEvent = (event,pat_name,doc_name) => {
        let message = ""
        let desc = ""
        
        // console.log(event)
        switch(event.event) {
            case "CMSConnectionStatusEvent":
                message += "Patient : "+ pat_name + " "
                message += event["patient"];
                message += "Doctor : " + doc_name + " ";
                message += event["doctor"]
                // message += "\n"
                desc += "Connection Status : "
                desc += ConnectionToStatus[event.returnValues.status];
                break;
            case "CMSConsentCreatedEvent":
                message += "Patient : "+ pat_name+ " "
                message += event["patient"];
                message += "Doctor : " + doc_name+ " ";
                message += event["doctor"]
                // message += "\n"
                desc += "Records Granted : "
                // console.log(event.returnValues["Records"])
                desc += event.returnValues["Records"].toString();
                break;
            case "CMSConsentRequestedEvent":
                message += "Patient : "+ pat_name+ " "
                message += event["patient"];
                message += "Doctor : " + doc_name+ " ";
                message += event["doctor"]
                // message += "\n"
                desc += "Requested Description : "
                desc += event.returnValues.desc;
                break;
            case "ConsentStatusChanged":
                message += "Patient : "+ pat_name+ " "
                message += event["patient"];
                message += "Doctor : " + doc_name+ " ";
                message += event["doctor"]
                // message += "\n"
                desc += "Consent Status : "
                desc += ConsentToStatus[event.returnValues.status];
                break;
        }
        return [message,desc];
    }

    
    const GetLogs = async() => {
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
        
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS); 
        console.log(contract);
        await contract.getPastEvents('AllEvents',{fromBlock:0,toBlock:'latest'},async (err,res) => {
            var notifs = []
            associatedLogs.current = await FilterEvents(res.reverse());
            
            // console.log([...new Set(associatedLogs.current.map((item) => item["doctor"]))]);
            await axios.post(`${baseURL}/Pat/Profile-public`,[...new Set(associatedLogs.current.map((item) => item["patient"]))]).then(
                (response)=>{
                    // doctorConnections.push(response.data);
                    // console.log("Thidfhiasdf",response.data)
                    associatedLogs.current['AllPatients'] =  response.data; 
                }
            )

            await axios.post(`${baseURL}/Doc/Profile-public`,[...new Set(associatedLogs.current.map((item) => item["doctor"]))]).then(
                (response)=>{
                    // doctorConnections.push(response.data);
                    console.log("Thidfhiasdf",response.data)
                    associatedLogs.current['AllDoctors'] =  response.data; 
                }
            )

            associatedLogs.current.forEach(log_data => {
                var log = {}
                log["event"] = log_data["event"]
                log["name"] = mapEventToText[log_data['event']] + "\n"
                log["patient_data"] = associatedLogs.current['AllPatients'].find(x => x["metaId"] == log_data["patient"])
                log["doctor_data"] = associatedLogs.current['AllDoctors'].find(x => x["metaId"] == log_data["doctor"])
                console.log(GetMessageFromEvent(log_data,log['patient_data'].name,log['doctor_data'].name))
                let data = GetMessageFromEvent(log_data,log['patient_data'].name,log['doctor_data'].name)
                log["msg"] = data[0];
                log["description"]=data[1];
                // log["doctor_data"] = 
                // console.log(log);
                notifs.push(log);
            });
            setLogs(notifs);
        });
    
    }


    return (
        <Container>
        <Grid container spacing={3}>
            {
                // console.log(logs)
                logs.map((log) => (
                    <LogProps title={log.event} data={log}/>
                ))
            }
        </Grid>
        </Container>
    );
}

export default Logs;