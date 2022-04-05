import React, { useEffect, useState }  from 'react'
import ReactDOM from 'react-dom'

import {
    Mainnet,
    DAppProvider,
    useEtherBalance,
    useEthers,
    Config,
} from '@usedapp/core'

import {Box, Stack} from '@mui/material';
import { formatEther } from '@ethersproject/units'
import { getDefaultProvider } from 'ethers'
import SideMenuPatient from './Components/PatientDashboard/Menu'
import Header from './Components/General/Header'
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Homepage from './pages/Homepage';
import PrivateRoute from './Components/Login-Register/Authentication';
import {Provider} from 'react-redux';
import {store,persistor} from "./Components/app/store"
import { PersistGate } from 'redux-persist/integration/react'
import Profile from "./Components/Profile/profile";
// import getWeb3 from "./utils/getWeb3";
import DisplayRecords from './Components/PatientDashboard/EHealthRecords';
import PatientProfile from './Components/PatientDashboard/Profile';
import PatientConsents from './Components/PatientDashboard/PatientConsents'

const account=1234;

// function App() {
//   return (
//     <div className="App" style={{display:'flex'}}>
//       <Router>
//       <SideMenuPatient patientId={patientId}/>
//       <Routes>
//         <Route path={patientId+"/E-Health-Records"} element = {<DisplayRecords patientId={patientId}/>} />
//         <Route path={patientId+"/Profile"} element= {<PatientProfile/>} />
//       </Routes>
//       </Router>

export default function App() {
    // const {account,activateBrowserWallet} = useEthers()
    // const etherBalance = useEtherBalance(account)
    const SmartContractConnection = () => {

    }

    // const loadWeb3Account =async(web3) => {
    //     const accounts = await web3.eth.getAccounts();
    //     console.log(accounts);
    //     if(accounts){
    //       console.log("The Account is ",accounts[0]);
    //       setAccount(accounts[0]);
    //     }
    // }

    // const loadWeb3Contract = async(web3) =>{
    //     const networkId = await web3.eth.net.getId();
    //     const networkData = Decentralized.networks[networkId];
    //     console.log(networkData);
      
    //     if(networkData) {
    //       const abi = Decentralized.abi;
    //       const address = networkData.address;
    //       const contract = new web3.eth.Contract(abi,address);
    //       setContract(contract);
    //       return contract;
    //     }
    // }


    
    useEffect(async() => {
        // const web3 = await getWeb3();
        // console.log("Hello there")  
        // activateBrowserWallet();
    }, [])

    return ( 
        <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            
            <Router>
            <Box sx={{ display: 'flex' }}>
            
            <SideMenuPatient/>
            <Stack sx={{ display: 'flex' }}>
            {/* <Header /> */}
            <Routes>
                <Route path={"E-Health-Records"} element = {<DisplayRecords account={account}/>} />
                <Route path={"Profile"} element={<PatientProfile account={account}/>} />
                <Route path={"Consents"} element={<PatientConsents account={account}/>} />
                
                <Route path="/login" element={<Login />} />
                <Route exact path="/" element={<PrivateRoute />} >
                <Route exact path='/' element={<Homepage/>}/>  
                </Route>
            </Routes>
            
            </Stack>
            
            </Box>
    
        </Router>
            
        
        {/* <div>{!account && < button onClick = {
                () => activateBrowserWallet()
            } > Connect < /button>} 
            { account && < p > Account: { account } < /p>} {
            etherBalance && < p > Balance: { formatEther(etherBalance) } </p>
        }  
    </div> */}
        </PersistGate>
        </Provider>
        
    )
}
