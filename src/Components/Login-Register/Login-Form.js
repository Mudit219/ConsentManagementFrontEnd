import React, { useState, useEffect,useRef } from "react";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
// import Button from "@material-ui/core/Button";
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
import { Fab,Container } from "@mui/material";
import { Grid, Card, CardMedia, CardActionArea, Typography, Button } from '@material-ui/core';

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
      backgroundColor:"#25274D",
      color:"white",
      borderRadius:"10px",
      margin: theme.spacing(2),
    },
  },
}));

const LoginForm = ({ handleClose, web3 }) => {
  const classes = useStyles();
  const token = useRef("");

  // create state variables for each input
  const [firstName, setFirstName] = useState("");
  const [abhaId, setabhaId] = useState("");
  const [doctorLicense, setDoctorLicense] = useState("");
  const [password,setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [firstLogin, setfirstLogin] = useState(true);
  const [role, setRole] = useState('Pat');

  const dispatch = useDispatch();

  const injectedConnector = new InjectedConnector({
    supportedChainIds: [8081],
  });
  const { chainId, account, activate, active, library } = useWeb3React();
  
  

  useEffect(() => {
    axios.get(`${baseURL}/admin/Valid/${role}/${account}`).then(
      (response)=>{
        console.log("Check valid or not " + response.data);

        if(response.data==false)
          setfirstLogin(true);
        else
          setfirstLogin(false);

      },
      (error)=>{
        throw(error);
      }
    )
    // console.log(chainId, account, firstLogin, firstLoginRoot);
  },[account,role]);

  useEffect(()=>{

  },[token]);

  let navigate = useNavigate();
  
  const routeChange = () => {
    let path = `/E-Health-Records`;
    navigate(path);
  };

  
  const RegisterSubmit = (e) => {
    e.preventDefault();
    // console.log("dsfadsf");
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
              password:password,
              doctorImage:'/Profile_img.png'
            })
            .then(
              (response) => {
                // Register();
                // console.log("Working!!!!" + response.data);
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
                toast.error('User already exists!', {
                  position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                // console.log(account);
                // console.log(firstName);
                // console.log(doctorLicense);
                // console.log(password);
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
              abhaId: abhaId,
              password:password,
              patientImage:'/Profile_img.png'
            })
            .then(
              (response) => {
                // Register();
                toast.success('Registeration Successful!', {
                  position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                // console.log("Working!!!!" + response.data);
                handleClose();
                },
              (error) => {
                toast.error('User already exists', {
                  position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                // console.log(account);
                // console.log(firstName);
                // console.log(abhaId);
                // console.log(password);
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
    // console.log("Existing User?: " + firstLogin);
    // console.log("My Account is: " + account);
    axios.get(`${baseURL}/${role}/${account}/Valid`).then(
      (response) => {
        // console.log("Check valid or not " + response.data);
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
    // console.log("I am here")
    axios.post(`${baseURL}/login`,{
      username: account,
      password: password
    }).then(
      (response)=>{
        // console.log(response.headers);
        token.current = response.headers['authorization'];
        // console.log("Token: " + token.current);
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
            // console.log("Couldn't fetch user details");
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
        // console.log("Invalid Password!")
        // throw(error);
      }
    )
  }

  

  const handleRoleSelection = (gender) => {
    setRole(gender);
  };

  
  return (
    <Container sx={{paddingY: "30px"}}>
      {
        <Grid container spacing={2} sx={{marginTop: "20px"}}>
          <Grid item xs={12} sm={2}>
          </Grid>
          <Grid item xs={12} sm={4}  style={{ borderRadius: '5%',backgroundColor: role === 'Doc' ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
            <Card onClick={() => handleRoleSelection('Doc')} raised={role === 'Doc'}>
              <CardActionArea>
                <CardMedia component="img" src={require("../../Assets/Images/doctor-image.jpg")} style={{ height: '100%', width: '100%'  , display: 'flex', alignItems: 'center',justifyContent: 'center' }} alt="Doctor" />
                <Typography variant="h6" align="center" style={{ marginTop: '8px' }}>
                  Doctor
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4} style={{ borderRadius: '5%', backgroundColor: role === 'Pat' ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
            <Card onClick={() => handleRoleSelection('Pat')} raised={role === 'Pat'}>
              <CardActionArea>
                <CardMedia component="img" src={require("../../Assets/Images/patient-image.png")} style={{ height: '100%', width: '100%'  , display: 'flex', alignItems: 'center',justifyContent: 'center' }} alt="Patient" />
                <Typography variant="h6" align="center" style={{ marginTop: '8px' }}>
                  Patient
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={2}>
          </Grid>
        </Grid>
      }
      {
        (firstLogin == true) ? (
        <form className={classes.root} onSubmit={RegisterSubmit}>
          {
          active ? (
                    <Button variant="contained" color="info" sx={{borderRadius:"30px",backgroundColor:"#25274D"}}>{"✅ Wallet : " + account}</Button>
                  ) : (
            <Button variant="contained" onClick={ConnectWallet} style={{marginTop:"10px",marginLeft:"50px",backgroundColor:"#25274D"}}>
              Connect Metamask Wallet
            </Button>
          )
          }
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

            {role=="Pat" && (
              <TextField
              label="Abha Number"
              variant="outlined"
              multiline
              required
              value={abhaId}
              onChange={(e) => setabhaId(e.target.value)}
            />
            )}

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            
            
            {role == "Doc" && (
                <TextField
                label="Doctor License"
                variant="outlined"
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
          <Button variant="extended" color="secondary" sx={{borderRadius:"20px"}}>{"Metamask: " + account}</Button>
            {/* <Button variant="contained" onClick={()=>disconnect}>
              Disconnect
            </Button> */}
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
    </Container>
  );
};

export default LoginForm;
