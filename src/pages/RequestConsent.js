import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const defaultValues = {
  name: "",
  age: 0,
  gender: "",
  os: "",
  favoriteNumber: 0,
};

const Form = ({account,web3}) => {
  const [formValues, setFormValues] = useState(defaultValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleSliderChange = (name) => (e, value) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(formValues);
    // console.log(web3)
    const abi = require("../Components/contracts/ConsentManagementSystem.json");
    console.log(abi)

    const ContractAddress = "0xcf250c794a3591f4Ed22930564859a3eD84DE1Fe"
    const contract = new web3.eth.Contract(abi["abi"],ContractAddress);
    // , "0x1cff8c70b8410931055748a4f69074e7fc42124b");
    // web3.eth.Contract(abi,"0x1cff8c70b8410931055748a4f69074e7fc42124b")
    console.log(account)
    console.log(contract);
    // contract.methods.ConsentFileExists().send({from : account}, (res,err) => {
    //     console.log(res)
    // });
    // console.log(res);

    const OwnerAccount = process.env.REACT_APP_OWNERADDRESS
    console.log(OwnerAccount)

    console.log(contract.methods)

    var res = await contract.methods.AddNewUser("0x528F0E67258a254eE95d77ef4C9665c8d294A0d5","doctor").send({from : OwnerAccount, gas: '1000000'})
    console.log(res)
    
    // var res = await contract.methods.AddNewUser("0xc704C6FA6CD7b397B5B6d605f05A9Daa2e688Ab3","patient").send({from : OwnerAccount, gas: '1000000'})
    // console.log(res)
    
    // console.log(formValues)
    // var res = contract.methods.requestConsent(formValues.desc,formValues.id).send({from : "0x528F0E67258a254eE95d77ef4C9665c8d294A0d5", gas: '1000000'})
    // console.log(res);

  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container alignItems="center" justify="center" direction="column">
        <Grid item>
        <TextField
            id="age-input"
            name="text"
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
            name="text"
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