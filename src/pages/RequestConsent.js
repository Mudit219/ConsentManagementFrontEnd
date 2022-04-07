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
    const abi = require("../Components/contracts/CMS.json");
    const contract = new web3.eth.Contract(abi)
    // , "0x1cff8c70b8410931055748a4f69074e7fc42124b");
    // web3.eth.Contract(abi,"0x1cff8c70b8410931055748a4f69074e7fc42124b")
    console.log(account)
    console.log(contract);
    // contract.methods.ConsentFileExists().send({from : account}, (res,err) => {
    //     console.log(res)
    // });
    // console.log(res);

    await contract.methods.AddNewUser("0xA87794DAFf4F7e5463b3BAF34EF4c45e385613a3","doctor").call({from : account},function(res,err) {
        console.log(res)
    });
    
    await contract.methods.AddNewUser("0x33e312F1C2f2151C9593DB9bb141D6fA8C6BB090","patient").call({from : account},function(res,err) {
        console.log(res)
    });
    
    // contract.methods.requestConsent().call
    // console.log(contract);
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