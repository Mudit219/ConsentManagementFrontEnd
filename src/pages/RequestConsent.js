import React, { useState } from "react";
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
import bytecode from '../contracts_temp/Bytecode'
import owner_id from "../contracts_temp/Owner_credentials";

const defaultValues = {
  id:"",
  desc:""
};



const Form = ({web3}) => {
  const [formValues, setFormValues] = useState(defaultValues);
  const account_ids = {
    owner: owner_id,
    doctor: "0x544eeE51a9C156d12e6FAc5C626768a055a6b770",
    patient: "0xB5DCCCDc66c54705218b61d771312b6053dAF77e"
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("These are form values" + formValues.id + " " + formValues.desc);
    // Deploying the contract 

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
  
    console.log(contract);

    await contract.methods.AddNewUser(account_ids.doctor,"doctor").send(
      {from : account_ids.owner , gas: 4712388}).then(console.log)
    
    await contract.methods.AddNewUser(account_ids.patient,"patient").send(
      {from : account_ids.owner , gas: 4712388}).then(console.log)

      console.log("AddNewUser is working")

    await contract.methods.GetConsentFile().call(
      {from: account_ids.doctor, gas:4712388}).then(console.log);

    console.log("ConsentFileExists is working")
    
    await contract.methods.requestConsent("I need your blood group",account_ids.patient).send({from: account_ids.doctor, gas: 4712388}).then(console.log);

    console.log("requestConsent is working")
    
    await contract.methods.createConsent(account_ids.doctor,["a1","a2"]).send({from: account_ids.patient, gas: 4712388}).then(console.log);
    
    console.log("createConsent is working")
    
    // Right now one big problem is everytime doctor is rquestingg for consent a new consent is created even if it previously existed
    // We also need to have a look at how to get the logs from events i am writing a sample code here
    
    // console.log(myContract.getPastEvents('<event name>');



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
      <Grid container alignItems="center" justify="center" direction="column">
        <Grid item>
        <TextField
            id="age-input"
            name="id"
            label="Patient ID"
            type="text"
            style={{width:'500px'}}
            value={formValues.id}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item>
          <TextField
            id="age-input"
            name="desc"
            label="Request Description"
            type="text"
            
            style={{width:'500px'}}
            value={formValues.desc}
            onChange={handleInputChange}
          />
        </Grid>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </Grid>
    </form>
  );
};
export default Form;