import React, { useEffect, useRef,useState} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import axios from "axios";
import baseURL from "../BackendApi/BackendConnection";
import { useSelector } from "react-redux";
import { selectUser } from "../Components/Redux/userSlice";
import RequestConsentDialog from "../Components/DoctorDashboard/RequestConsentDialog";
// import "./RequestConsent.css"


const RequestConsent = ({web3}) => {
  const [connectionsProfile,setConnectionsProfile] = useState([]);
  const user = useSelector(selectUser);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
      setOpen(true);
      GetPatientConnections();
  }

  const handleClose = () => {
      setOpen(false);
  }


  const GetPatientConnections = async () =>  {
    let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
    let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
    
    let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS);        

    await contract.methods.GetConnectionFile().call({from : user.account},async function(err,res) {

        let ConnectionFileAbi = require("../contracts/ConnectionFile.json")["abi"];
        let ConnectionFileContract = new web3.eth.Contract(ConnectionFileAbi,res);
        
        await ConnectionFileContract.methods.GetTypeConnections(1).call({from : user.account},
            async(err,AcceptedConnectionList) => {
            console.log(AcceptedConnectionList)
            AcceptedConnectionList.forEach(async (doctorId) => {
                console.log(doctorId);
                axios.get(`${baseURL}/Pat/${doctorId}/Profile-public`).then(
                    (response)=>{
                        setConnectionsProfile([...connectionsProfile,response.data]);
                    }
                )
            });
        })
    })
    .catch(console.error);
}

  

  return (
    <div style={{}}>
      <Button variant="filled" style={{backgroundColor:"#464866"}} onClick={handleOpen}> Request Consent </Button>
      <RequestConsentDialog open={open} handleClose={handleClose} connectionsProfile={connectionsProfile} web3={web3}/>
    </div>
    // 

  )
}

export default RequestConsent;