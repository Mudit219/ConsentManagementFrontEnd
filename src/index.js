import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Web3ReactProvider } from '@web3-react/core'
import {Provider} from 'react-redux';
import {store,persistor} from "./Components/app/store"
import { PersistGate } from 'redux-persist/integration/react'
import MetamaskProvider from "./Components/MetamaskProvider/metamask";
import { Web3Provider } from '@ethersproject/providers'
import 'react-datepicker/dist/react-datepicker.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './index.css'


function getLibrary(provider){
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

ReactDOM.render( 
  <Web3ReactProvider getLibrary={getLibrary}>
  <MetamaskProvider>
  <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
  
    <App / >
      
  </PersistGate>
  <ToastContainer position="top-right"
                autoClose={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable />

  </Provider>
  </MetamaskProvider>
  </Web3ReactProvider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();