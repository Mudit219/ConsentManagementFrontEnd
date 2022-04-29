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
import {useSelector} from "react-redux";
import {selectUser} from "../Redux/userSlice";

const ConnectDoctor = ({ web3 }) => {
    const [open, setOpen] = React.useState(false);
    // const [value, SetValue] = React.useState([]);
    // const [doctorId, setDoctorId] = useState("");
    // const [records, SetRecords] = React.useState(["mrinal", "parithi"]);
    const user = useSelector(selectUser);
    // const [connectedDoctors, setConnectedDoctors] = useState([]);
    // const [patientRecords, setPatientRecords] = useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const connectDoctor = async (meta_id_doctor) => {
        setOpen(false);

        let abi = require("../../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS= require("../../contracts/ContractAddress")["default"];
        
        console.log(CONTRACT_ADDRESS,web3);
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS); 
      
        console.log(contract);
    
        await contract.methods.PatientCreateConnection(meta_id_doctor).send({from : user.account, gas: 4720000}).then(console.log)
        .catch(console.error);

        console.log("Patient has sent the connection successfully");
        return;
    }

    const GetConnections = async () =>  {
        let abi = require("../../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS= require("../../contracts/ContractAddress")["default"];
        
        console.log(CONTRACT_ADDRESS,web3,user.account);
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS);
        
        // contract.methods.GetConnectionFile.call().then(console.log);

        await contract.methods.GetConnectionFile().call({from : user.account},async function(err,res) {

            let ConnectionFileAbi = require("../../contracts/ConnectionFile.json")["abi"];
            let ConnectionFileContract = new web3.eth.Contract(ConnectionFileAbi,res);
            
            
            await ConnectionFileContract.methods.getListOfConnections().call({from : user.account},async(err,ConnectionList) => {
                console.log(ConnectionList)
                ConnectionList.forEach(connection => {
                    console.log(connection);
                });
            })
        })
        .catch(console.error);
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
                    <Button onClick={() => connectDoctor("0x2C8165A2b5CB576b9E8F2e28Ed3837f81C9E9D90")}>Connect</Button>
                    <Button onClick={GetConnections}>connections</Button>
                </DialogActions>
            </Dialog >
        </Grid >
    );
}

export default ConnectDoctor;