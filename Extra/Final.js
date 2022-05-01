import React, { useState } from "react";
import Popup from "../Components/PatientDashboard/Popup";
import { Button } from "@mui/material";
import Dialog from '@material-ui/core/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from "@mui/material";
// import Form from "../Components/Login-Register/Login-Form";
import './PatientConsent.css'
import axios from "axios";
import baseURL from "../BackendApi/BackendConnection";
import { useSelector } from "react-redux";
import { selectUser } from "../Components/Redux/userSlice";
import { useEffect } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";



function AllConsents() {
    const [open, setOpen] = React.useState(false);
    const [value, SetValue] = React.useState([]);
    const [doctorName,setDoctorName] = useState("");
    const [records, SetRecords] = React.useState([]);
    const user = useSelector(selectUser);
    const [connectedDoctors,setConnectedDoctors]=useState([]);
    const [patientRecords,setPatientRecords]=useState([]);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const empty = () => {
        SetRecords([...records, value])
        // SetValue('')
        // { console.log(records) }
    }

    const loadDoctor=()=>{
        axios.get(`${baseURL}/${user.role}${user.account}/Get-Connections`, 
        {
            headers: { 
                'Authorization': user.token,
                'Content-Type' : 'application/json'
            }
        }).then(
          (response)=>{
              setConnectedDoctors(response.data);
          },
          (error)=>{
            throw(error);
          }
        )
      }
    
    const getRecords=()=>{
        axios.get(`${baseURL}/${user.role}${user.account}/E-Health-Records`, 
        {
            headers: { 
                'Authorization': user.token,
                'Content-Type' : 'application/json'
            }
        }).then(
            (response)=>{
            //   console.log("bla bla bla bla:",response);
              setPatientRecords(response.data);
            },
            (error)=>{
            // console.log("bla bla bla blasdfadsfsdf:",error);
              throw(error);
            }
          )
    }

    useEffect(()=>{
        loadDoctor();
        getRecords();
    },[]);

    return (
        <Grid>
            <Button variant="outlined" onClick={handleClickOpen}>
                Create Consent
            </Button>
            <Dialog open={open} onClose={handleClose} className='DialogBox'>
                <DialogTitle>Create Consent</DialogTitle>
                <DialogContent>
                    <div className="parent">
                        <div className="child">
                            <Select
                                // autoFocus
                                // margin="dense"
                                id="DoctorName"
                                label="Doctor"
                                type="text"
                                // fullWidth
                                variant="standard"
                                select
                                required
                                value={doctorName}
                                style={{ marginTop: '10px' ,width:'300px'}}
                                onChange={(e) => setDoctorName(e.target.value)}
                                // defaultValue={""}
                            >
                            { 
                                connectedDoctors.map((item)=>(
                                <MenuItem key={item.doctorName} value= {item.doctorName} >
                                    {item.doctorName}
                                </MenuItem>
                                ))
                            }

                            </Select>
                        </div>
                    </div>
                    <div>
                        <h2> Records</h2>
                        <div>
                            <TextField
                                // margin="dense"
                                id="Record"
                                label="Record"
                                // type="long"
                                fullWidth
                                variant="standard"
                                value={value}
                                onChange={(e) => SetValue(e.target.value)}
                                // select
                                required
                                // defaultValue={""}
                            >
                            {/* { 
                                patientRecords.map((item)=>(
                                <MenuItem key={item.ehrId} value= {item.ehrId} >
                                    {item.ehrId}
                                </MenuItem>
                                ))
                            } */}
                            </TextField>
                        </div>
                        <Button className="add" onClick={empty}>+Add Record</Button>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Save Consent</Button>
                </DialogActions>
            </Dialog >
        </Grid >
    );
}


export default AllConsents;
