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
import { Container } from "@mui/material";

const AllConsents =({web3})=> {
    const [open, setOpen] = React.useState(false);
    const [consents,setConsents] = React.useState();
    const reqDoctor = useRef("");
    
    const ConsentHeader = [
    {
        name: "id",
        label: "#",
        options: {
            filter: true,
            sort: true,
            customBodyRender: (rowIndex, dataIndex) => dataIndex.rowIndex + 1 
    }},
    "consentId",
    "Patientname",
    "Doctorname",
    {
        name: "Consent Data",
        options: {
            customBodyRender: (value, tableMeta) => {
                // console.log("MUII data table value",value,tableMeta)
                    
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
        download:false,
        print:false
      };
      const _ = require('lodash'); 

    const user = useSelector(selectUser);
    
    const handleClickOpen = (value) => {
        // console.log(value,reqDoctor);
        reqDoctor.current = value;
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(async () => {
        await accessConsents();
    }, [])

    useEffect(() => {
        // console.log(consents);
    },[consents])
    
    const accessConsents = async ()=>{
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];  
        // console.log(web3);  
        let consentJson = {"consentId" : "","Patientname":"","Doctorname":"","Consent Data":""};
        let contract = new web3.eth.Contract(abi,process.env.REACT_APP_CONTRACTADDRESS); 
        await contract.methods.GetConsents().call({from: user.account, gas: 4712388}).then(async function (consents){
            var allConsents = [];
            // console.log(consents.length);
            for(var i=0;i<consents.length;i++){
                consentJson = {"consentId" : consents[i],"Patientname":"","Doctorname":"","Consent Data":""};
                let consent_abi = require("../contracts/Consent.json")["abi"];
                const _consent = new web3.eth.Contract(consent_abi,consents[i]);
                const status = await _consent.methods.getStatus().call({from: user.account, gas: 4712388})
                // console.log("Consent Status: " + status);
                if(status == 2 || status == 3){
                    
                    // console.log(consentJson["recordIds"]);

                    var consentPatientId = await _consent.methods.getPatient().call({from: user.account,gas: 4712388})
                
                    await axios.get(`${baseURL}/Pat/${consentPatientId}/Profile-public`).then(
                        (response)=>{
                            var data = response.data;
                            consentJson['Patientname'] = data['name'];
                        },
                        (error)=>{
                            // console.log("No doctor");
                            throw(error);
                        }
                    )

                    var consentDoctorId = await _consent.methods.getDoctor().call({from: user.account,gas: 4712388})
                    consentJson["Consent Data"] = consentDoctorId

                    await axios.get(`${baseURL}/Doc/${consentDoctorId}/Profile-public`).then(
                        (response)=>{
                            var data = response.data;
                            consentJson['Doctorname'] = data['name'];
                        },
                        (error)=>{
                            // console.log("No doctor");
                            throw(error);
                        }
                    )
                    // console.log(consentJson);
                        
                    allConsents.push(consentJson);
                }
        }
        setConsents(allConsents);

        });
    }

    return (
    
    <Container>
        <Button variant="contained" style={{margin:"10px",backgroundColor:"#25274D",color:"white"}} onClick={()=>handleClickOpen(null)} >
            Create Consent
        </Button>
       <CreateConsentDialog open={open} handleClose={handleClose} web3={web3} whichDoctor={reqDoctor.current}/>
       
        <MUIDataTable
            title={"Consent Table"}
            data={consents}
            columns={ConsentHeader}
            options={options}
        />
        
    </Container >
    );
}

export default AllConsents;
