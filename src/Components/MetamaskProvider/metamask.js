import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'

import { InjectedConnector } from '@web3-react/injected-connector'
export const injected = new InjectedConnector({ supportedNetworks: [1, 3, 4, 5, 42,1337] })

function MetamaskProvider({ children }) {
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React()
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    injected
      .isAuthorized()
      .then((isAuthorized) => {
        setLoaded(true)
        if (isAuthorized && !networkActive && !networkError) {
          activateNetwork(injected)
        }
      })
      .catch(() => {
        setLoaded(true)
      })
  }, [activateNetwork, networkActive, networkError])
  if (loaded) {
    return children
  }
  return <>Loading</>
}

export default MetamaskProvider;