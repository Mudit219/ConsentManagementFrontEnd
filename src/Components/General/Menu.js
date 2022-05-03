import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import {useDispatch} from "react-redux";
import { logout } from "../Redux/userSlice";
import './Menu.css'
const drawerWidth = 280;


const SideMenuPatient=({tabs})=> {
    // const classes = useStyles();
    const navigate = useNavigate();


    const dispatch = useDispatch();
        
    const ReleaseAccount = () => {
        console.log("Dispatching the account ")
        navigate("/login");
        dispatch(logout());
    }

    const handleTab=(tab)=>{
        var tabs = document.getElementsByClassName('Tabs');
        var currentTab = document.getElementById(tab.text);
        for(var i=0;i<tabs.length;i++){
            if(tabs[i]==currentTab){
                tabs[i].classList.add('selected')
                console.log(tabs[i])
            }
            else{
                tabs[i].classList.remove('selected')
            }
        }
        navigate(tab.path);
    }

    return (
    <Box sx={{ marginRight:"5%"}}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor:"#25274D"}}>
        <Toolbar>
          <Typography variant="h5" noWrap component="div" style={{color:"white",fontWeight:"bold"}}>
            Consent Management
          </Typography>
          <Button onClick={ReleaseAccount} variant="contained" style={{marginLeft:"80%", color:"white",backgroundColor:"#464866"}}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor:"#29648A"  },
        }}
      >
        <Toolbar />
        <Box sx={{ marginTop:"20%" }}>
          <List>
            {tabs.map((tab, index) => (
              <ListItem id={tab.text} className ="Tabs" key={tab.text} onClick={()=>handleTab(tab)} style={{marginTop:"10%",position:"relative"}}>
                <ListItemIcon style={{color:"white"}}>
                    {tab.icon}
                </ListItemIcon>
                <ListItemText primary={tab.text} style={{color:"white"}}/>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </Box>
  );
}

export default SideMenuPatient;
