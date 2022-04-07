import { Card, CardContent } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import baseURL from "../../BackendApi/BackendConnection";
import { useParams } from "react-router-dom";

const PatientProfile=({account,role})=>{

    const [Profile,setPatientProfile] = useState({});
    useEffect(()=>{
        document.title="Your Profile";
        displayProfile();
    },[])

    // const params = useParams()
    const displayProfile=()=>{
        axios.get(`${baseURL}/${role}${account}/Profile`).then(
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
                        Profile!=null
                        ?
                            (<div className='card' key={Profile.metaId}>
                            <h3>--- {role} Dashboard ---</h3>
                            <p className='btc'>{role} Name : {Profile.name}</p>
                            <p className='btc'>MobileNumber : {Profile.phone}</p>
                            <p className='btc'>Gender : {Profile.gender}</p>
                            <p className='btc'>EmailId : {Profile.email}</p>
                            </div>
                            // <img 
                            //     src={doctorData.photoUrl}
                            //     alt="Doctor Image"
                            // />
                            )


                        : "No Profile found"
                    }
                </CardContent>
            </Card>
        </div>
    )
}

export default PatientProfile;