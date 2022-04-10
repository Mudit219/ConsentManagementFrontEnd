import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { login } from "../Redux/userSlice";

import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Stack } from "@mui/material";
import axios from "axios";
import baseURL from "../../BackendApi/BackendConnection";
import { selectUser } from "../Redux/userSlice";
// import abi from '../contracts/ConsentManagementSystem.json'
import owner_id from '../../contracts/Owner_credentials'
import CONTRACT_ADDRESS from '../../contracts/ContractAddress'


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),

    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "300px",
    },
    "& .MuiButtonBase-root": {
      margin: theme.spacing(2),
    },
  },
}));

const LoginForm = ({ handleClose, role, firstLoginRoot,web3 }) => {
  const classes = useStyles();
  // create state variables for each input
  const [firstName, setFirstName] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [doctorLicense, setDoctorLicense] = useState("");
  const [loginError, setLoginError] = useState("");
  const [firstLogin, setfirstLogin] = useState(firstLoginRoot);

  const dispatch = useDispatch();

  const injectedConnector = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 1337],
  });
  const { chainId, account, activate, active, library } = useWeb3React();
  
  useEffect(() => {
    setfirstLogin(firstLoginRoot);
    console.log(chainId, account, firstLogin, firstLoginRoot);
  },[firstLoginRoot,account]);

  let navigate = useNavigate();
  
  const routeChange = () => {
    let path = `/E-Health-Records`;
    navigate(path);
  };


  const Register = async () => {

    let abi = require("../../contracts/CMS.json");
    // let CONTRACT_ADDRESS="0xf037F438832DeBc059131cE73CB6bdE735736b38";
    let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS); 
  
    console.log(contract);

    if(role === "Doc_"){
      await contract.methods.AddNewUser(account,"doctor").send({from : owner_id , gas: 4712388}).then(console.log)
      await contract.methods.DoctorExists().call({from:account}).then(console.log);
      console.log("You have successfully registered on the CMS Platform");
    }
    else if(role === "Pat_"){
      await contract.methods.AddNewUser(account,"patient").send({from : owner_id , gas: 4712388}).then(console.log)
      console.log("You have successfully registered on the CMS Platform");
    }
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstLogin ) {
        Register();
        if(role === "Doc_"){
          axios
            .post(`${baseURL}/Add${role}`, {
              metaId: account,
              name: firstName,
              doctorLicense: doctorLicense
            })
            .then(
              (response) => {
                console.log("Working!!!!" + response.data);
                dispatch(
                  login({
                    account: account,
                    firstName: firstName,
                    doctorLicense: doctorLicense,
                    role: role,
                  })
                );
                handleClose();
                routeChange();

                },
              (error) => {
                setLoginError("Failed");
                throw error;
              }
            );
          }
          else if(role === "Pat_"){
            axios
            .post(`${baseURL}/Add${role}`, {
              metaId: account,
              name: firstName,
              phone: phoneNumber,
            })
            .then(
              (response) => {
                console.log("Working!!!!" + response.data);
                dispatch(
                  login({
                    account: account,
                    firstName: firstName,
                    phoneNumber: phoneNumber,
                    role: role,
                  })
                );
                handleClose();
                routeChange();

                },
              (error) => {
                setLoginError("Failed");
                throw error;
              }
            );
          }
    }
    else{
      axios
        .get(`${baseURL}/${role}${account}/Profile`).then(
          (response)=>{
            dispatch(
              login({
                account: account,
                firstName: response.data.name,
                phoneNumber: response.data.phone,
                role: role,
              }));
          handleClose();
          routeChange();

          },
          (error)=>{
            console.log("ererawe");
            setLoginError("Failed");
            throw(error);
          }
        )
    }
    // ---------------------------------------------------------------------------------------
    // Comment this line once fully integrated with backend
    dispatch(
      login({
        account: account,
        firstName: firstName,
        phoneNumber: phoneNumber,
        role: role,
      }));
    routeChange();
  };
// -------------------------------------------------------------------------------------------
  const disconnect = () => {
    // deactivate();
  };

  const ConnectWallet = async () => {
    // activateBrowserWallet();
    await activate(injectedConnector);
    console.log("Existing User?: " + firstLogin);
    console.log("My Account is: " + account);
    axios.get(`${baseURL}/${role}${account}/Valid`).then(
      (response) => {
        console.log("Check valid or not " + response.data);
        if (response.data == false) setfirstLogin(true);
      },
      (error) => {
        throw error;
      }
    );
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      {account ? (
        <div>
          <p>{account}</p>
          <Button variant="contained" onClick={disconnect}>
            Disconnect
          </Button>
        </div>
      ) : (
        <Button variant="contained" onClick={ConnectWallet}>
          Connect Metamask Wallet
        </Button>
      )}
      <p>
        {" "}
        You are login for the first time, Please fill in the details:
      </p>
      {firstLogin == true && account && (
        <Stack>
          <p>
          {
            loginError === "" ? <></> : loginError
          }
          </p>
          <TextField
            label="Full Name"
            variant="filled"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          {role=="Pat_" && (
            <TextField
            label="Phone Number"
            variant="filled"
            required
            value={phoneNumber}
            onChange={(e) => setphoneNumber(e.target.value)}
          />
          )}
          
          {role == "Doc_" && (
              <TextField
              label="Doctor License"
              variant="filled"
              required
              value={doctorLicense}
              onChange={(e) => setDoctorLicense(e.target.value)}
            />
          )}
          
        </Stack>
      )}
      {
        account && (
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        )
      }
    </form>
  );
};

export default LoginForm;
