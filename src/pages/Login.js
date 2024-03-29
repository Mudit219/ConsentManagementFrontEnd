import { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import ModalDialog from '../Components/Login-Register/ModalDialog';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import baseURL from '../BackendApi/BackendConnection';
import { Container } from '@mui/material';
import './Login.css';


const Login = ({web3}) => {
  // declare a new state variable for modal open
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState();
  const [firstLogin,setfirstLogin] = useState(true);
  // const [backEnd,setBackEnd]=useState(true);
  const { chainId, account, activate, active,library } = useWeb3React()
  // function to handle modal open
  const handleOpen = (role) => {
    setOpen(true);
    setRole(role);

    if(account) {
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
    }
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  return (
  <Container className='Login' style={{marginLeft:"40%",marginTop:"10%"}}>
    {/* <img src={logo} style={{width:"100%",height:"100vh,",zIndex:'1',position:'fixed'}}/> */}
      {/* <div className="logo" style={{zIndex:'2',position:'fixed'}}>
        <img className="logoImage" src='https://gdm-catalog-fmapi-prod.imgix.net/ProductScreenshot/d65416a4-8162-406b-add4-040305619de6.png?auto=format' />
      </div> */}
      {/* <div className='LoginContainer' style={{zIndex:'2',position:'fixed'}}> */}
        <h1 style={{marginLeft:"12%"}}>Login As</h1>

        {/* <div className='PatientLogin'> */}
          {/* <div>
            <img className='logoPat' src='https://thumbs.dreamstime.com/b/black-solid-icon-boy-patient-boy-patient-logo-pills-medical-black-solid-icon-boy-patient-pills-medical-147675883.jpg' />
          </div> */}
          {/* <div> */}
            <Button variant="contained" color="primary" onClick={() => handleOpen("Pat")}  style={{ marginRight: 5,backgroundColor:"#25274D", fontSize: "20px" }}>
              Patient Login
            </Button>
          {/* </div> */}
        {/* </div> */}
        {/* <div className='DoctorLogin'> */}
          {/* <div>
            <img className='logoDoc' src='https://www.kindpng.com/picc/m/127-1272273_doctors-logo-black-and-white-vector-png-download.png' />
          </div> */}
          {/* <div> */}
            <Button variant="contained" color="primary" onClick={() => handleOpen("Doc")} style={{ marginLeft: 5,backgroundColor:"#25274D" , fontSize: "20px"}}>
              Doctor Login
            </Button>
          {/* </div> */}
        {/* </div> */}


      {/* </div> */}
      {/* // display the modal and pass props */}
      <ModalDialog open={open} handleClose={handleClose} role={role} firstLogin={firstLogin} web3={web3}/>
    </Container >
  );
};

export default Login;