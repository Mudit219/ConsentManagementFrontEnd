import React,{ useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import {selectUser} from "../features/userSlice";
import {useSelector} from "react-redux";


const PrivateRoute = () => {
    const user =  useSelector(selectUser);
    console.log("coming  to this components of authenticate", user);
    const fun = () => {
        return user ? "User There" : "User Not There"
    }
    console.log(fun())
    // const account = AccountCheck();
    // const auth = true; // determine if authorized, from context or however you're doing it

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;