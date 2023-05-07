import * as React from 'react';
import Box from '@mui/material/Box';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Button from '@mui/material/Button';

const CustomSideBar = ({tabs}) => {

  const navigate = useNavigate();

  const handleTab=(tab)=>{
      var tabs = document.getElementsByClassName('Tabs');
      var currentTab = document.getElementById(tab.text);
      for(var i=0;i<tabs.length;i++){
          if(tabs[i]==currentTab){
              tabs[i].classList.add('selected')
              // console.log(tabs[i])
          }
          else{
              tabs[i].classList.remove('selected')
          }
      }
      navigate(tab.path);
  }

  return (
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
  )
} 

export default CustomSideBar;