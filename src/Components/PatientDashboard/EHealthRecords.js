import React from "react";
import { TableContainer, Table, TableCell, TableBody, TableHead, TableRow, Paper } from "@mui/material";
import baseURL from "../../BackendApi/BackendConnection";
import { useState, useEffect } from "react";
import axios from "axios";


const DisplayRecords=({patientId})=>{

    const [EHealthRecords,setEHealthRecord] = useState([]);

    useEffect(()=>{
      document.title='Welcome Patient'
    },[]);

    useEffect(()=>{
      displayEHR();
    },[]);

    const displayEHR=()=>{
        console.log(`${baseURL}/Pat_${patientId}/E-Health-Records`);    
      axios.get(`${baseURL}/Pat_${patientId}/E-Health-Records`).then(
        (response)=>{
          console.log("bla bla bla bla:",response);
          setEHealthRecord(response.data);
        },
        (error)=>{
        // console.log("bla bla bla bla:",error);
          throw(error);
        }
      )
    }
    return (
        
        <TableContainer sx={{width: window.innerWidth - 400 }} component={Paper}>
      <Table sx={{width:'100%' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Record ID</TableCell>
            <TableCell align="right">Doctor Name</TableCell>
            <TableCell align="right">Hospital Name</TableCell>
            <TableCell align="right">Diagnosis</TableCell>
            <TableCell align="right">Prescription</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { 
            EHealthRecords.map((item) => (
                <TableRow
                key={item.ehrId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
              <TableCell component="th" scope="row"> {item.ehrId}</TableCell>
              <TableCell align="right">{item.doctorName}</TableCell>
              <TableCell align="right">{item.hospitalName}</TableCell>
              <TableCell align="right">{item.diagnosis}</TableCell>
              <TableCell align="right">{item.prescription}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    )
}

export default DisplayRecords;