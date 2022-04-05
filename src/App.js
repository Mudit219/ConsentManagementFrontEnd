import React, { useEffect, useState }  from 'react'
import {Box, Stack} from '@mui/material';
import SideMenuPatient from './Components/PatientDashboard/Menu'
import Header from './Components/General/Header'
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoute from './Components/Login-Register/Authentication';
import Profile from "./Components/Profile/profile";
import DisplayRecords from './Components/PatientDashboard/EHealthRecords';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import {selectUser} from "./Components/features/userSlice";
import {useSelector} from "react-redux";




export default function App() {
    
    const injectedConnector = new InjectedConnector({supportedChainIds: [1,3, 4, 5, 42, 1337],})
    const { chainId, account, activate, active,library } = useWeb3React()
    const user =  useSelector(selectUser);

    useEffect(() => {
        console.log(chainId, account, active)
    })
    return ( 
            
                <Router>
                    {
                        user &&
                        (
                        <Box sx={{ display: 'flex' }}>
                    
                        <SideMenuPatient patientId={account}/>
                        <Stack sx={{ display: 'flex' }}>
                        <Header />
                        <Routes>
                            <Route path={account+"/E-Health-Records"} element = {<DisplayRecords patientId={account}/>} />
                            <Route exact path="/account/:id" element={<Profile />} />
                            <Route  path="/" element={<PrivateRoute />} >

                            </Route>
                        </Routes>
                            
                        </Stack>
                        
                        </Box>
                        )
                    }
                    {
                        !user &&
                        (
                        <Routes>
                            <Route path="/" element={<Login />} />
                        </Routes>
                        )
                    }

                </Router>
            
        
    )
}
