import React, { useState, useEffect,useRef } from "react";
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
import { ToastContainer, toast } from 'react-toastify';
import { Fab } from "@mui/material";


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
  const token = useRef("");
  // create state variables for each input
  const [firstName, setFirstName] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [doctorLicense, setDoctorLicense] = useState("");
  const [password,setPassword] = useState("");
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

  useEffect(()=>{

  },[token]);

  let navigate = useNavigate();
  
  const routeChange = () => {
    let path = `/E-Health-Records`;
    navigate(path);
  };


  const Register = async () => {
    let abi = require("../../contracts/ConsentManagementSystem.json")["abi"];
    let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
    
    console.log(abi)
    console.log(CONTRACT_ADDRESS);

    let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS); 
  
    console.log(contract);

    // You'lll do a backend call here to store on this user on the blockchain

    // if(role === "Doc"){
    //   await contract.methods.AddNewUser(account,"doctor").send({from : process.env.REACT_APP_OWNERADDRESS , gas: 4712388}).then(console.log)
    //   await contract.methods.DoctorExists().call({from:account}).then(console.log);
    //   console.log("You have successfully registered on the CMS Platform");
    // }
    // else if(role === "Pat"){
    //   await contract.methods.AddNewUser(account,"patient").send({from : process.env.REACT_APP_OWNERADDRESS , gas: 4712388}).then(console.log)
    //   console.log("You have successfully registered on the CMS Platform");
    // }

  };

  
  const RegisterSubmit = (e) => {
    e.preventDefault();
    if(!account){
      toast.warn('Please connnect your Metamask', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
    if (firstLogin) {
        // Register();
        if(role === "Doc" && account){
          axios
            .post(`${baseURL}/admin/Add${role}`, {
              metaId: account,
              name: firstName,
              doctorLicense: doctorLicense,
              password:password
            })
            .then(
              (response) => {
                Register();
                console.log("Working!!!!" + response.data);
                toast.success('Registeration Successful!', {
                  position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                handleClose();
                },
              (error) => {
                toast.error('Invalid Credentials!', {
                  position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                console.log(account);
                console.log(firstName);
                console.log(doctorLicense);
                console.log(password);
                // setLoginError("Failed");
                throw error;
              }
            );
          }
          else if(role === "Pat"){
            axios
            .post(`${baseURL}/admin/Add${role}`, {
              metaId: account,
              name: firstName,
              phone: phoneNumber,
              password:password
            })
            .then(
              (response) => {
                Register();
                toast.success('Registeration Successful!', {
                  position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                console.log("Working!!!!" + response.data);
                handleClose();
                },
              (error) => {
                toast.error('Invalid Credentials', {
                  position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                console.log(account);
                console.log(firstName);
                console.log(phoneNumber);
                console.log(password);
                // setLoginError("Failed");
                throw error;
              }
            );
          }
    }
    // ---------------------------------------------------------------------------------------
    // Comment this line once fully integrated with backend
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
    axios.get(`${baseURL}/${role}/${account}/Valid`).then(
      (response) => {
        console.log("Check valid or not " + response.data);
        toast.success('Please Register!', {
          position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        if (response.data == false) setfirstLogin(true);
      },
      (error) => {
        toast.error('Something went wrong!', {
          position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        throw error;
      }
    );
  };

  const LoginSubmit = (e)=>{
    e.preventDefault();
    console.log("I am here")
    axios.post(`${baseURL}/login`,{
      username: account,
      password: password
    }).then(
      (response)=>{
        console.log(response.headers);
        token.current = response.headers['authorization'];
        console.log("Token: " + token.current);
        axios
        .get(`${baseURL}/${role}/${account}/Profile`,{
          headers:{
            'Authorization': token.current
          }
        }).then(
          (response)=>{
            dispatch(
              login({
                account: account,
                firstName: response.data.name,
                phoneNumber: response.data.phone,
                role: role,
                token: token.current
              }));
              toast.success('Login Successful!', {
                position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
          handleClose();
          // routeChange();
          },
          (error)=>{
            toast.error('Something Went Wrong', {
              position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            console.log("Couldn't fetch user details");
            setPassword("");
            // setLoginError("Failed");
            throw(error);
          }
        )
      },
      (error)=>{
        setPassword("");
        toast.error('Invalid Password!', {
          position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        console.log("Invalid Password!")
        // throw(error);
      }
    )
  }


  return (
    <div>
      {
        !account && (
          <Button variant="contained" onClick={ConnectWallet} style={{marginTop:"10px",marginLeft:"50px"}}>
            Connect Metamask Wallet
          </Button>
        )
      }
      {
        (firstLogin == true) ? (
        <form className={classes.root} onSubmit={RegisterSubmit}>
          {account && (
            <Fab variant="extended" color="secondary"  sx={{borderRadius:"20px"}}>{"Metamask: " + account}</Fab>
          )}
          <h4>
            {" "}
            Please fill in the details:
          </h4>
            <TextField
              label="Full Name"
              variant="outlined"
              multiline
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {role=="Pat" && (
              <TextField
              label="Phone Number"
              variant="outlined"
              multiline
              required
              value={phoneNumber}
              onChange={(e) => setphoneNumber(e.target.value)}
            />
            )}
            
            {role == "Doc" && (
                <TextField
                label="Doctor License"
                variant="outlined"
                multiline
                required
                value={doctorLicense}
                onChange={(e) => setDoctorLicense(e.target.value)}
              />
            )}
            <Button type="submit" variant="contained" color="primary">
              Register
            </Button>
        </form>
        )
        :(
          <form className={classes.root} onSubmit={LoginSubmit}>
          <Fab variant="extended" color="secondary" sx={{borderRadius:"20px"}}>{"Metamask: " + account}</Fab>
            <Button variant="contained" onClick={()=>disconnect}>
              Disconnect
            </Button>
            <p>
              {" "}
              Please Enter your password:
            </p>
            <Stack>
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            </Stack>
           
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
            
          </form>
          )
      }
    </div>
  );
};

export default LoginForm;
