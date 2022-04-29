import React, { useState } from "react";
import Popup from "../PatientDashboard/Popup";
import { Button } from "@mui/material";
import Dialog from '@material-ui/core/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from "@mui/material";
// import Form from "../Components/Login-Register/Login-Form";
import './ConnectDoctor.css'
import { Select } from "@mui/material";
import axios from 'axios';
import baseURL from '../../BackendApi/BackendConnection'
import { MenuItem } from "@mui/material";


const ConnectDoctor = ({ web3 }) => {
    const [open, setOpen] = React.useState(false);
    const [availableDoctors,setAvaialbleDoctors] = useState([]);
    const [selectedDoc,setSelectedDoc] = useState([]);
    const [selectedHospital,setSelectedHospital] = useState([]);
    var availableHospitals = [... new Set(availableDoctors.map((item)=>item.hospitalName))]

    const handleClickOpen = () => {
        setOpen(true);
        axios.get(`${baseURL}/admin/Get-AvailableDoctors`).then(
            (response)=>{
                console.log(response.data);
                setAvaialbleDoctors(response.data);
                console.log(response.data.map((item)=>item.hospitalName));
            },
            (error)=>{
                console.log("No Doctors");
                throw(error);
            }
        )
    };

    const handleClose = () => {
        setOpen(false);
    };

    const connectDoctor = () => {
        setOpen(false);
        return;
    }


    return (
        <div>
            <h2>Doctors</h2>
            <Button className='mainbutton' variant="outlined" onClick={handleClickOpen}>
                Connect With New Doctor
            </Button>
            <Dialog open={open} onClose={handleClose} className='DialogBox'>
                <DialogTitle>Connect to a Doctor</DialogTitle>
                <DialogContent>
                <form onSubmit={connectDoctor} style={{ backgroundColor: "#FFFFFF",marginTop:"5%" }}>
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
                </form>           
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={connectDoctor}>Connect</Button>
            </DialogActions>
            </Dialog >
        </div>
    );
}

export default ConnectDoctor;