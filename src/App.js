import React, { Fragment, useEffect, useRef }  from 'react'
import { BrowserRouter as Router, Routes, Route, Redirect, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

import { useWeb3React } from '@web3-react/core'
import Web3 from "web3/dist/web3.min";

import {Box, Stack, Container} from '@mui/material';

import SideMenuPatient from './Components/General/Menu'
import {selectUser} from "./Components/Redux/userSlice";
import doctorMenu from './Components/DoctorDashboard/DoctorMenu'
import patientMenu from './Components/PatientDashboard/PatientMenu'
// import PrivateRoute from './Components/Login-Register/Authentication';
// import Profile from "./Components/Profile/profile";
import MetaNavigate from "./Components/General/MetaMaskNavigate";
import Login from "./pages/Login";
import DisplayRecords from './pages/EHealthRecords';
import UserProfile from './pages/Profile';
import RequestConsent from './pages/RequestConsent';
import AllConsents from "./pages/CreateConsents";
import ConnectedDoctors from "./pages/ConnectedDoctors";
import DoctorNotifications from './pages/DoctorNotifications';
import PatientNotifications from './pages/PatientNotifications';
import Logs from "./pages/Logs";

export default function App() {
    
    // const injectedConnector = new InjectedConnector({supportedChainIds: [1,3, 4, 5, 42, 1337],})
    const { chainId, account, activate, active,library } = useWeb3React()
    const web3 = useRef();
    const user =  useSelector(selectUser);
    
    const startWeb3 = async () => {
      await window.ethereum.enable();
      const provider = new Web3.providers.HttpProvider(
        "http://127.0.0.1:8545"
      );
      web3.current = new Web3(provider);
    }

    useEffect(() => {
        startWeb3();
    },[])
    
    useEffect(() => {

    },[web3.current])

    return ( 
            
      <Router>
          {
            user &&
            (
            <>
            {/* <Header /> */}
            <Box sx={{ display: 'flex',  backgroundColor: '#A8D0E6', padding: 10, minWidth: "98vw", minHeight: "98.7vh", overflow: "auto"   }}>
            
              {
                // -----------------------------------------------------------------------------
                // Directing to Doctor Dashboard
                (user.role == "Doc")
                ?(
                  <Fragment>
                    <SideMenuPatient tabs={doctorMenu}/>
                    <Routes >
                      <Route exact path={"/E-Health-Records"} element = {<DisplayRecords web3={web3.current} />} />
                      <Route exact path={"/Profile"} element={<UserProfile/>} />
                      <Route exact path={"/Request-Consent"} element={<RequestConsent web3={web3.current}/>} />
                      <Route exact path={"/Notifications"} element={<DoctorNotifications web3={web3.current}/>} />
                      <Route exact path={"/Logs"} element={<Logs web3={web3.current}/>} />
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
                      <Route exact path={"/E-Health-Records"} element = {<DisplayRecords web3={web3.current} />} />
                      <Route exact path={"/Connected-Doctors"} element = {<ConnectedDoctors web3={web3.current}/>} />
                      <Route exact path={"/Profile"} element={<UserProfile />} />
                      <Route exact path={"/Consents"} element={<AllConsents web3={web3.current}/>} />
                      <Route exact path={"/Notifications"} element={<PatientNotifications web3={web3.current}/>} />
                      <Route exact path={"/Logs"} element={<Logs web3={web3.current}/>} />
                      <Route exact path="/login" element={user && (<Navigate replace to= "/E-Health-Records"/>)} />
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
                  <Route path="/login" element={<Login web3={web3.current}/>} />
                  <Route exact path="/" element={<Navigate replace to= "/login"/>} />
                </Routes>
              )
          }
           {<MetaNavigate />}
      </Router>
    )
    
}
