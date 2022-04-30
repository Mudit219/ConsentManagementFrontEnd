import React from "react";
import { Button } from "@mui/material";
import Dialog from '@material-ui/core/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from "@mui/material";
// import Form from "../Components/Login-Register/Login-Form";
import './ConnectDoctor.css'
import axios from 'axios';
import baseURL from '../../BackendApi/BackendConnection'
import { MenuItem } from "@mui/material";
import {selectUser} from "../Redux/userSlice";
import {useSelector} from "react-redux";
import {useState} from "react";


const ConnectDoctor = ({ web3 }) => {
    const [open, setOpen] = useState(false);
    const [availableDoctors,setAvaialbleDoctors] = useState([]);
    const [selectedDoc,setSelectedDoc] = useState([]);
    const [selectedHospital,setSelectedHospital] = useState([]);
    const availableHospitals = [... new Set(availableDoctors.map((item)=>item.hospitalName))]
    const user = useSelector(selectUser);

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

    const SendConnectionToBlockchain = async (e) => {
        e.preventDefault();
        setOpen(false);
        setSelectedDoc(selectedDoc.substr(0,selectedDoc.indexOf("(")))
        console.log(selectedDoc);
        
        let abi = require("../../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
        
        console.log(CONTRACT_ADDRESS,web3);
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS); 
      
        console.log(contract);
    
        await contract.methods.PatientCreateConnection(selectedDoc).send({from : user.account, gas: 4712388}).then(console.log)
        .catch(console.error);

        console.log("Patient has sent the connection successfully");
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



    return (
        <div>
            <h2>Doctors</h2>
            <Button className='mainbutton' variant="outlined" onClick={handleClickOpen}>
                Connect With New Doctor
            </Button>
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

export default ConnectDoctor;