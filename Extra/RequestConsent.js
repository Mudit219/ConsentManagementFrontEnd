import React from "react";
import baseURL from "../../BackendApi/BackendConnection";
import { useState, useEffect } from "react";
import { Alert } from "bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
// import './RequestConsent'
import Select from '@material-ui/core/Select';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Form from "../Login-Register/Login-Form";
import Button from "@material-ui/core/Button";
import './RequestConsent.css'


// const account_ids = {
//     owner: process.env.REACT_APP_OWNERADDRESS,
//     doctor: "0x22e6D372bfd0D97F883623952187d99331C52e80",
//     patient: "0x4278C94eB9bFb39dda0eCD27d14F5Ff75F6db979"
//   }


const RequestConsent = ({ web3, account }) => {
    const [PatientId, SetPatientId] = useState('')
    const [Description, SetDescription] = useState('')
    const [connectedPatients,setConnectedPatients] = useState([]);
    const user = useSelector(selectUser);
  
    const SendConsentToBlockchain = () => {
        return None
    }

    const Click = () => {
        return (
            // SendConsentToBlockchain()
            SetPatientId(''),
            SetDescription(''),
            alert("Request Send Successfully")
        )
    }
    const notification = () => {
        Alert(
            "HelloWorld"
        )
    }
    return (
        <form action="/action_page.php">
            <div class="container">
                <h1 style={{ color: 'black' }}>RequestConsent</h1>
                <hr />
                <Grid item className="Patient">
                    <div><label for="Patient"><b>PatientId</b></label></div>
                    {/* <Select name="Patient" id='Patient' style={{ width: '500px', marginBottom: '20px' }}></Select> */}
                    <TextField id="outlined-basic" label="PatientId" variant="outlined" style={{ marginTop: '10px' }} value={PatientId} onChange={(e) => SetPatientId(e.target.value)} />
                </Grid>
                {/* {console.log(PatientId)} */}
                <form style={{ marginTop: '10px' }}>
                    <div><label for="Description"><b>Description</b></label></div>
                    <textarea id="age-input"
                        name="text"
                        label="Request Description"
                        type="text"
                        style={{ width: '500px' }}
                        value={Description}
                        onChange={(e) => SetDescription(e.target.value)}></textarea>

                </form>
                {/* <Form>
                    <textarea
                        id="age-input"
                        name="text"
                        label="Request Description"
                        type="text"

                        style={{ width: '500px' }}
                    />
                </Form> */}


                <Button class="registerbtn" style={{ marginTop: '1rem' }} onClick={Click}>Request Consent</Button>
            </div >
        </form >

    )
}

export default RequestConsent;