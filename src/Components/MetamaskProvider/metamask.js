import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'

import { InjectedConnector } from '@web3-react/injected-connector'
export const injected = new InjectedConnector({ supportedNetworks: [8081] })

function MetamaskProvider({ children }) {
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React()
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    console.log("Injected",injected.isAuthorized(),networkError, networkActive)
    injected
      .isAuthorized()
      .then((isAuthorized) => {
        console.log(isAuthorized)
        if (isAuthorized && !networkActive && !networkError) {
          activateNetwork(injected)
          setLoaded(true)
        }
      })
      .catch(() => {
        setLoaded(true)
      })
  }, [activateNetwork, networkActive, networkError])
  if (loaded && window.ethereum) {
    return children
  }
  return <h1>Please install Metamask to access this website</h1>
}

export default MetamaskProvider;