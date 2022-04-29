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


const AllConsents = ({ web3 }) => {
    const [open, setOpen] = React.useState(false);
    const [value, SetValue] = React.useState([]);
    const [doctorId, setDoctorId] = useState("");
    const [records, SetRecords] = React.useState(["mrinal", "parithi"]);
    const user = useSelector(selectUser);
    const [connectedDoctors, setConnectedDoctors] = useState([]);
    const [patientRecords, setPatientRecords] = useState([]);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const addRecord = () => {
        SetRecords([...records, value])
        SetValue('')
        setFromDate(new Date())
        setToDate(new Date())
        { console.log(records) }
    }

    useEffect(() => {
        loadDoctor();
        getRecords();
    }, []);
    const loadDoctor = () => {
        axios.get(`${baseURL}/${user.role}${user.account}/Get-Connections`, 
        {
            headers: { 
                'Authorization': user.token,
                'Content-Type' : 'application/json'
            }
        }).then(
            (response) => {
                //   console.log("fhjasdkfhasdjk");
                setConnectedDoctors(response.data);
            },
            (error) => {
                throw (error);
            }
        )
    }

    const getRecords = () => {
        axios.get(`${baseURL}/${user.role}${user.account}/E-Health-Records`, 
        {
            headers: { 
                'Authorization': user.token,
                'Content-Type' : 'application/json'
            }
        }).then(
            (response) => {
                //   console.log("bla bla bla bla:",response);
                setPatientRecords(response.data);
            },
            (error) => {
                // console.log("bla bla bla blasdfadsfsdf:",error);
                throw (error);
            }
        )
    }


    const saveConsent = async () => {
        let abi = require("../contracts/CMS.json");
        let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
        await contract.methods.createConsent(doctorId, records).send({ from: user.account, gas: 4712388 }).then(console.log);
        handleClose();
    }

    return (
        <Grid>
            <Button variant="outlined" onClick={handleClickOpen}>
                Create Consent
            </Button>
            <Dialog open={open} onClose={handleClose} className='DialogBox'>
                <DialogTitle>Create Consent</DialogTitle>
                <DialogContent>
                    <h2>Doctor</h2>
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
                                value={doctorId}
                                style={{ marginTop: '10px', width: '300px' }}
                                onChange={(e) => setDoctorId(e.target.value)}
                            // defaultValue={""}
                            >
                                {
                                    connectedDoctors.map((item) => (
                                        <MenuItem key={item.doctorName} value={item.doctorId} >
                                            {item.doctorName + " (" + item.doctorId + ")"}
                                        </MenuItem>
                                    ))
                                }

                            </Select>
                        </div>
                    </div>
                    <div>
                        <h2> Records</h2>
                        <div>
                            <Select
                                // margin="dense"
                                id="Record"
                                label="Record"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={value}
                                onChange={(e) => SetValue(e.target.value)}
                                // select
                                required
                            >
                                {
                                    patientRecords.map((item) => (
                                        <MenuItem key={item.ehrId} value={item.ehrId} >
                                            {item.ehrId}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className='rowC'>
                            <h4> From</h4>
                            <div>
                                <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    className="inputStyles"
                                    selected={fromDate} onChange={date => setFromDate(date)} />
                            </div>
                            <h4> To</h4>
                            <div>
                                <DatePicker
                                    dateFormat="dd/MM/yyyy"

                                    className="inputStyles"
                                    selected={toDate} onChange={date => setToDate(date)} />
                            </div>
                        </div>
                        <Button className="add" onClick={addRecord}>+Add Record</Button>
                    </div>
                    <div>
                        {
                            records.map((r) => { return (<span>{r} </span>) })
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveConsent}>Save Consent</Button>
                </DialogActions>
            </Dialog >
        </Grid >
    );
}

export default AllConsents;