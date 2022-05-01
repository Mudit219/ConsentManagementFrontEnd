import React, { useState,useRef } from "react";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUser } from "../Components/Redux/userSlice";
import { useEffect } from "react";
import CreateConsentDialog from '../Components/PatientDashboard/CreateConsentDialog';
import { Grid } from "@mui/material";

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
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
    
    <Grid>
        <Button variant="outlined" onClick={handleClickOpen} >
            Create Consent
        </Button>
       <CreateConsentDialog open={open} handleClose={handleClose} web3={web3}/>
    </Grid >
    );
}

export default AllConsents;
