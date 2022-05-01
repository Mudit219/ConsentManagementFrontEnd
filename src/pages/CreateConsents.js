import React, { useState,useRef } from "react";
import Popup from "../Components/PatientDashboard/Popup";
import { Button } from "@mui/material";
import Dialog from '@material-ui/core/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from "@mui/material";
import './CreateConsent.css'
import axios from "axios";
import baseURL from "../BackendApi/BackendConnection";
import { useSelector } from "react-redux";
import { selectUser } from "../Components/Redux/userSlice";
import { useEffect } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import DatePicker from "react-datepicker";
import Fab from '@mui/material/Fab';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const AllConsents =({web3})=> {
    const [open, setOpen] = React.useState(false);
    const [value, SetValue] = React.useState([]);
    const [records,setRecords] = useState([]);
    const user = useSelector(selectUser);
    const [connections,setConnections]=useState([]);
    const [patientRecords,setPatientRecords]=useState([]);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const selectedDoc = useRef("")

    const handleClickOpen = () => {
        setOpen(true);
        GetDoctorConnections();
        getRecords();
    };

    const handleClose = () => {
        setOpen(false);
    };
    const addRecord = () => {
        setRecords([...records, value]);
        // SetValue('')
        { console.log(records) }
    }

    const GetDoctorConnections = async () =>  {
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
    
    const getRecords=()=>{
        axios.get(`${baseURL}/${user.role}/${user.account}/E-Health-Records`, 
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

    
    const saveConsent=async()=>{
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS= process.env.REACT_APP_CONTRACTADDRESS;
        console.log(CONTRACT_ADDRESS)    
        
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS); 
        
        console.log(contract);
        selectedDoc.current = selectedDoc.current.substring(selectedDoc.current.indexOf('(')+1,selectedDoc.current.indexOf(')'))
        console.log("This is id: ",selectedDoc.current);
        console.log("These are records:",records)
    
        await contract.methods.createConsent(selectedDoc.current,["a1","a2"]).send({from: user.account, gas: 4712388}).then(console.log);

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
                            value={selectedDoc.current}
                            style={{ marginTop: '10px', width: '300px' }}
                            onChange={(e) => selectedDoc.current = e.target.value}
                        // defaultValue={""}
                        >
                            {
                                connections.map((item) => (
                                    <MenuItem key={item.name} value={item.name + "(" + item.metaId + ")"} >
                                        {item.name + "(" + item.metaId + ")"}
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
                <Grid container>
                    {
                        records.map((record) => (
                        <Grid item key={record}>
                            <Button color="primary" aria-label={record} sx={{fontSize:"15px",marginBottom:"20px", borderRadius: "10px"}} size="small" variant="contained" endIcon={<DeleteIcon />} 
                            onClick={()=>{setRecords(records.splice(records.indexOf({record}) - 1,1))}} 
                            >
                                {record}
                            </Button>
                        </Grid>
                        ))
                    }
                </Grid>
               
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
