import React, { useEffect, useRef,useState} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import axios from "axios";
import baseURL from "../BackendApi/BackendConnection";
import { useSelector } from "react-redux";
import { selectUser } from "../Components/Redux/userSlice";
import RequestConsentDialog from "../Components/DoctorDashboard/RequestConsentDialog";
import { Container } from "@mui/material";
// import "./RequestConsent.css"
import MUIDataTable from "mui-datatables";

const RequestConsent = ({web3}) => {
  const [connectionsProfile,setConnectionsProfile] = useState([]);
  const [consents,setConsents] = React.useState();
  const user = useSelector(selectUser);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
      setOpen(true);
      GetPatientConnections();
  }

  const handleClose = () => {
      setOpen(false);
  }

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
    "Description"]

  const options = {
    filterType: 'dropdown',
    search:'true',
    customToolbarSelect: () => {},
    selectableRows: false,
    download:false,
    print:false
  };

  useEffect(async () => {
    await accessConsents();
  }, [])
  
  const accessConsents = async ()=>{
    let abi = require("../contracts/ConsentManagementSystem.json")["abi"];  
    // console.log(web3);  
    let consentJson = {"consentId" : "","Patientname":"","Doctorname":"","Consent Data":""};
    let contract = new web3.eth.Contract(abi,process.env.REACT_APP_CONTRACTADDRESS); 
    await contract.methods.GetConsents().call({from: user.account, gas: 4712388}).then(async function (consents){
        var allConsents = [];
        // console.log(consents.length);
        for(var i=0;i<consents.length;i++){
            consentJson = {"consentId" : consents[i],"Patientname":"","Doctorname":"","Description":""};
            let consent_abi = require("../contracts/Consent.json")["abi"];
            const _consent = new web3.eth.Contract(consent_abi,consents[i]);
            const status = await _consent.methods.getStatus().call({from: user.account, gas: 4712388})
            // console.log("Consent Status: " + status);
            if(status == 2){
                await _consent.methods.getTemplate().call({from : user.account,gas: 4712388}).then(async (res) => { 
                  let consent_template_abi = require("../contracts/ConsentTemplate.json")["abi"]
                  const ConsentTemplate = new web3.eth.Contract(consent_template_abi,res)
                  const desc = await ConsentTemplate.methods.GetRequestedDesc().call({from : user.account,gas: 4712388})
                  consentJson["Description"] = desc
                })
            }
                // console.log(consentJson["recordIds"]);
            if(status == 3) {
                consentJson["Description"] = "Accepted"
            }
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
    setConsents(allConsents);

    });
}

  const GetPatientConnections = async () =>  {
    let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
    let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
    
    let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS);        

    await contract.methods.GetConnectionFile().call({from : user.account},async function(err,res) {

        let ConnectionFileAbi = require("../contracts/ConnectionFile.json")["abi"];
        let ConnectionFileContract = new web3.eth.Contract(ConnectionFileAbi,res);
        
        await ConnectionFileContract.methods.GetTypeConnections(1).call({from : user.account},
            async(err,AcceptedConnectionList) => {
            // console.log(AcceptedConnectionList)
            // 
            await axios.post(`${baseURL}/Pat/Profile-public`,AcceptedConnectionList).then(
                (response)=>{
                    setConnectionsProfile(response.data);
                }
            )
        })
    })
    .catch(console.error);
}

  

  return (
    <Container style={{marginTop: "5%"}}>
      <Button variant="filled" style={{backgroundColor:"#464866",marginBottom:"2%",color:"white"}} onClick={handleOpen}> Request Consent </Button>
      <RequestConsentDialog open={open} handleClose={handleClose} connectionsProfile={connectionsProfile} web3={web3}/>
      <MUIDataTable
            title={"Consent Table"}
            data={consents}
            columns={ConsentHeader}
            options={options}
        />
    </Container>
    // 

  )
}

export default RequestConsent;