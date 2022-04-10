import React, { Fragment, useEffect, useState }  from 'react'
import { BrowserRouter as Router, Routes, Route, Redirect, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

import { useWeb3React } from '@web3-react/core'
import Web3 from "web3/dist/web3.min";

import {Box, Stack} from '@mui/material';

import SideMenuPatient from './Components/General/Menu'
import Header from './Components/General/Header'
import {selectUser} from "./Components/Redux/userSlice";
import doctorMenu from './Components/DoctorDashboard/DoctorMenu'
import patientMenu from './Components/PatientDashboard/PatientMenu'
import AllConsents from './pages/PatientConsents'
// import PrivateRoute from './Components/Login-Register/Authentication';
// import Profile from "./Components/Profile/profile";

import Login from "./pages/Login";
import DisplayRecords from './pages/EHealthRecords';
import UserProfile from './pages/Profile';
import RequestConsent from './pages/RequestConsent';
import MetaNavigate from './Components/General/MetaMaskNavigate';



export default function App() {
    
    // const injectedConnector = new InjectedConnector({supportedChainIds: [1,3, 4, 5, 42, 1337],})
    const { chainId, account, activate, active,library } = useWeb3React()
    const [ web3,setWeb3] = useState();
    const user =  useSelector(selectUser);
    // console.log(user);
    
    const startWeb3 = async () => {
      await window.ethereum.enable();
      const provider = new Web3.providers.HttpProvider(
        "http://127.0.0.1:8545"
      );
      setWeb3(new Web3(provider));
    }
    useEffect(() => {
        if(library && !web3) {
          startWeb3()
        }
    })
    return ( 
            
      <Router>
          {

            user &&
            (
            <>
            <Header />
            <Box sx={{ display: 'flex' }}>
            
              {
                // ----------------------------------------------------------------------------
                // Directing to Doctor Dashboard
                (user.role == "Doc_")
                ?(
                  <Fragment>
                    <SideMenuPatient tabs={doctorMenu}/>
                    <Routes >
                      <Route exact path={"/E-Health-Records"} element = {<DisplayRecords />} />
                      <Route exact path={"/Profile"} element={<UserProfile role="Doc_"/>} />
                      <Route exact path={"/Request-Consent"} element={<RequestConsent web3={web3}/>} />
                      <Route exact path="/login" element={user && (<Navigate replace to= "/E-Health-Records"/>)} />
                      <Route exact path="/" element={user && (<Navigate replace to= "/E-Health-Records"/>)} />
                    </Routes>
                  </Fragment>)
                :(
                //-----------------------------------------------------------------------------
                // Directing to Patient Dashboard
                  <Fragment>
                    <SideMenuPatient account={account} tabs={patientMenu}/>
                    <Routes>
                      <Route exact path={"/E-Health-Records"} element = {<DisplayRecords />} />
                      <Route exact path={"/Profile"} element={<UserProfile />} />
                      <Route exact path={"/Consents"} element={<AllConsents />} />
                      {/* <Route exact path="/login" element={user && (<Navigate replace to= "/E-Health-Records"/>)} /> */}
                      <Route exact path="/" element={user && (<Navigate replace to= "/E-Health-Records"/>)} />
                    </Routes>
                  </Fragment>
                )
              }
            </Box>
            </>
            )
          }
          {
              //-----------------------------------------------------------------------------
              // Directing to Login Page
              !user && (
                <Routes>
                  <Route exact path="/login" element={<Login web3={web3} />} />
                  <Route exact path="/" element={<Navigate replace to= "/login"/>} />
                </Routes>
              )
          }
          {
              <MetaNavigate />
          }
      </Router>
    )
}
