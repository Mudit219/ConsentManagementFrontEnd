import React, { useState,useRef,useEffect } from "react";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import DatePicker from "react-datepicker";
import Fab from '@mui/material/Fab';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUser } from "../Redux/userSlice";
import Dialog from '@material-ui/core/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from "@mui/material";
import axios from "axios";
import baseURL from "../../BackendApi/BackendConnection";
import { toast } from "react-toastify";
import './CreateConsentDialog.css';



const CreateConsentDialog = ({web3,open,handleClose,whichDoctor})=>{


    const [value, SetValue] = React.useState([]);
    const [records,setRecords] = useState(new Set());
    // const records
    const user = useSelector(selectUser);
    const [connections,setConnections]=useState([]);
    const [patientRecords,setPatientRecords]=useState([]);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const selectedDoc = useRef("");
    const [chosenDoc,setChosenDoc] = useState(selectedDoc.current);

    const addRecord = () => {
        setRecords(new Set([...records, value]));
        // SetValue('')
        { console.log(records) }
    }


    useEffect(async()=>{
        await GetDoctorConnections();
        getRecords();
        // console.log("Is there anyone here",whichDoctor)

        if(whichDoctor){
            mapSelectedDoc();
        }
    },[whichDoctor])

    useEffect(() => {
        GetConsentedRecordsFromBlockchain();
    },[chosenDoc])

    const mapSelectedDoc = () =>{
        connections.map((item)=>{
            // console.log(item.name + "(" + item.metaId + ")" );
            item.metaId == whichDoctor ? setChosenDoc(item.name + "(" + item.metaId + ")") : setChosenDoc("")}
            )
    }

    const GetConsentedRecordsFromBlockchain = async()=> {
        let abi = require("../../contracts/ConsentManagementSystem.json")["abi"];
        let contract = new web3.eth.Contract(abi,process.env.REACT_APP_CONTRACTADDRESS);
        
        // console.log("is this called ?")
        
        await contract.methods.GetConsents().call({from: user.account, gas: 4712388}).then(async function (consents){
        for(var i=0;i<consents.length;i++){
            let consent_abi = require("../../contracts/Consent.json")["abi"];
            const _consent = new web3.eth.Contract(consent_abi,consents[i]);
            var AssociatedDoc = await _consent.methods.getDoctor().call({from: user.account, gas: 4712388})
            // console.log(AssociatedDoc, chosenDoc)
            // console.log(chosenDoc)
            if(AssociatedDoc ==  chosenDoc.substring(chosenDoc.indexOf("(")+1,chosenDoc.indexOf(")"))) {
                await _consent.methods.getTemplate().call({from: user.account, gas: 4712388}).then(async function (template){
                    let consentTemplate_abi = require("../../contracts/ConsentTemplate.json")["abi"];
                    const _template = new web3.eth.Contract(consentTemplate_abi,template);
                    var consentRecords = await _template.methods.GetConsentedRecords().call({from: user.account, gas: 4712388});
                    setRecords(new Set([...records, ...consentRecords]));
                    // console.log(consentRecords,records);

                })
            }
        }
        })
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

    const GetDoctorConnections = async () =>  {
        let abi = require("../../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
        
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS);        

        await contract.methods.GetConnectionFile().call({from : user.account,gas:4712388},async function(err,res) {

            let ConnectionFileAbi = require("../../contracts/ConnectionFile.json")["abi"];
            let ConnectionFileContract = new web3.eth.Contract(ConnectionFileAbi,res);
            
            await ConnectionFileContract.methods.GetTypeConnections(1).call({from : user.account,gas:4712388},
                async(err,AcceptedConnectionList) => {
                // console.log(AcceptedConnectionList)
                AcceptedConnectionList.forEach(async (doctorId) => {
                    // console.log(doctorId);
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

    const saveConsent=async()=>{
        let abi = require("../../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS= process.env.REACT_APP_CONTRACTADDRESS;
        // console.log(CONTRACT_ADDRESS)    
        
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS); 
        
        // console.log(contract);
        selectedDoc.current = chosenDoc.substring(chosenDoc.indexOf('(')+1,chosenDoc.indexOf(')'))
        
        // console.log(chosenDoc,selectedDoc.current);

        // console.log("This is id: ",selectedDoc.current);
        // console.log("These are records:",Array.from(records))
    
        await contract.methods.createConsent(selectedDoc.current,Array.from(records)).send({from: user.account, gas: 4712388}).then(
                (response)=>{
                    toast.success('Consent Created!', {
                        position: "top-right",
                          autoClose: 2000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                        });
                        window.location.reload(false);
                },(error)=>{
                    toast.error('Something went wrong', {
                        position: "top-right",
                          autoClose: 2000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                        });
                    throw(error)
                }
        );

        handleClose();
    }

    return (
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
                            value={chosenDoc}
                            style={{ marginTop: '10px', width: '300px' }}
                            onChange={(e) => {setChosenDoc(e.target.value);}}
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
                    {/* <div className='rowC'>
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
                    </div> */}
                    <Button className="add" onClick={addRecord}>+Add Record</Button>
                    </div>
                <Grid container>
                    {
                        Array.from(records).map((record) => (
                        <Grid item key={record}>
                            <Button color="primary" aria-label={record} sx={{fontSize:"15px",marginBottom:"20px", borderRadius: "10px"}} size="small" variant="contained" endIcon={<DeleteIcon />} 
                            onClick={()=>{
                                setRecords(Array.from(records).filter((x) => x != record))
                            }} 
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
    );
}

export default CreateConsentDialog;