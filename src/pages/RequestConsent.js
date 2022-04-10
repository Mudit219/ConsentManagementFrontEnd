import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import bytecode from '../contracts/Bytecode'
import owner_id from "../contracts/Owner_credentials";
import axios from "axios";
import baseURL from "../BackendApi/BackendConnection";
import { useSelector } from "react-redux";
import { selectUser } from "../Components/Redux/userSlice";
import "./RequestConsent.css"


// const account_ids = {
//   owner: owner_id,
//   doctor: "0x16A86133196110F3DDEbc5385f966352849eB88d",
//   patient: "0x42ce918A1FD73D6129d0e080fFEFd00fF2363a14"
// }

const Form = ({web3}) => {
  // const [formValues, setFormValues] = useState(formDefaultValues);
  const [patientId, SetPatientId] = useState('')
  const [patientName, SetPatientName] = useState('')
  const [description, SetDescription] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [connectedPatients,setConnectedPatients] = useState([]);
  const user = useSelector(selectUser);

  useEffect(()=>{
    loadPatient();
  },[]);
  useEffect(()=>{
    // loadPatient();
    SetPatientId(patientId);
  },[patientId]);
  // const handleInputChange = (e) => {
  //   console.log(e);
  //   const { name, value } = e.target;
  //   setFormValues({...formValues,[name]: value,});
  // };

  // Loading all the connections with patients
  const loadPatient=()=>{
    axios.get(`${baseURL}/${user.role}${user.account}/Get-Connections`).then(
      (response)=>{
          setConnectedPatients(response.data);
      },
      (error)=>{
        throw(error);
      }
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

      connectedPatients.map((item)=>{
        console.log(item.patientPhone === patientPhone , item.patientName === patientName)
        if(item.patientPhone === patientPhone && item.patientName === patientName){
          SetPatientId(item.patientId);
        }
      })

    // alert("Request Send Successfully")
    console.log(connectedPatients);
    console.log("These are form values " + patientName + " " + description + " " + patientId + " " + patientPhone);
    // Deploying the contract 

    let abi = require("../contracts/CMS.json");    
    // let deploy_contract = new web3.eth.Contract(abi)

    // let payload = {
    //   data: bytecode_contract,
    //   arguments: ['My Company',account_ids.owner]
    // }
    // let parameter = {
    //   from: account_ids.owner,
    //   gas: 4712388,
    //   gasPrice: 100000000000
    // }

    // console.log("Blah Blah");
    // console.log(account_ids.owner);
    // console.log(deploy_contract);

    // // 0x71950D6FCf532febDeC198761C0DC358c75BC7F9
    let CONTRACT_ADDRESS="0xf037F438832DeBc059131cE73CB6bdE735736b38";
    // await deploy_contract.deploy(payload).send(parameter, (err, transactionHash) => {
    //   console.log('Transaction Hash :', transactionHash);
    // }).on('confirmation', () => {}).then((newContractInstance) => {
    //   console.log('Deployed Contract Address : ', newContractInstance.options.address);
    //   CONTRACT_ADDRESS=newContractInstance.options.address;

    // })
    // console.log(CONTRACT_ADDRESS);

    // // Accessing the deployed contract
    let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS); 
  
    // console.log(contract);

    // await contract.methods.AddNewUser(account_ids.doctor,"doctor").send(
    //   {from : account_ids.owner , gas: 4712388}).then(console.log)
    
    // await contract.methods.AddNewUser(account_ids.patient,"patient").send(
    //   {from : account_ids.owner , gas: 4712388}).then(console.log)

    // console.log("AddNewUser is working")

    // await contract.methods.GetConsentFile().call(
    //   {from: account_ids.doctor, gas:4712388}).then(console.log);

    // console.log("ConsentFileExists is working")
    
    await contract.methods.requestConsent(description,patientId).send({from: user.account, gas: 4712388}).then(console.log);

    console.log("requestConsent is working")

    SetPatientId(''); 
    SetDescription('');
    setPatientPhone('');

    
  };

  return (
    <form onSubmit={handleSubmit}>
        <div class="container">
            <h1 style={{ color: 'black' }}>RequestConsent</h1>
            <hr />
            <Grid item className="Patient" >
                <div><label for="Patient"><b>Patient Name</b></label></div>
                <TextField id="outlined-basic" select required label="Enter Patient Name" variant="outlined" style={{ marginTop: '10px' ,width:'500px'}} value={patientName} onChange={(e) => SetPatientName(e.target.value)} >
                { 
                    connectedPatients.map((item)=>(
                    <MenuItem key={item.patientName} value= {item.patientName} >
                      {item.patientName}
                    </MenuItem>
                    ))
                }
                </TextField>
            </Grid>
            <Grid item className="Mobile">
                <div><label for="Mobile" ><b>Mobile Number</b></label></div>
                <TextField id="standard-textarea" label="Mobile" variant="outlined" required style={{ marginTop: '10px' ,width:'500px'}} multiline value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} >
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
export default Form;