import React from 'react'
<<<<<<< HEAD
import ReactDOM from 'react-dom'

import {
    Mainnet,
    DAppProvider,
    useEtherBalance,
    useEthers,
    Config,
} from '@usedapp/core'

import {Box} from '@mui/material';
import { formatEther } from '@ethersproject/units'
import { getDefaultProvider } from 'ethers'
=======

import {Box} from '@mui/material';
>>>>>>> 56bdcfd0c69d8ddc6137b9ecc75dd346e62197c1
import SideMenuPatient from '../Components/PatientDashboard/Menu'
import Header from '../Components/General/Header'

const Homepage = () => {
    
    // const {account} = useEthers()
    // console.log("Hello sthere")
    return    (
        <Box sx={{ display: 'inline-flex' }}>
            {/* <SideMenuPatient / > */}
<<<<<<< HEAD
            <Header />
=======
            {/* <Header /> */}
>>>>>>> 56bdcfd0c69d8ddc6137b9ecc75dd346e62197c1
        </Box >)
}

export default Homepage