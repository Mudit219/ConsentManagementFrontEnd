import { Card, CardContent } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../Components/Redux/userSlice";
import baseURL from "../BackendApi/BackendConnection";
import { Grid } from "@mui/material";
import { TextField } from "@mui/material";
import { Container,Typography } from "@mui/material";

const UserProfile = () => {

    const user = useSelector(selectUser);
    const [Profile, setPatientProfile] = useState({});
    useEffect(() => {
        document.title = "Your Profile";
        displayProfile();
    }, [])

    // const params = useParams()
    const displayProfile = () => {
        axios.get(`${baseURL}/${user.role}/${user.account}/Profile`,{
            headers:{
              "Authorization":user.token
            }
        }).then(
            (response) => {
                // console.log(response);
                setPatientProfile(response.data);
            },
            (error) => {
                throw (error);
            }
        )
    }

    const titleCase =(records)=>{
        for(var i in records){
          for(var j in records[i]){
            records[i][j] = records[i][j].replace(/([A-Z])/g, " $1");
          }
        }
        return records;
    }

    return (
        <Container>
            {
                Profile != null && user.role == "Pat" &&
                    (
            <Container>
                <img src={Profile.patientImage} style={{height:"200px",width:"200px",borderRadius:"20%"}}/>
            <Typography variant="h4" color="text.primary" >
                    {Profile.name}
            </Typography>
            <form style={{marginTop:"5%" }}>
                <Grid container spacing={5}>
                    {
                        Object.keys(Profile).filter(function(item){
                            return item!='patientImage' && item!='authorities' && item!='name' && item!='metaId' && item!='password';
                    }).map((field)=>(
                        <Grid item lg={4}>
                        <TextField
                        id={field}
                        label={field.replace(
                            /\w\S*/g,
                            function(txt) {
                              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()})}
                        multiline
                        variant="filled"
                        defaultValue={Profile[field]}
                        InputProps={{
                            readOnly: true,
                        }}/>
                        </Grid>))} 
                </Grid>
            </form>
            </Container>)
            }
            
            {
                Profile != null && user.role == "Doc" &&
                    (
            <Container>
                <img src={Profile.doctorImage} style={{height:"200px",width:"200px",borderRadius:"20%"}}/>
            <Typography variant="h4" color="text.primary" >
                    {Profile.name}
            </Typography>
            <form style={{marginTop:"5%" }}>
                <Grid container spacing={5}>
                    {
                        Object.keys(Profile).filter(function(item){
                            return item!='doctorImage' && item!='authorities' && item!='name' && item!='metaId' && item!='password';
                    }).map((field)=>(
                        <Grid item lg={4}>
                        <TextField
                        id={field}
                        sx = {{backgroundColor: '#DDDDDD', fontWeight: 'bold'}}
                        label={field.replace(
                            /\w\S*/g,
                            function(txt) {
                              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()})}
                        multiline
                        variant="outlined"
                        defaultValue={Profile[field]}
                        InputProps={{
                            readOnly: true,
                        }}>
                            {/* { this.value = Profile[field] } */}
                        </TextField>

                        </Grid>))} 
                </Grid>
            </form>
            </Container>)
            }
            </Container>       
        );
}

export default UserProfile;