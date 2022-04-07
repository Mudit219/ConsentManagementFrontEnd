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
import PatientProfile from './Components/PatientDashboard/Profile';
import PatientConsents from './Components/PatientDashboard/PatientConsents';
import RequestConsent from './pages/RequestConsent';
// import Web3 from "web3";
import Web3 from "web3/dist/web3.min";


export default function App() {
    
    const injectedConnector = new InjectedConnector({supportedChainIds: [1,3, 4, 5, 42, 1337],})
    const { chainId, account, activate, active,library } = useWeb3React()
    const [ web3,setWeb3] = useState();
  
    const user =  useSelector(selectUser);
    // const role = useSelector(selectUser)
    const startWeb3 = async () => {
      await window.ethereum.enable();
      const provider = new Web3.providers.HttpProvider(
        "http://127.0.0.1:8545"
      );
      setWeb3(new Web3(provider));
    }
    useEffect(() => {
        // console.log(chainId, account, active)
        if(library && !web3) {
          startWeb3()
        }
        
    })
    return ( 
            
      <Router>
          {
            user &&
            (
            <Box sx={{ display: 'flex' }}>
        
            <SideMenuPatient account={account}/>
            <Stack sx={{ display: 'flex' }}>
            <Header />
            
              {
                (user.role == "Doc_") 
                ?(
                  <Routes>
                <Route path={"/E-Health-Records"} element = {<DisplayRecords account={account} role={"Doc_"} />} />
                <Route path={"Profile"} element={<PatientProfile account={account} role="Doc_"/>} />
                <Route path={"Consents"} element={<PatientConsents account={account}/>} />
                <Route path={"/RequestConsent"} element={<RequestConsent account={account} web3={web3}/>} />
                <Route exact path="/account/:id" element={<Profile />} />
                <Route  path="/" element={<PrivateRoute />} >

                </Route>
                </Routes>
                )
                :(
                  <Routes>
                <Route path={"/E-Health-Records"} element = {<DisplayRecords account={account} role={"Pat_"} />} />
                <Route path={"Profile"} element={<PatientProfile account={account} role="Pat_"/>} />
                <Route path={"Consents"} element={<PatientConsents account={account}/>} />
                <Route exact path="/account/:id" element={<Profile />} />
                <Route  path="/" element={<PrivateRoute />} >

                </Route>
                </Routes>)
              }
                
            
                
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
