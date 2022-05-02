import React from 'react'
import {useState,useEffect,useRef} from 'react'
import LogProps from '../Components/LogProp'
import {selectUser} from "../Components/Redux/userSlice";
import {useSelector} from "react-redux";

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
        console.log(events);

        for(var i=0;i<events.length;i++) {
            var event = events[i];
            if(event['event'] == "CMSConnectionStatusEvent") {
                let connection_abi = require("../contracts/Connection.json")["abi"];
                const _connection = new web3.eth.Contract(connection_abi,event['returnValues']['conn']);
                
                var associatedDoctor = await _connection.methods.getDoctor().call({from : user.account});
                var associatedPatient = await _connection.methods.getPatient().call({from : user.account});

                if(user.role == "Doc") {
                    if(associatedDoctor == user.account) {
                        event["doctor"] = associatedDoctor;
                        event["patient"] = associatedPatient;
                        associatedLogs.current = [...associatedLogs.current,event]
                    }
                    console.log(associatedLogs.current)
                }
                else {
                    if(associatedPatient == user.account) {
                        event["doctor"] = associatedDoctor;
                        event["patient"] = associatedPatient;
                        associatedLogs.current = [...associatedLogs.current,event]
                    }
                }
                
            }
            if(event["event"] == "CMSConsentCreatedEvent" || event["event"] == "CMSConsentRequestedEvent" || event["event"] == "ConsentStatusChanged") {
                let consent_abi = require("../contracts/Consent.json")["abi"];
                const _consent = new web3.eth.Contract(consent_abi,event['returnValues']['consent']);
                
                
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
        }
        console.log("Associated Logs: ",associatedLogs.current)
        return associatedLogs.current
    }
    
    const GetMessageFromEvent = (event) => {
        let message = ""
        console.log(event)
        switch(event.event) {
            case "CMSConnectionStatusEvent":
                message += "Patient : "
                message += event["patient"];
                message += "Doctor : ";
                message += event["doctor"]
                message += "\n"
                message += "Status : "
                message += ConnectionToStatus[event.returnValues.status];
                break;
            case "CMSConsentCreatedEvent":
                message += "Patient : "
                message += event["patient"];
                message += "Doctor : ";
                message += event["doctor"]
                message += "\n"
                message += "Records : "
                console.log(event.returnValues["Records"])
                message += event.returnValues["Records"].toString();
                break;
            case "CMSConsentRequestedEvent":
                message += "Patient : "
                message += event["patient"];
                message += "Doctor : ";
                message += event["doctor"]
                message += "\n"
                message += "Requested Desc : "
                message += event.returnValues.desc;
                break;
            case "ConsentStatusChanged":
                message += "Patient : "
                message += event["patient"];
                message += "Doctor : ";
                message += event["doctor"]
                message += "\n"
                message += "Status : "
                message += ConsentToStatus[event.returnValues.status];
                break;
        }
        return message;
    }

    
    const GetLogs = async() => {
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
        
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS); 
        console.log(contract);
        await contract.getPastEvents('AllEvents',{fromBlock:0,toBlock:'latest'},async (err,res) => {
            var notifs = []
            
            associatedLogs.current = await FilterEvents(res.reverse());
            
            console.log(associatedLogs.current);

            associatedLogs.current.forEach(log_data => {
                var log = {}
                log["event"] = log_data["event"]
                log["name"] = mapEventToText[log_data['event']] + "\n"
                log["msg"] = GetMessageFromEvent(log_data)
                console.log(log);
                notifs.push(log);
            });
            setLogs(notifs);
        });
    
    }


    return (
        <div>
            {
                logs.map((log) => (
                    <LogProps key={log.name} title={log.event} data={log}/>
                ))
            }
        </div>
    );
}

export default Logs;