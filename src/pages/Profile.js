import { Card, CardContent } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import baseURL from "../BackendApi/BackendConnection";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../Components/Redux/userSlice";

const UserProfile=()=>{

    const user = useSelector(selectUser);
    const [Profile,setPatientProfile] = useState({});
    useEffect(()=>{
        document.title="Your Profile";
        displayProfile();
    },[])

    const displayProfile=()=>{
        axios.get(`${baseURL}/${user.role}${user.account}/Profile`).then(
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
                            <h3>--- {user.role} Dashboard ---</h3>
                            <p className='btc'>{user.role} Name : {Profile.name}</p>
                            <p className='btc'>MobileNumber : {Profile.phone}</p>
                            <p className='btc'>Gender : {Profile.gender}</p>
                            <p className='btc'>EmailId : {Profile.email}</p>
                            </div>
                            )


                        : "No Profile found"
                    }
                </CardContent>
            </Card>
        </div>
    )
}

export default UserProfile;