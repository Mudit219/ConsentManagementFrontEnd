import react from 'react'
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Typography } from '@mui/material';


const CustomAppBar = ({title,user,ReleaseAccount}) => {



  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor:"#25274D"}}>
      <Toolbar>
        <Typography variant="h5" noWrap component="div" style={{marginLeft: "20px", color:"white",fontWeight:"bold"}}>
          {title}
        </Typography>
        <Box style={{marginLeft:"50%",display:'flex',flexDirection:'row'}}>
          <Typography variant="h6" component="div" style={{color:"white",fontWeight:"bold"}}>
            {user.account}
          </Typography>
          <Button onClick={ReleaseAccount} variant="contained" style={{marginLeft:'40px',color:"white",backgroundColor:"#464866"}}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
} 

export default CustomAppBar;