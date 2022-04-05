import React from 'react'
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
import SideMenuPatient from '../Components/PatientDashboard/Menu'
import Header from '../Components/General/Header'

const Homepage = () => {
    
    // const {account} = useEthers()
    // console.log("Hello sthere")
    return    (
        <Box sx={{ display: 'inline-flex' }}>
            {/* <SideMenuPatient / > */}
            <Header />
        </Box >)
}

export default Homepage