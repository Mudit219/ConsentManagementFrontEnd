import { Card, CardContent } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import baseURL from "../../BackendApi/BackendConnection";
import { useParams } from "react-router-dom";

const PatientProfile=({account})=>{

    const [PatientProfile,setPatientProfile] = useState({});
    useEffect(()=>{
        document.title="Your Profile";
        displayProfile();
    },[])

    // const params = useParams()
    const displayProfile=()=>{
        axios.get(`${baseURL}/Pat_${account}/Profile`).then(
            (response)=>{
                // console.log(response);
                setPatientProfile(response.data);
            },
            (error)=>{
                throw(error);
            }
        )
    }
    return (
        <div>
            <Card>
                <CardContent>
                    {
                        // console.log(PatientProfile)
                        PatientProfile!=null
                        ? "Hello " + PatientProfile.name
                        : "No Profile found"
                    }
                </CardContent>
            </Card>
        </div>
    )
}

export default PatientProfile;