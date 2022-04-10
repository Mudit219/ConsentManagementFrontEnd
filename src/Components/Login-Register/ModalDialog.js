import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Form from './Login-Form';

const ModalDialog = ({ open, handleClose,role,firstLogin }) => {
  return (
    // props received from App.js
    <Dialog open={open} onClose={handleClose}>
      <Form handleClose={handleClose} role={role} firstLoginRoot={firstLogin}/>
    </Dialog>
  );
};

export default ModalDialog;