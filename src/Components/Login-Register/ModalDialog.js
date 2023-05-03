import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import LoginForm from './Login-Form';

const ModalDialog = ({ open, handleClose, web3}) => {
  
  return (
    // props received from App.js
    <Dialog open={open} onClose={handleClose}>
      <LoginForm handleClose={handleClose} web3={web3}/>
    </Dialog>
  );
};

export default ModalDialog;