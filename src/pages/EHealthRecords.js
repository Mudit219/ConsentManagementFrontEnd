import React, { Fragment } from "react";
import { TableContainer, Table, TableCell, TableBody, TableHead, TableRow, Paper } from "@mui/material";
import baseURL from "../BackendApi/BackendConnection";
import { useState, useEffect } from "react";
import axios from "axios";
import {selectUser} from "../Components/Redux/userSlice";
import {useSelector} from "react-redux";

const DisplayRecords=()=>{
    const user =  useSelector(selectUser);
    const [EHealthRecords,setEHealthRecord] = useState([]);
    // console.log("These are the parameters: " + parameters.consentRecords);
    useEffect(()=>{
      if(user.role==="Pat_")
        document.title='Welcome Patient'
      else if(user.role==="Doc_")
        document.title='Welcome Doctor'
    },[]);

    useEffect(()=>{
      displayEHR();
    },[]);

    const displayEHR=()=>{       
      if(user.role === "Doc_"){
        axios.post(`${baseURL}/${user.role}${user.account}/E-Health-Records`,[
          {
            "patientId": "",
            "recordIds": []
          }
        ]).then(
          (response)=>{
            console.log("bla bla bla bla:",response);
            setEHealthRecord(response.data);
          },
          (error)=>{
          console.log("bla bla bla bla:",error);
            throw(error);
          }
        )
      }
      if(user.role === "Pat_"){
        axios.get(`${baseURL}/${user.role}${user.account}/E-Health-Records`).then(
          (response)=>{
            console.log("bla bla bla bla:",response);
            setEHealthRecord(response.data);
          },
          (error)=>{
          console.log("bla bla bla blasdfadsfsdf:",error);
            throw(error);
          }
        )
      }
    }
    return (
        
        <TableContainer sx={{width: window.innerWidth - 400 }} component={Paper}>
      <Table sx={{width:'100%' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Record ID</TableCell>
            {
              user.role == "Doc_" && (
                <Fragment>
                  <TableCell align="right">Patient Name</TableCell>
                  <TableCell align="right">Patient Phone</TableCell>
                </Fragment>
              ) 
            }
            <TableCell align="right">Doctor Name</TableCell>
            <TableCell align="right">Hospital Name</TableCell>
            <TableCell align="right">Diagnosis</TableCell>
            <TableCell align="right">Prescription</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { 
            EHealthRecords.map((item) => (
              <TableRow
              key={item.ehrId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                <TableCell component="th" scope="row"> {item.ehrId}</TableCell>
                  {
                  user.role === "Doc_" && (
                    <Fragment>
                      <TableCell align="right">{item.patientName}</TableCell>
                      <TableCell align="right">{item.patientPhone}</TableCell>
                    </Fragment>
                  ) 
                  }
                  {
                    // console.log("fhasdjkfhdjkshfjkds")
                    // console.log(EHealthRecords)
                  }
                <TableCell align="right">{item.doctorName}</TableCell>
                <TableCell align="right">{item.hospitalName}</TableCell>
                <TableCell align="right">{item.diagnosis}</TableCell>
                <TableCell align="right">{item.prescription}</TableCell>
                <TableCell align="right">{item.date}</TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    )
}

export default DisplayRecords;