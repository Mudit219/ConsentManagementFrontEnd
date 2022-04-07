import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useNavigate } from "react-router-dom";

import {useDispatch} from "react-redux";
import { login } from "../features/userSlice";

import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { Stack } from '@mui/material';
import axios from 'axios';
import baseURL from '../../BackendApi/BackendConnection';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),

    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '300px',
    },
    '& .MuiButtonBase-root': {
      margin: theme.spacing(2),
    },
  },
}));

const Form = ({ handleClose,role,firstLoginRoot }) => {
  const classes = useStyles();
  // create state variables for each input
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  
  const [firstLogin,setfirstLogin] = useState(firstLoginRoot);

  const injectedConnector = new InjectedConnector({supportedChainIds: [1,3, 4, 5, 42, 1337],})
  const { chainId, account, activate, active,library } = useWeb3React()
  // const { activateBrowserWallet, deactivate, account } = useEthers()
  useEffect(() => {
    setfirstLogin(firstLoginRoot)
    console.log(chainId, account, firstLogin,firstLoginRoot)
    },);

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/`; 
    navigate(path);
  }

  const dispatch = useDispatch();

  const handleSubmit = e => {
    e.preventDefault();
    // console.log(firstName, lastName, email, password);
    if(firstLogin) {
        // Send a call to backend to register user if first time otherwise nothing just login 
      axios.post(`${baseURL}/Add${role}`,{metaId:account,name:firstName,phone:phoneNumber}).then(
        (response)=>{
          console.log("Working!!!!"+response.data);
        },  
        (error)=>{
          throw(error);
        }
      )
    }
    
    dispatch(login({
            account: account,
            firstName: firstName,
            phoneNumber: phoneNumber,
            role: role
    }));

    handleClose();

    routeChange();

  };

  const disconnect = () => {
      // deactivate();
  }
  
  const ConnectWallet = async() => {
      // activateBrowserWallet();
      await activate(injectedConnector);
      console.log("Existing User?: " + firstLogin)
      // Send a call to backend to register user if first time otherwise nothing just login 
      // await window.ethereum.enable();
      // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      // const account = accounts[0];
      
      console.log("My Account is: "+ account);
      axios.get(`${baseURL}/${role}${account}/Valid`).then(
        (response)=>{
          console.log("Check valid or not " + response.data);
          if(response.data==false)
            setfirstLogin(true);
        },
        (error)=>{
          throw(error);
        }
      )



      //   Make a axios call with the accountID to see if this person is a first time login user

      // setfirstLogin(...);

    }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
        {account ? (<div>
                        <p>
                            {account}
                        </p>
                        <Button variant="contained" onClick={disconnect}>
                            Disconnect
                        </Button>
                    </div>
                )
                :(<Button variant="contained" onClick={ConnectWallet}>
                Connect Metamask Wallet
            </Button>)
                 
        }
        <p> If the above field is not The Account you used to Login please change it in you metamask plugin</p>
        {firstLogin==true 
        ?(<Stack><TextField
            label="Full Name"
            variant="filled"
            required
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
        />
            <TextField
            label="Phone Number"
            variant="filled"
            required
            value={phoneNumber}
            onChange={e => setphoneNumber(e.target.value)}
        />
        </Stack>)
        :"Nope"}
        <Button type="submit" variant="contained" color="primary">
            Login
        </Button>
    </form>
  );
};

export default Form;