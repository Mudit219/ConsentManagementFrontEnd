import React, { useEffect } from "react";
import ConnectDoctorDialog from "../Components/PatientDashboard/ConnectDoctorDialog";
import { Container, Select } from "@mui/material";
import axios from 'axios';
import { useState } from "react";
import baseURL from '../BackendApi/BackendConnection'
import { Button } from "@mui/material";
import ConnectionProfile from "../Components/General/ConnectionProfile";
import {Grid} from '@mui/material'
import { useSelector } from "react-redux";
import { selectUser } from "../Components/Redux/userSlice";



const ConnectedDoctors=({web3})=>{
    const [open, setOpen] = React.useState(false);
    const [availableDoctors,setAvaialbleDoctors] = useState([]);
    const user = useSelector(selectUser);
    const [connections,setConnections] = useState([]);

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

    useEffect(()=>{
        GetConnections();
    },[])

    const GetConnections = async () =>  {
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
        
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS);        

        await contract.methods.GetConnectionFile().call({from : user.account},async function(err,res) {

            let ConnectionFileAbi = require("../contracts/ConnectionFile.json")["abi"];
            let ConnectionFileContract = new web3.eth.Contract(ConnectionFileAbi,res);
            
            await ConnectionFileContract.methods.GetTypeConnections(1).call({from : user.account},
                async(err,AcceptedConnectionList) => {
                console.log(AcceptedConnectionList)
                AcceptedConnectionList.forEach(async (doctorId) => {
                    console.log(doctorId);
                    axios.get(`${baseURL}/Doc/${doctorId}/Profile-public`).then(
                        (response)=>{
                            setConnections([...connections,response.data]);
                        }
                    )
                });
            })
        })
        .catch(console.error);

    }

    return (
        <div>
            <Container>
            <h2>Doctors</h2>
            <Button className='mainbutton' variant="outlined" onClick={handleClickOpen} style={{marginBottom:"10%"}}>
                Connect With New Doctor
            </Button>
            <ConnectDoctorDialog open={open} handleClose={handleClose} web3={web3} 
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