import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import LoginForm from './Login-Form';

const ModalDialog = ({ open, handleClose,role,firstLogin,web3 }) => {
  return (
    // props received from App.js
    <Dialog open={open} onClose={handleClose}>
      <LoginForm handleClose={handleClose} role={role} firstLoginRoot={firstLogin} web3={web3}/>
    </Dialog>
  );
};

export default ModalDialog;