import { Card, CardContent } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import baseURL from "../../BackendApi/BackendConnection";

const PatientProfile=({patientId})=>{

    const [PatientProfile,setPatientProfile] = useState(null);
    useEffect(()=>{
        displayProfile();
    },[])
    const displayProfile=()=>{
        axios.get(`${baseURL}/${patientId}/Profile`).then(
            (response)=>{
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
                    }
                </CardContent>
            </Card>
        </div>
    )
}

export default PatientProfile;