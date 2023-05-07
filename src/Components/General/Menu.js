import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { useNavigate } from "react-router-dom";
import Toolbar from '@mui/material/Toolbar';
import {useDispatch, useSelector} from "react-redux";
import { logout, selectUser } from "../Redux/userSlice";
import CustomAppBar from "../AppBar/CustomAppBar"
import './Menu.css'
import CustomSideBar from '../SideBar/CustomSideBar';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import Button from '@mui/material/Button';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  toggleButton: {
    color: '#fff !important',
    zIndex: 2,
    marginTop: "6px"
  },
  Tabs: {
    background: "#29648A",
    "&:hover": {
      background: "#151B54",
      cursor: "pointer"
    }
  },
  selected : {
      backgroundColor: "#151B54"
  }
});

const SideMenuPatient=({tabs})=> {
    const classes = useStyles();
    const navigate = useNavigate();
    const user = useSelector(selectUser)
    const dispatch = useDispatch();
    
    const drawerWidth = "10%";
    const ReleaseAccount = () => {
        // console.log("Dispatching the account ")
        navigate("/login");
        dispatch(logout());
    }

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const HandleDrawerOpen = () => {
      setIsDrawerOpen(true)
      console.log(isDrawerOpen)
    }

    const handleCloseDrawer = () => {
      console.log(false)
      setIsDrawerOpen(false);
    };

    return (
    <Box className ={classes.root}>
      <CustomAppBar title={"Consent Management"} user={user} ReleaseAccount={ReleaseAccount} />
        
        
      <Drawer
      variant="permanent"

      // class = {classes.drawer}
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor:"#29648A"  },
        zIndex: 1 // Set z-index to 1 or a higher value
        
      }}
      anchor="left"
      open={isDrawerOpen} 
      onClose={handleCloseDrawer}
    >
        <CustomSideBar tabs={tabs} />    
      </Drawer>  
      
    </Box>
  );
}

export default SideMenuPatient;
