import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useNavigate } from "react-router-dom";
import {
    Mainnet,
    DAppProvider,
    useEtherBalance,
    useEthers,
    Config,
} from '@usedapp/core'
import {useDispatch} from "react-redux";
import { login } from "../features/userSlice";

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
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { activateBrowserWallet, deactivate, account } = useEthers()
  const [firstLogin,setfirstLogin] = useState(true);

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/`; 
    navigate(path);
  }

  const dispatch = useDispatch();

  const handleSubmit = e => {
    e.preventDefault();
    console.log(firstName, lastName, email, password);

    routeChange();
    // Send a call to backend to register user if first time otherwise nothing just login 
    dispatch(login({
            account: account,
            firstName: firstName,
    }));

    handleClose();


  };

  const disconnect = () => {
      deactivate();
  }
  
  const ConnectWallet = async() => {
      activateBrowserWallet();
        //   await window.ethereum.enable();
        //   const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        //   const account = accounts[0];
        //   console.log(account)
        //   window.ethereum.on('accountsChanged', function (accounts) {
        //   // Time to reload your interface with accounts[0]!
        //       console.log(accounts[0])
        //   });
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