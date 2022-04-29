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
import CONTRACT_ADDRESS from "../contracts/ContractAddress";
import DatePicker from "react-datepicker";
import './connectDoctor.css'

const ConnectDoctor = ({ web3 }) => {
    const [open, setOpen] = React.useState(false);
    // const [value, SetValue] = React.useState([]);
    // const [doctorId, setDoctorId] = useState("");
    // const [records, SetRecords] = React.useState(["mrinal", "parithi"]);
    // const user = useSelector(selectUser);
    // const [connectedDoctors, setConnectedDoctors] = useState([]);
    // const [patientRecords, setPatientRecords] = useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const connectDoctor = () => {
        setOpen(false);
        return;
    }
    // const loadDoctor = () => {
    //     axios.get(`${baseURL}/${user.role}${user.account}/Get-Connections`).then(
    //         (response) => {
    //             //   console.log("fhjasdkfhasdjk");
    //             setConnectedDoctors(response.data);
    //         },
    //         (error) => {
    //             throw (error);
    //         }
    //     )
    // }

    // const getRecords = () => {
    //     axios.get(`${baseURL}/${user.role}${user.account}/E-Health-Records`).then(
    //         (response) => {
    //             //   console.log("bla bla bla bla:",response);
    //             setPatientRecords(response.data);
    //         },
    //         (error) => {
    //             // console.log("bla bla bla blasdfadsfsdf:",error);
    //             throw (error);
    //         }
    //     )
    // }


    // const saveConsent = async () => {
    //     let abi = require("../contracts/CMS.json");
    //     let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    //     await contract.methods.createConsent(doctorId, records).send({ from: user.account, gas: 4712388 }).then(console.log);
    //     handleClose();
    // }

    return (
        <Grid className='rowC'>
            <h2>Doctors</h2>
            <Button className='mainbutton' variant="outlined" onClick={handleClickOpen}>
                Connect With New Doctor
            </Button>
            <Dialog open={open} onClose={handleClose} className='DialogBox'>
                <DialogTitle>Connect to a Doctor</DialogTitle>
                <DialogContent>
                    <h4>Doctor Name</h4>
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
                                // value={doctorId}
                                style={{ marginTop: '10px', width: '300px' }}
                            // onChange={(e) => setDoctorId(e.target.value)}
                            // defaultValue={""}
                            >


                            </Select>
                        </div>
                    </div>
                    <div>
                        <h4> Hospital Name</h4>
                        <div>
                            <Select
                                // margin="dense"
                                id="Record"
                                label="Record"
                                type="text"
                                fullWidth
                                variant="standard"
                                // value={value}
                                // onChange={(e) => SetValue(e.target.value)}
                                // select
                                required
                            >
                            </Select>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={connectDoctor}>Connect</Button>
                </DialogActions>
            </Dialog >
        </Grid >
    );
}

export default ConnectDoctor;