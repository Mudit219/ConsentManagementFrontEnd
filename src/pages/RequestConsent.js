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

const defaultValues = {
  id: "",
  desc : ""
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
    const contract = new web3.eth.Contract(abi["abi"],"0x91cb7274Abe49A6eDF4b0e67d456A0DBb21398be")

    // , "0x1cff8c70b8410931055748a4f69074e7fc42124b");
    // web3.eth.Contract(abi,"0x1cff8c70b8410931055748a4f69074e7fc42124b")
    console.log(account)
    console.log(contract);
    // contract.methods.ConsentFileExists().send({from : account}, (res,err) => {
    //     console.log(res)
    // });
    // console.log(res);


    var res = await contract.methods.AddNewUser("0x528F0E67258a254eE95d77ef4C9665c8d294A0d5","doctor").send({from : "0xDC22e8663785dD65Ee6FB55Ab9D7c0711418de68", gas : '1000000'})
    console.log(res)

    var res =  await contract.methods.AddNewUser("0xc704C6FA6CD7b397B5B6d605f05A9Daa2e688Ab3","patient").send({from : "0xDC22e8663785dD65Ee6FB55Ab9D7c0711418de68", gas : '1000000'})
    console.log(res)
    
    console.log(contract.methods)
    console.log(formValues.id)
    var res =  await contract.methods.requestConsent(formValues.desc,"0xc704C6FA6CD7b397B5B6d605f05A9Daa2e688Ab3").send({from : "0x528F0E67258a254eE95d77ef4C9665c8d294A0d5", gas : '1000000'})
    // console.log(res)
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