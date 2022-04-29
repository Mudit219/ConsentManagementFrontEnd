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



function AllConsents({web3}) {
    const [open, setOpen] = React.useState(false);
    const [value, SetValue] = React.useState('hello')
    const [records, SetRecords] = React.useState([]);   
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const empty = () => {
        SetRecords([...records, value])
        SetValue('')
        { console.log(records) }
    }

    const handleSave = () => {
        let abi = require("../contracts/CMS.json");    
        // // 0x71950D6FCf532febDeC198761C0DC358c75BC7F9
        let CONTRACT_ADDRESS="0xf037F438832DeBc059131cE73CB6bdE735736b38";
        
        // // Accessing the deployed contract
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS); 
        
        await contract.methods.createConsent(doctor,records).send({from: user.account, gas: 4712388}).then(console.log);

        console.log("createConsent is working")
    }

    return (
        <Grid>
            <Button variant="outlined" onClick={handleClickOpen}>
                Create Consent
            </Button>
            <Dialog open={open} onClose={handleClose} className='DialogBox'>
                <DialogTitle>CreateConsent</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText> */}
                    <div className="parent">
                        <div className="child">
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="ConsentID"
                                type="consentid"
                                fullWidth
                                variant="standard"
                            />
                        </div>
                        <div className="child">
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Doctor"
                                type="Doctor"
                                fullWidth
                                variant="standard"
                            />
                        </div>
                    </div>
                    <div>
                        <h2> Records</h2>
                        <div>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Record"
                                type="Record"
                                fullWidth
                                variant="standard"
                                value={value}
                                onChange={(e) => SetValue(e.target.value)}
                            />
                        </div>
                        {/* <h2>Parameters</h2>
                        <div className="parameters">
                            <div className="childparameters">
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="From Date"
                                    type="From Date"
                                    fullWidth
                                    variant="standard"
                                />
                            </div>
                            <div className="childparameters">
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="To Date"
                                    type="To Date"
                                    fullWidth
                                    variant="standard"
                                />
                            </div>
                        </div> */}
                        <Button className="add" onClick={empty}>+Add Record</Button>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Consent</Button>
                </DialogActions>
            </Dialog >
        </Grid >
    );
}


export default AllConsents;
