import React, { useEffect, useRef,useState} from "react";
import axios from "axios";
import { Container } from "@mui/material";

import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import zIndex from "@mui/material/styles/zIndex";
import ModalDialog from '../Components/Login-Register/ModalDialog';

import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";

const useStyles = makeStyles((theme) => ({
  background: {
    // position: "fixed",
    background: 'url(' + require('../Assets/Images/LandingPage.png') + ')',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    top: "10px",
    // zIndex: -10
  },
  AppBarBackground: {
    background: "#000000"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));


const LandingPage = ({web3}) => {

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const supportedChainIds = [8081]
  const [supported,setSupported] = useState(false);
  
  const injectedConnector = new InjectedConnector({
    supportedChainIds: supportedChainIds,
  });
  
  const { chainId, account, activate, active, library } = useWeb3React();
  
  useEffect(() => {
    console.log("Inside Use Effect chainging ChainId",chainId,active,account)
    if(!active) {
      activate(injectedConnector)
    }
    if(supportedChainIds.includes(chainId)) {
      setSupported(true)
    }
    else {
      setSupported(false)
    }
  },[chainId,account,library]);
  
  const handleOpen = async() => {
    // await window.ethereum.enable()
    activate(injectedConnector);
    console.log(chainId in supportedChainIds,active,account)
    if(chainId in supportedChainIds) {
      setSupported(true)
    }
    
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNonSupportOpen = () => {
    
    console.log("Inside Use Effect chainging ChainId",chainId,active,account)
    if(!active) {
      activate(injectedConnector)
    }
    if(supportedChainIds.includes(chainId)) {
      setSupported(true)
      handleOpen(true);
    }
    else {
      setSupported(false)
      alert("You have been connected to the wrong Chain. Please Connect to Liberty Shardeum 2.x")
    }
  }
  return (
    
    <Box
    >
      <AppBar position="static" className={classes.AppBarBackground}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Healthcare CMS
          </Typography>
          {
              supported ? 
              (<Button color="inherit" onClick={() => handleOpen()}>Login</Button>)
              :
              (<Button color="inherit" onClick={() => handleNonSupportOpen()}>Login</Button>)
          }
            
        </Toolbar>
      </AppBar>
      <Box className={classes.background}></Box>
      <ModalDialog open={open} handleClose={handleClose} web3={web3}/>
    </Box>
    
  );
}

export default LandingPage;

