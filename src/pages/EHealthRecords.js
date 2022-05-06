import React, { Fragment } from "react";
import { TableContainer, Table, TableCell, TableBody, TableHead, TableRow, Paper } from "@mui/material";
import baseURL from "../BackendApi/BackendConnection";
import { useState, useEffect } from "react";
import axios from "axios";
import {selectUser} from "../Components/Redux/userSlice";
import {useSelector} from "react-redux";
import MUIDataTable from "mui-datatables";
import { Container } from "@mui/material";


const DisplayRecords=({web3})=>{
    const _ = require('lodash');
    const columnsPat = ["EhrID", "AbhaID","DoctorName", "Hospital Name", "diagnosis", "Prescription", "Date"]
    const columnsDoc = ["EhrID", "PatientName","PatientPhone","DoctorName", "Hospital Name", "Diagnosis", "Prescription", "Date"]
    const user =  useSelector(selectUser);
    const [EHealthRecords,setEHealthRecord] = useState([]);
    const [ConsentedRecords,setConsentedRecords] = useState([]);
    const options = {
      filterType: 'dropdown',
      search:'true',
      customToolbarSelect: () => {},
      selectableRows: false,
      download:false,
      print:false
    };
  
    // const 
    // console.log("These are the parameters: " + parameters.consentRecords);
    useEffect(()=>{
      if(user.role==="Pat")
        document.title='Welcome Patient'
      else if(user.role==="Doc")
        document.title='Welcome Doctor'
    },[]);

    useEffect(async ()=>{
      await accessConsents();
      // console.log(ConsentedRecords);
      // displayEHR();
    },[]);

    useEffect(()=>{
      displayEHR();
    },[ConsentedRecords])

    const checkEHR=(EHR)=>{
      const map = new Map(EHR.map(pos => [pos.ehrId, pos]));
      const AllRecords = [...map.values()];
      // console.log("This is the Ehealth Records:",EHealthRecords);
      return AllRecords;
    }
    
    const accessConsents= async ()=>{
      let abi = require("../contracts/ConsentManagementSystem.json")["abi"];  
      // console.log(web3);  
      let consentJson = {"patientId":"","recordIds":[]};
      let contract = new web3.eth.Contract(abi,process.env.REACT_APP_CONTRACTADDRESS); 
      await contract.methods.GetConsents().call({from: user.account, gas: 4712388}).then(async function (consents){
        var allConsetedRecords = [];
        // console.log(consents.length);
        for(var i=0;i<consents.length;i++){
            consentJson = {"patientId":"","recordIds":[]};
            let consent_abi = require("../contracts/Consent.json")["abi"];
            const _consent = new web3.eth.Contract(consent_abi,consents[i]);
            await _consent.methods.getTemplate().call({from: user.account, gas: 4712388}).then(async function (template){
              let consentTemplate_abi = require("../contracts/ConsentTemplate.json")["abi"];
              const _template = new web3.eth.Contract(consentTemplate_abi,template);
              var consentRecords = await _template.methods.GetConsentedRecords().call({from: user.account, gas: 4712388});
              // console.log("Consent Records",consentRecords);
              consentJson["recordIds"]=[...consentRecords];
              // console.log(consentJson);
              // return consentJson;
            }
          )
          // console.log(consentJson["recordIds"]);
          var consentPatientId = await _consent.methods.getPatient().call({from: user.account,gas: 4712388})
          consentJson["patientId"]=consentPatientId;
          allConsetedRecords.push(consentJson);
        }
        setConsentedRecords(allConsetedRecords);

      });
    }
    
    const displayEHR=()=>{       
      if(user.role === "Doc"){
        // if(ConsentedRecords.length!==0){
          // console.log("Blehasdafsd");
          // console.log(ConsentedRecords);
          // console.log("asdfasdf");
          // console.log(columnsDoc.map((item)=>_.camelCase(item)));
          axios.post(`${baseURL}/${user.role}/${user.account}/E-Health-Records`,ConsentedRecords, 
          {
              headers: { 
                  'Authorization': user.token,
                  'Content-Type' : 'application/json'
              }
          }).then(
            (response)=>{

              var records = response.data;
              records.map((record) => {
                record["ehrId"] = parseInt(record["ehrId"])
              })
              // console.log("ahahahahahahha",records)
              setEHealthRecord(checkEHR(records));
              // setEHealthRecord(titleCase(EHealthRecords));
              
              // console.log(EHealthRecords);
            },
            (error)=>{
            // console.log("bla bla bla bla:",error);
              throw(error);
            }
          )
          // }
      }
      if(user.role === "Pat"){
        axios.get(`${baseURL}/${user.role}/${user.account}/E-Health-Records`, 
        {
            headers: { 
                'Authorization': user.token,
                'Content-Type' : 'application/json'
            }
        }).then(
          (response)=>{
            // console.log("bla bla bla bla:",response);

            var records = response.data;
            records.map((record) => {
              record["ehrId"] = parseInt(record["ehrId"])
            })
            // console.log("ahahahahahahha",records)
            setEHealthRecord(records);
          },
          (error)=>{
          // console.log("bla bla bla blasdfadsfsdf:",error);
            throw(error);
          }
        )
      }
    }
    return (
        
      <Container>
        {
          user.role =="Pat"?(
            <MUIDataTable
          title={"E-Health-Records"}
          data={EHealthRecords}
          columns={columnsPat.map((item)=>_.camelCase(item))}
          options={options}
        />)
        :(
          <MUIDataTable
          title={"E-Health-Records"}
          data={EHealthRecords}
          columns={columnsDoc.map((item)=>_.camelCase(item))}
          options={options}
        />
        )
        }
      </Container>
    )
}

export default DisplayRecords;