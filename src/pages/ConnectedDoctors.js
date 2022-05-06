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
import { Cookie } from "@mui/icons-material";



const ConnectedDoctors=({web3})=>{
    const [open, setOpen] = React.useState(false);
    const [availableDoctors,setAvaialbleDoctors] = useState([]);
    const user = useSelector(selectUser);
    const [connections,setConnections] = useState([]);

    const handleClickOpen = () => {
        setOpen(true);
        axios.get(`${baseURL}/admin/Get-AvailableDoctors`).then(
            (response)=>{
                // console.log(response.data);
                setAvaialbleDoctors(response.data);
                // console.log(response.data.map((item)=>item.hospitalName));
            },
            (error)=>{
                // console.log("No Doctors");
                throw(error);
            }
        )
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(async ()=>{
       await GetConnections();
    },[])

    useEffect(()=>{
        // console.log("fsdjkafhajksdfh",connections)
    },[connections])


    const GetConnections = async () =>  {
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
        
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS);        

        await contract.methods.GetConnectionFile().call({from : user.account},async function(err,res) {

            let ConnectionFileAbi = require("../contracts/ConnectionFile.json")["abi"];
            let ConnectionFileContract = new web3.eth.Contract(ConnectionFileAbi,res);
            
            await ConnectionFileContract.methods.GetTypeConnections(1).call({from : user.account,gas:4712388},
                async(err,AcceptedConnectionList) => {
                // console.log(AcceptedConnectionList)
                var doctorConnections=[];
                // await Promise.all(AcceptedConnectionList.forEach(async (doctorId) => {
                //     console.log("This is doctor id",doctorId);
                axios.post(`${baseURL}/Doc/Profile-public`,AcceptedConnectionList).then(
                        (response)=>{
                            // doctorConnections.push(response.data);
                            // console.log("Thidfhiasdf",response.data)
                            setConnections(response.data); 
                        }
                )
                // setConnections(doctorConnections);
            })
        })
        .catch(console.error);

    }

    return (
        <Container>
            <h2>Doctors</h2>
            <Button className='mainbutton' variant="outlined" onClick={handleClickOpen} style={{marginBottom:"5%"}}>
                Connect With New Doctor
            </Button>
            <ConnectDoctorDialog open={open} handleClose={handleClose} web3={web3} 
            availableDoctors={availableDoctors} />
            <Grid container spacing={5}>
                {
                     connections.map((connection)=>(
                        <ConnectionProfile key={connection.metaId} doctor={connection}/>
                    ))
                }
            </Grid>
        </Container>
    );
}

export default ConnectedDoctors;