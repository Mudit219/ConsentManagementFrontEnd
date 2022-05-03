import React from "react";
import { Button } from "@mui/material";
import Dialog from '@material-ui/core/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from "@mui/material";
import './CreateConsentDialog.css'
import { MenuItem } from "@mui/material";
import {selectUser} from "../Redux/userSlice";
import {useSelector} from "react-redux";
import {useState} from "react";
import {toast} from 'react-toastify';


const ConnectDoctorDialog = ({ web3,open,handleClose,availableDoctors }) => {
    const [selectedDoc,setSelectedDoc] = useState([]);
    const [selectedHospital,setSelectedHospital] = useState([]);
    const availableHospitals = [... new Set(availableDoctors.map((item)=>item.hospitalName))]
    const user = useSelector(selectUser);

    const SendConnectionToBlockchain = async (e) => {
        e.preventDefault();
        handleClose();
        setSelectedDoc(selectedDoc.substr(0,selectedDoc.indexOf("(")))
        console.log(selectedDoc);
        
        let abi = require("../../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
        
        console.log(CONTRACT_ADDRESS,web3,abi);
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS); 
      
        console.log(contract);
    
        await contract.methods.PatientCreateConnection(selectedDoc).send({from : user.account, gas: 5500000}).then(
            (response)=>{
                toast.success('Request has been sent!', {
                    position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
            },(error)=>{
                toast.error('Something went wrong', {
                    position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                throw(error)
            }
        )
        // .catch(console.error);
        return;
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} className='DialogBox' disableEnforceFocus>
                <DialogTitle>Connect to a Doctor</DialogTitle>
                <DialogContent>
                <form onSubmit={SendConnectionToBlockchain} style={{ backgroundColor: "#FFFFFF",marginTop:"5%" }}>
                    <Grid container spacing={5}>    
                        <Grid item lg={12}>
                            <TextField
                                id="hospital"
                                value={selectedHospital}    
                                onChange={(e)=>setSelectedHospital(e.target.value)}
                                label="Hospital"
                                type="text"
                                style={{ width: 450 }}
                                select
                                required
                                variant="outlined"
                            >
                                {
                                    availableHospitals.map((item)=>(
                                        <MenuItem key={item} value={item}>
                                            {item}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>

                        <Grid item lg={12}>
                            <TextField
                                id=""
                                value={selectedDoc}
                                onChange={(e)=>setSelectedDoc(e.target.value)}
                                label="Doctor"
                                type="text"
                                select
                                style={{ width: 450 }}
                                multiline
                                rows={4}
                                variant="outlined">

                                {
                                    availableDoctors.map((item)=>{
                                        if(item.hospitalName == selectedHospital){
                                            // console.log("Called multiple times")
                                            return (
                                            <MenuItem key={item.doctorMetaId} value={item.doctorMetaId}>
                                                {item.doctorName + " (" + item.doctorMetaId + ")"}
                                            </MenuItem>
                                            )
                                        }
                                    })
                                }
                            </TextField>
                        </Grid>
                    </Grid>
                    
                    <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Connect</Button>
                    </DialogActions>
                </form>           
            </DialogContent>
                
            </Dialog >
        </div>
    );
}

export default ConnectDoctorDialog;