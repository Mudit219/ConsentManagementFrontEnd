import React, { Fragment, useEffect, useState }  from 'react'
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import { selectUser } from '../Redux/userSlice';
import { logout } from "../Redux/userSlice";

function MetaNavigate(){
    const user = useSelector(selectUser);
    const dispatch = useDispatch()
    const navigate = useNavigate();;
    const ReleaseAccount = () => {
    //   console.log("Dispatching the account ")
      dispatch(logout());
      navigate("/login");
    }
    window.ethereum.on('accountsChanged', function (accounts) {
        // console.log("Changing Accounts here . . . .")
        if(user){
            ReleaseAccount();
        }
        else{
            window.location.reload(false);
        }
    })
    
    return (
       <></>
     )
}

export default MetaNavigate;