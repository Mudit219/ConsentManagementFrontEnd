import React,{ useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import {
    Mainnet,
    DAppProvider,
    useEtherBalance,
    useEthers,
    Config,
} from '@usedapp/core'
import {selectUser} from "../features/userSlice";
import {useSelector} from "react-redux";

const PrivateRoute = () => {
    const user =  useSelector(selectUser);

    // const account = AccountCheck();
    // const auth = true; // determine if authorized, from context or however you're doing it

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;