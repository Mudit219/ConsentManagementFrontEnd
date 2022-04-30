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
<<<<<<< HEAD
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
=======
import axios from 'axios';
import baseURL from '../../BackendApi/BackendConnection'
import { MenuItem } from "@mui/material";


const ConnectDoctor = ({ web3 }) => {
    const [open, setOpen] = React.useState(false);
    const [availableDoctors,setAvaialbleDoctors] = useState([]);
    const [selectedDoc,setSelectedDoc] = useState([]);
    const [selectedHospital,setSelectedHospital] = useState([]);
    var availableHospitals = [... new Set(availableDoctors.map((item)=>item.hospitalName))]
>>>>>>> e22ea5fb22d708f97b2a855846ea08e222dbbeac

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
<<<<<<< HEAD

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

=======
>>>>>>> e22ea5fb22d708f97b2a855846ea08e222dbbeac


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
<<<<<<< HEAD
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
=======
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
>>>>>>> e22ea5fb22d708f97b2a855846ea08e222dbbeac
            </Dialog >
        </div>
    );
}

export default ConnectDoctor;