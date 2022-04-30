import React from "react";
import ConnectDoctor from "../Components/PatientDashboard/ConnectDoctor";
import { Container, Select } from "@mui/material";
import axios from 'axios';
import { useState } from "react";
import baseURL from '../BackendApi/BackendConnection'
import { Button } from "@mui/material";
import ConnectionProfile from "../Components/General/ConnectionProfile";
import {Grid} from '@mui/material'


const ConnectedDoctors=({web3})=>{
    const [open, setOpen] = React.useState(false);
    const [availableDoctors,setAvaialbleDoctors] = useState([]);
    const [connections,setConnections] = useState([{
        "name": "Rajeev Sharma",
        "phone": "8843922129",
        "metaId": "1290",
        "email": "rajev12@yahoo.co.in",
        "gender": "M",
        "specialization": "General Physician",
        "doctorLicense": "#DC2312",
        "doctorImage": "https://as2.ftcdn.net/v2/jpg/02/60/04/09/1000_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg",
        "authorities": [
            {
                "id": 7,
                "authority": "records_doctor:read"
            },
            {
                "id": 5,
                "authority": "profile_doctor:read"
            },
            {
                "id": 6,
                "authority": "profile_doctor:write"
            },
            {
                "id": 1,
                "authority": "ROLE_DOCTOR"
            }
        ]
    }]);

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
            <Container>
            <h2>Doctors</h2>
            <Button className='mainbutton' variant="outlined" onClick={handleClickOpen} style={{marginBottom:"10%"}}>
                Connect With New Doctor
            </Button>
            <ConnectDoctor open={open} handleClose={handleClose} connectDoctor={connectDoctor} web3={web3} 
            availableDoctors={availableDoctors} />
            <Grid container>
                {
                    connections.map((connection)=>(
                        <ConnectionProfile doctor={connection}/>
                    ))
                }
            </Grid>
            </Container>
        </div>
    );
}

export default ConnectedDoctors;