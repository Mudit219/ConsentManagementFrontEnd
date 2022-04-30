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
import DatePicker from "react-datepicker";
import Fab from '@mui/material/Fab';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';





const AllConsents =({web3})=> {
    const [open, setOpen] = React.useState(false);
    const [value, SetValue] = React.useState([]);
    const [doctorId,setDoctorId] = useState("");
    const [records,setRecords] = useState([]);
    const user = useSelector(selectUser);
    const [connectedDoctors,setConnectedDoctors]=useState([]);
    const [patientRecords,setPatientRecords]=useState([]);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const addRecord = () => {
        setRecords([...records, value]);
        // SetValue('')
        { console.log(records) }
    }

    useEffect(()=>{
        loadDoctor();
        getRecords();
    },[]);

    const GetConnections = async () =>  {
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS= process.env.REACT_APP_CONTRACTADDRESS;
        
        // console.log(CONTRACT_ADDRESS,web3,user.account);
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS);
        
        // contract.methods.GetConnectionFile.call().then(console.log);
        var meta_ids_ConnDoc = [];

        await contract.methods.GetConnectionFile().call({from : user.account},async function(err,res) {

            let ConnectionFileAbi = require("../contracts/ConnectionFile.json")["abi"];
            let ConnectionFileContract = new web3.eth.Contract(ConnectionFileAbi,res);
            
            
            await ConnectionFileContract.methods.getListOfConnections().call({from : user.account},async(err,ConnectionList) => {
                // console.log(ConnectionList)
                ConnectionList.forEach(async (connection) => {
                    let ConnectionAbi = require("../contracts/Connection.json")["abi"];
                    let ConnectionContract = new web3.eth.Contract(ConnectionAbi,connection);
                    var ConnectedDoc = await ConnectionContract.methods.getDoctor().call({from : user.account})
                    meta_ids_ConnDoc.push(ConnectedDoc);
                });
            })
        })
        .catch(console.error);

        return meta_ids_ConnDoc;
    }

    const loadDoctor=async()=>{
        
        const meta_doc_ids = await GetConnections(); 
        console.log(meta_doc_ids)

        axios.get(`${baseURL}/${user.role}/${user.account}/Get-Connections`, 
        {
            headers: { 
                'Authorization': user.token,
                'Content-Type' : 'application/json'
            }
        }).then(
          (response)=>{
            //   console.log("fhjasdkfhasdjk");
              setConnectedDoctors(response.data);
          },
          (error)=>{
            throw(error);
          }
        )
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
    
        await contract.methods.createConsent("0xFDE6feAE166C983A7Fe07616BA2E22617D486977",["a1","a2"]).send({from: user.account, gas: 4712388}).then(console.log);

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
