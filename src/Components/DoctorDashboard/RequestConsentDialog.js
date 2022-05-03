import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";
import { useState,useRef } from "react";
import { useSelector } from "react-redux";
import { Typography } from "@material-ui/core";
import { selectUser } from "../Redux/userSlice";
import { Grid,TextField,Button,MenuItem } from "@material-ui/core";
import {toast} from 'react-toastify'


const RequestConsentDialog=({open,handleClose,connectionsProfile,web3})=>{


    const user = useSelector(selectUser);

    const selectedPatient = useRef("")
    const [description, SetDescription] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("This is full value: " + selectedPatient.current);
    
        selectedPatient.current = selectedPatient.current.substring(selectedPatient.current.indexOf("(")+1,selectedPatient.current.indexOf(")"));
        
        console.log("This is selected: " + selectedPatient.current);
    
        console.log("These are form values " + selectedPatient.current + " " + description);
        // Deploying the contract 
    
        let abi = require("../../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS= process.env.REACT_APP_CONTRACTADDRESS;
        console.log(CONTRACT_ADDRESS)    
        
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS); 
        
        // console.log(contract,patientId);
    
        await contract.methods.requestConsent(description,selectedPatient.current).send({from: user.account, gas: 4712388}).then(
            (response)=>{
                toast.success('Request has been sent!', {
                    position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
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
    
        console.log("requestConsent is working")
        SetDescription('');
      };
    

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md">
            <DialogTitle id="scroll-dialog-title" style={{textAlign:"center"}} >
                <Typography variant="h4" color="text.primary" >
                        {"Request Consent"}
                </Typography>
            </DialogTitle>
            <DialogContent>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item className="Patient" lg={12}>
                        <div><label for="Patient"><b>Patient Name</b></label></div>
                        <TextField id="outlined-basic" select required label="Enter Patient Name" variant="outlined" style={{ marginTop: '10px', width:'500px'}} value={selectedPatient.current} onChange={(e) => selectedPatient.current = e.target.value} >
                        { 
                            connectionsProfile.map((item)=>(
                            <MenuItem key={item.metaId} value= {item.name + "(" + item.metaId + ")" } >
                            {item.name + "(" + item.metaId + ")" }
                            </MenuItem>
                            ))
                        }
                        </TextField>
                    </Grid>
                    
                    <Grid item className="Description" lg={12}>
                        <div><label for="Description"><b>Description</b></label></div>
                        <TextField id="standard-textarea" label="Enter the description for records" variant="outlined" required style={{ marginTop: '10px' ,width:'500px'}} multiline value={description} onChange={(e) => SetDescription(e.target.value)} >
                        </TextField>
                    </Grid>
                    
                    <DialogActions style={{ marginTop: '1rem',marginLeft:"35%"} }>
                        <Button type="submit" style={{backgroundColor:"#29648A" }} onClick={handleClose} >Request Consent</Button>
                        <Button style={{marginLeft:'3rem',backgroundColor:"#464866" }} onClick={handleClose} >Cancel</Button>
                    </DialogActions>

                    
                </Grid >
            </form >
            </DialogContent>
            </Dialog>
    )
}

export default RequestConsentDialog;