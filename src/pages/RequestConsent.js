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
import owner_id from "../contracts/Owner_credentials";
import axios from "axios";
import baseURL from "../BackendApi/BackendConnection";
import { useSelector } from "react-redux";
import { selectUser } from "../Components/Redux/userSlice";
import "./RequestConsent.css"


// const formDefaultValues = {
//   id:"",
//   desc:""
// };

const account_ids = {
  owner: owner_id,
  doctor: "0x22e6D372bfd0D97F883623952187d99331C52e80",
  patient: "0x4278C94eB9bFb39dda0eCD27d14F5Ff75F6db979"
}

const Form = ({web3}) => {
  // const [formValues, setFormValues] = useState(formDefaultValues);
  const [PatientId, SetPatientId] = useState('')
  const [Description, SetDescription] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [connectedPatients,setConnectedPatients] = useState([]);
  const user = useSelector(selectUser);

  useEffect(()=>{
    loadPatient();
  },[]);

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
  // const account_ids = {
  //   owner: owner_id,
  //   doctor: "0x544eeE51a9C156d12e6FAc5C626768a055a6b770",
  //   patient: "0xB5DCCCDc66c54705218b61d771312b6053dAF77e"  
  // }

  const handleSubmit = async (event) => {
    event.preventDefault();
    SetPatientId(PatientId);
    SetDescription(Description);
    setPatientPhone(patientPhone);

    // alert("Request Send Successfully")

    let DeployedContract = require("../contracts/ConsentManagementSystem.json");
    
    let CMS_ContractAddress = DeployedContract["networks"][Object.keys(DeployedContract["networks"])[0]]["address"];
    let CMS_abi = DeployedContract["abi"]
    // console.log();
    // let bytecode_contract = bytecode;
    
    // let deploy_contract = new web3.eth.Contract(abi)

    // let payload = {
    //   data: bytecode_contract,
    //   arguments: ['My Company']
    // }
    
    // let parameter = {
    //   from: account_ids.owner,
    //   gas: 5000000,
    //   // "gasPrice": currGas,
    //   // "gasLimit": "0x3A980",
    // }

    // console.log("Blah Blah");
    // console.log(account_ids.owner);
    // console.log(deploy_contract);

    // // 0x71950D6FCf532febDeC198761C0DC358c75BC7F9
    // let CONTRACT_ADDRESS='';
    // await deploy_contract.deploy(payload).send(parameter, (err, transactionHash) => {
    //   console.log('Transaction Hash :', transactionHash);
    // }).on('confirmation', () => {}).then((newContractInstance) => {
    //   console.log('Deployed Contract Address : ', newContractInstance.options.address);
    //   CONTRACT_ADDRESS=newContractInstance.options.address;

    // })
    // console.log(CONTRACT_ADDRESS);

    // Accessing the deployed contract
    let contract = new web3.eth.Contract(CMS_abi,CMS_ContractAddress); 
  
    // console.log(contract);

    // await contract.methods.AddNewUser(account_ids.doctor,"doctor").send(
    //   {from : account_ids.owner , gas: 4712388}).then(console.log)
    
    // await contract.methods.AddNewUser(account_ids.patient,"patient").send(
    //   {from : account_ids.owner , gas: 4712388}).then(console.log)

    // console.log("AddNewUser is working")

    // await contract.methods.GetConsentFile().call(
    //   {from: account_ids.doctor, gas:4712388}).then(console.log);

    // console.log("ConsentFileExists is working")
    
    // await contract.methods.requestConsent(formValues.desc,formValues.id).send({from: account_ids.doctor, gas: 4712388}).then(console.log);

    // console.log("requestConsent is working")

    SetPatientId('');
    SetDescription('');
    setPatientPhone('');


    // Note you are getting the address of all the consents here so you need to use web3.eth.Contract function along with the respective abi
    // to access the address of the contract
    var consents = [];
    await contract.methods.GetConsents().call({from: account_ids.doctor, gas:4712388}).then( async(consents,err) => {
      // address
      for(var i=0;i<consents.length;i++) {
        const ContractABI = require("../contracts_temp/Consent.json");
        const _consent = new web3.eth.Contract(ContractABI,consents[i]);
        // _consent.getPatient()
        // console.log(_consent);
        await _consent.methods.getTemplate().call({from: account_ids.doctor, gas:4712388}).then( (consentTemplate) => {
          const ConsentTemplateABI = require("../contracts_temp/ConsentTemplate.json");
          const _consentTemplate = new web3.eth.Contract(ConsentTemplateABI,consentTemplate);
          _consentTemplate.methods.GetConsentedRecords().call({from: account_ids.doctor, gas:4712388}).then(console.log)
        });
      }
    });

    
  };

  return (
    <form onSubmit={handleSubmit}>
        <div class="container">
            <h1 style={{ color: 'black' }}>RequestConsent</h1>
            <hr />
            <Grid item className="Patient" >
                <div><label for="Patient"><b>Patient Name</b></label></div>
                <TextField id="outlined-basic" select required label="Enter Patient Name" variant="outlined" style={{ marginTop: '10px' ,width:'500px'}} value={PatientId} onChange={(e) => SetPatientId(e.target.value)} >
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
                <TextField id="standard-textarea" label="Enter the description for records" variant="outlined" required style={{ marginTop: '10px' ,width:'500px'}} multiline value={Description} onChange={(e) => SetDescription(e.target.value)} >
                </TextField>
            </Grid>
            <Button class="registerbtn" type="submit" style={{ marginTop: '1rem' } } >Request Consent</Button>
        </div >
    </form >
  )
}

export default Form;