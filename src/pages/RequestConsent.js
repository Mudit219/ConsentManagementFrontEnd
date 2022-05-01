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
import "./RequestConsent.css"


const RequestConsent = ({web3}) => {
  // const [formValues, setFormValues] = useState(formDefaultValues);
  // const patientId = useRef('')
  const selectedPatient = useRef("")
  const [description, SetDescription] = useState("")
  // const [patientPhone, setPatientPhone] = useState('')
  // const [connectedDoctors,setConnectedPatients] = useState([]);
  const [connectionsProfile,setConnectionsProfile] = useState([]);
  const user = useSelector(selectUser);

  useEffect(()=>{
    GetPatientConnections();
  },[]);


  const GetPatientConnections = async () =>  {
    let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
    let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
    
    let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS);        

    await contract.methods.GetConnectionFile().call({from : user.account},async function(err,res) {

        let ConnectionFileAbi = require("../contracts/ConnectionFile.json")["abi"];
        let ConnectionFileContract = new web3.eth.Contract(ConnectionFileAbi,res);
        
        await ConnectionFileContract.methods.GetTypeConnections(1).call({from : user.account},
            async(err,AcceptedConnectionList) => {
            console.log(AcceptedConnectionList)
            AcceptedConnectionList.forEach(async (doctorId) => {
                console.log(doctorId);
                axios.get(`${baseURL}/Pat/${doctorId}/Profile-public`).then(
                    (response)=>{
                        setConnectionsProfile([...connectionsProfile,response.data]);
                    }
                )
            });
        })
    })
    .catch(console.error);
}

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("This is full value: " + selectedPatient.current);

    selectedPatient.current = selectedPatient.current.substring(selectedPatient.current.indexOf("(")+1,selectedPatient.current.indexOf(")"));
    
    console.log("This is selected: " + selectedPatient.current);

    console.log("These are form values " + selectedPatient.current + " " + description);
    // Deploying the contract 

    let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
    let CONTRACT_ADDRESS= process.env.REACT_APP_CONTRACTADDRESS;
    console.log(CONTRACT_ADDRESS)    
    
    let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS); 
    
    // console.log(contract,patientId);

    await contract.methods.requestConsent(description,selectedPatient.current).send({from: user.account, gas: 4712388}).then(console.log);

    console.log("requestConsent is working")
    SetDescription('');
  };


  return (
    <form onSubmit={handleSubmit}>
        <div class="container">
            <h1 style={{ color: 'black' }}>RequestConsent</h1>
            <hr />
            <Grid item className="Patient" >
                <div><label for="Patient"><b>Patient Name</b></label></div>
                <TextField id="outlined-basic" select required label="Enter Patient Name" variant="outlined" style={{ marginTop: '10px' ,width:'500px'}} value={selectedPatient.current} onChange={(e) => selectedPatient.current = e.target.value} >
                { 
                    connectionsProfile.map((item)=>(
                    <MenuItem key={item.metaId} value= {item.name + "(" + item.metaId + ")" } >
                      {item.name + "(" + item.metaId + ")" }
                    </MenuItem>
                    ))
                }
                </TextField>
            </Grid>
            <Grid item className="Mobile">
                <div><label for="Mobile" ><b>Mobile Number</b></label></div>
                <TextField id="standard-textarea" label="Mobile" variant="outlined" required style={{ marginTop: '10px' ,width:'500px'}} multiline value={"78979845"} 
                // onChange={(e) => setPatientPhone(e.target.value)} 
                >
                </TextField>
            </Grid>
            
            <Grid item className="Description">
                <div><label for="Description"><b>Description</b></label></div>
                <TextField id="standard-textarea" label="Enter the description for records" variant="outlined" required style={{ marginTop: '10px' ,width:'500px'}} multiline value={description} onChange={(e) => SetDescription(e.target.value)} >
                </TextField>
            </Grid>
            <Button class="registerbtn" type="submit" style={{ marginTop: '1rem' } } >Request Consent</Button>
            
        </div >
    </form >

  )
};
export default RequestConsent;