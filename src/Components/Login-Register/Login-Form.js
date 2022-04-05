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

const Form = ({ handleClose }) => {
  const classes = useStyles();
  // create state variables for each input
  const [firstName, setFirstName] = useState('');
  const [firstLogin,setfirstLogin] = useState(true);

  const injectedConnector = new InjectedConnector({supportedChainIds: [1,3, 4, 5, 42, 1337],})
  const { chainId, account, activate, active,library } = useWeb3React()
  // const { activateBrowserWallet, deactivate, account } = useEthers()
  useEffect(() => {
    console.log(chainId, account, active)
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

    routeChange();
    // Send a call to backend to register user if first time otherwise nothing just login 
    dispatch(login({
            account: account,
            firstName: firstName,
    }));

    handleClose();


  };

  const disconnect = () => {
      // deactivate();
  }
  
  const ConnectWallet = async() => {
      // activateBrowserWallet();
      activate(injectedConnector);
      console.log(firstLogin)
      setfirstLogin(true);

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
        {firstLogin &&
        (<TextField
            label="First Name"
            variant="filled"
            required
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
        />)}
        <Button type="submit" variant="contained" color="primary">
            Signup
        </Button>
    </form>
  );
};

export default Form;