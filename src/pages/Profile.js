import { Card, CardContent } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../Components/Redux/userSlice";
import baseURL from "../BackendApi/BackendConnection";

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
    return (
        <div>
            <Card>
                <CardContent>
                    {
                        Profile != null && user.role == "Pat" &&
                            (<div className='card' key={Profile.metaId}>
                                {/* <h3>{role} Dashboard</h3> */}
                                <img src="https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg"></img>
                                <p className='btc'>{user.role} Name : {Profile.name}</p>
                                <p className='btc'>MobileNumber : {Profile.phone}</p>
                                <p className='btc'>Gender : {Profile.gender}</p>
                                <p className='btc'>EmailId : {Profile.email}</p>
                            </div>
                            )
                        
                    }
                    {
                        Profile != null && user.role == "Doc" &&
                            (<div className='card' key={Profile.metaId}>
                                {/* <h3>{role} Dashboard</h3> */}
                                <img src="https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg"></img>
                                <p className='btc'>{user.role} Name : {Profile.name}</p>
                                <p className='btc'>Mobile Number : {Profile.phone}</p>
                                <p className='btc'>Gender : {Profile.gender}</p>
                                <p className='btc'>Email Id : {Profile.email}</p>
                                <p className='btc'>Specialization : {Profile.specialization}</p>
                                <p className='btc'>Doctor License : {Profile.doctorLicense}</p>
                            </div>
                            )
                        
                    }
                    
                </CardContent>
            </Card>
        </div>
    )
}

export default UserProfile;