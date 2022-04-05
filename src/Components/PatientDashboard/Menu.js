import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    drawer:{
        width:280
    },
    drawerPaper:{
        width:250
    },
    SideMenu: {
        display:'flex'
    }
})
const SideMenuPatient=()=> {
    const classes = useStyles();
    // const navigate = useNavigate();
    const menuItems=[
        {
            text:'E-Health-Records',
            path:'/ERecords'
        },
        {
            text:'Create Consent',
            path:'/create-consent'
        }
    ]
    return (
      <div className={classes.SideMenu} >

        <Drawer
            className={classes.drawer}
            variant='permanent'
            anchor='left'
            classes={{paper:classes.drawerPaper}}
            
            >
            <Typography variant='h5'>
                Consent Management
            </Typography>

           <List>
                {menuItems.map((item)=>(
                    <ListItem 
                    key={item.text} 
                    button>
                    {/* // onClick={()=>navigate(item.path)} > */}
                    <ListItemText primary={item.text} />
                    </ListItem>
                ))}
           </List>
        </Drawer>
      </div>
  );
}

export default SideMenuPatient;
