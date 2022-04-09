import { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import ModalDialog from '../Components/Login-Register/ModalDialog';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import baseURL from '../BackendApi/BackendConnection';

const Login = () => {
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
      axios.get(`${baseURL}/${role}${account}/Valid`).then(
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
    <div className="App">
      <Button variant="contained" color="primary" onClick={() => handleOpen("Pat_")}>
        Patient Login
      </Button>
      <Button variant="contained" color="primary" onClick={() => handleOpen("Doc_")}>
        Doctor Login
      </Button>
      
      // display the modal and pass props
      <ModalDialog open={open} handleClose={handleClose} role={role} firstLogin={firstLogin}/>
    </div>
  );
};

export default Login;