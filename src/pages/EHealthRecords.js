import React, { Fragment } from "react";
import { TableContainer, Table, TableCell, TableBody, TableHead, TableRow, Paper } from "@mui/material";
import baseURL from "../BackendApi/BackendConnection";
import { useState, useEffect } from "react";
import axios from "axios";
import {selectUser} from "../Components/Redux/userSlice";
import {useSelector} from "react-redux";
import MUIDataTable from "mui-datatables";
import { Container } from "@mui/material";
import { Button } from "@material-ui/core";
import HospitalModalDialog from "../Components/ConnectHospital/modal";

const DisplayRecords=({web3})=>{
    const _ = require('lodash');
    const columnsPat = ["EHR ID", "Abha ID","Doctor Name", "Hospital Name", "Diagnosis", "Prescription", "Date"]
    const columnsDoc = ["EHR ID", "Patient Name","Patient Phone","Doctor Name", "Hospital Name", "Diagnosis", "Prescription", "Date"]
    const user =  useSelector(selectUser);
    const [EHealthRecords,setEHealthRecord] = useState([]);
    const [ConsentedRecords,setConsentedRecords] = useState([]);
    const [hospitalConnectOpen,sethospitalConnectOpen] = useState(false);
    const [connectedHospitals,setConnectedHospitals] = useState([]);

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
      await GetConnectedHospitals();
      await accessConsents();
      // console.log(ConsentedRecords);
      // displayEHR();
    },[]);

    useEffect(()=>{
      displayEHR();
    },[ConsentedRecords,connectedHospitals])

    const checkEHR=(EHR)=>{
      // console.log("This is the Ehealth Records:",EHealthRecords);
      const map = new Map(EHR.map(pos => [pos.ehrId, pos]));
      const AllRecords = [...map.values()];
      return AllRecords;
    }
    
    const GetConnectedHospitals = async () => {
      let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
      let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
      
      let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS);        
      let ConnectedHospitals = [];

      console.log("Here is our user",user,CONTRACT_ADDRESS)
      await contract.methods.GetConnectionFile().call({from : user.account},async function(err,res) {
  
          console.log("Connection File is here",res)
          let ConnectionFileAbi = require("../contracts/ConnectionFile.json")["abi"];
          let ConnectionFileContract = new web3.eth.Contract(ConnectionFileAbi,res);
          
          ConnectionFileContract.methods.getHopitalConnections().call({from : user.account,gas:4712388}, function(err,res) {
            setConnectedHospitals([...new Set(res)].filter((name) => {
              return name != ""
            }));
          });
        })
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
    
    const displayEHR= async ()=>{
      
      console.log("EHR Connected hospitals",connectedHospitals);

      if(user.role === "Doc"){
        // if(ConsentedRecords.length!==0){
          // console.log("Blehasdafsd");
          // console.log(ConsentedRecords);
          // console.log("asdfasdf");
          // console.log(columnsDoc.map((item)=>_.camelCase(item)));
          console.log("This is the doctor dashboard",ConsentedRecords,connectedHospitals);
          axios.post(`${baseURL}/${user.role}/${user.account}/E-Health-Records`,{
            "recordsList" : ConsentedRecords,
            "hospitalNames" : connectedHospitals
          },
          {
              headers: { 
                  'Authorization': user.token,
                  'Content-Type' : 'application/json'
              }
          }).then(
            (response)=>{

              var records = response.data;
              
              records = checkEHR(records)

              var new_records = []
              records.map((item) => {
                var new_record = {}
                columnsDoc.map((field) => {
                  new_record[field] = item[_.camelCase(field)]
                })
                new_records.push(new_record)
              })
              


              console.log("ahahahahahahha",new_records)
              setEHealthRecord(new_records);
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
        axios.post(`${baseURL}/${user.role}/${user.account}/E-Health-Records`,connectedHospitals,
        {
            headers: { 
                'Authorization': user.token,
                'Content-Type' : 'application/json'
            }
        }).then(
          (response)=>{
            var records = response.data;
            
            console.log("bla bla bla bla:",records.flat(1));
            
            console.log("bla bla bla bla:",records.flat(1));
            records = records.flat(1)
            

            var new_records = []
            records.map((item) => {
              var new_record = {}
              columnsDoc.map((field) => {
                new_record[field] = item[_.camelCase(field)]
              })
              new_records.push(new_record)
            })
            


            console.log("ahahahahahahha",new_records)
            setEHealthRecord(new_records);
          },
          (error)=>{
          // console.log("bla bla bla blasdfadsfsdf:",error);
            throw(error);
          }
        )
      }
    }

    const HospitalModalClose = () => {
      sethospitalConnectOpen(false);
      GetConnectedHospitals();
    }
    return (
        
      <Container 
      style={{width: "70vw"}}>
        {
            <Button onClick={() => sethospitalConnectOpen(true)} style={{marginBottom:"2%",backgroundColor:"#252525",color:"white"}}>
              Connect Hospital
            </Button>
        }
        {
          <HospitalModalDialog open={hospitalConnectOpen} handleClose={HospitalModalClose} web3={web3}/>
        }
        {
          user.role =="Pat"?(
            <MUIDataTable
          title={"E-Health-Records"}
          data={EHealthRecords}
          columns={columnsPat}
          options={options}
        />)
        :(
          <MUIDataTable
          title={"E-Health-Records"}
          data={EHealthRecords}
          columns={columnsDoc}
          options={options}
        />
        )
        }
      </Container>
    )
}

export default DisplayRecords;