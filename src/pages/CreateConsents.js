import React, { useState,useRef } from "react";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUser } from "../Components/Redux/userSlice";
import { useEffect } from "react";
import CreateConsentDialog from '../Components/PatientDashboard/CreateConsentDialog';
import { Grid } from "@mui/material";
import MUIDataTable from "mui-datatables";
import baseURL from "../BackendApi/BackendConnection";
import axios from "axios"

const AllConsents =({web3})=> {
    const [open, setOpen] = React.useState(false);
    const [consents,setConsents] = React.useState();
    const reqDoctor = useRef("");
    
    const ConsentHeader = [{
    name: "id",
    label: "#",
    options: {
        filter: true,
        sort: true,
        customBodyRender: (rowIndex, dataIndex) => dataIndex.rowIndex + 1 
    }},
    "consentId","Patientname","Doctorname",{
        name: "Consent Data",
        options: {
            customBodyRender: (value, tableMeta) => {
                return (
                    <button onClick={() => handleClickOpen(value) }>
                        View / Update
                    </button>
                )
            }
        }
    }]

    const options = {
        filterType: 'dropdown',
        search:'true',
        customToolbarSelect: () => {},
        selectableRows: false,
      };
      const _ = require('lodash'); 

    const user = useSelector(selectUser);
    
    const handleClickOpen = (value) => {
        console.log(value);
        setOpen(true);
        reqDoctor.current = value;
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(async () => {
        await accessConsents();
    }, [])

    useEffect(() => {
        console.log(consents);
    },[consents])
    
    const accessConsents = async ()=>{
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];  
        console.log(web3);  
        let consentJson = {"consentId" : "","Patientname":"","Doctorname":"","Update":""};
        let contract = new web3.eth.Contract(abi,process.env.REACT_APP_CONTRACTADDRESS); 
        await contract.methods.GetConsents().call({from: user.account, gas: 4712388}).then(async function (consents){
            var allConsents = [];
            console.log(consents.length);
            for(var i=0;i<consents.length;i++){
                consentJson = {"consentId" : consents[i],"Patientname":"","Doctorname":"","Update":""};
                let consent_abi = require("../contracts/Consent.json")["abi"];
                const _consent = new web3.eth.Contract(consent_abi,consents[i]);
                await _consent.methods.getTemplate().call({from: user.account, gas: 4712388}).then(async function (template){
                let consentTemplate_abi = require("../contracts/ConsentTemplate.json")["abi"];
                const _template = new web3.eth.Contract(consentTemplate_abi,template);
                var consentRecords = await _template.methods.GetConsentedRecords().call({from: user.account, gas: 4712388});
                // console.log("Consent Records",consentRecords);
                // consentJson["Update"]=consentRecords.toString();
                // return consentJson;
                }
            )
            console.log(consentJson["recordIds"]);
            var consentPatientId = await _consent.methods.getPatient().call({from: user.account,gas: 4712388})
            
            await axios.get(`${baseURL}/Pat/${consentPatientId}/Profile-public`).then(
                (response)=>{
                    var data = response.data;
                    consentJson['Patientname'] = data['name'];
                },
                (error)=>{
                    console.log("No doctor");
                    throw(error);
                }
            )

            var consentDoctorId = await _consent.methods.getDoctor().call({from: user.account,gas: 4712388})
            consentJson["Update"] = consentDoctorId

            await axios.get(`${baseURL}/Doc/${consentDoctorId}/Profile-public`).then(
                (response)=>{
                    var data = response.data;
                    consentJson['Doctorname'] = data['name'];
                },
                (error)=>{
                    console.log("No doctor");
                    throw(error);
                }
            )
            console.log(consentJson);
                
            allConsents.push(consentJson);
            }

            setConsents(allConsents);

        });
    }

    return (
    
    <Grid>
        <Button variant="outlined" onClick={handleClickOpen} >
            Create Consent
        </Button>
       <CreateConsentDialog open={open} handleClose={handleClose} web3={web3} whichDoctor={reqDoctor.current}/>
       
        <MUIDataTable
            title={"Consent Table"}
            data={consents}
            columns={ConsentHeader}
            options={options}
        />
        
    </Grid >
    );
}

export default AllConsents;
