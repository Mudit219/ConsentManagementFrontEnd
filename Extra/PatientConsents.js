import React, { useState } from "react";
import Popup from "../Components/PatientDashboard/Popup";
import { Button } from "@mui/material";
import Dialog from '@material-ui/core/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from "@mui/material";
// import Form from "../Components/Login-Register/Login-Form";
import './PatientConsent.css'

// const AllConsents = () => {
//     const [isOpen, setIsOpen] = useState(false);

//     const togglePopup = () => {
//         setIsOpen(!isOpen);
//     }
//     return (
//         // props received from App.js
//         <div>
//             <input
//                 type="button"
//                 value="Click to Open Popup"
//                 onClick={togglePopup}
//             />
//             {isOpen && <Dialog open={isOpen}
//                 content={<Form><h1>HelloWorld</h1></Form>}
//                 handleClose={togglePopup} />}
//         </div>
//         // <Dialog open={true} onClose={handleClose}>
//         //     <Form handleClose={handleClose} role={role} firstLoginRoot={firstLogin} />
//         // </Dialog>
//     );
// };
// const AllConsents =()=> {
//     const [isOpen, setIsOpen] = useState(false);

//     const togglePopup = () => {
//         setIsOpen(!isOpen);
//     }
//     return (
//         <div>
//             <h1>HelloWorld</h1>
//             <input
//                 type="button"
//                 value="Click to Open Popup"
//                 onClick={togglePopup}
//             />
//             <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
//             {isOpen && <Popup
//                 content={<>
//                     <b>Design your Popup</b>
//                     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
//                     <button>Test button</button>
//                 </>}
//                 handleClose={togglePopup} />}
//         </div>
//     )
// }



function AllConsents() {
    const [open, setOpen] = React.useState(false);
    const [value, SetValue] = React.useState('hello')
    const [records, SetRecords] = React.useState([]);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const empty = () => {
        SetRecords([...records, value])
        SetValue('')
        { console.log(records) }
    }
    return (
        <Grid>
            <Button variant="outlined" onClick={handleClickOpen}>
                Create Consent
            </Button>
            <Dialog open={open} onClose={handleClose} className='DialogBox'>
                <DialogTitle>CreateConsent</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText> */}
                    <div className="parent">
                        <div className="child">
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="ConsentID"
                                type="consentid"
                                fullWidth
                                variant="standard"
                            />
                        </div>
                        <div className="child">
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Doctor"
                                type="Doctor"
                                fullWidth
                                variant="standard"
                            />
                        </div>
                    </div>
                    <div>
                        <h2> Records</h2>
                        <div>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Record"
                                type="Record"
                                fullWidth
                                variant="standard"
                                value={value}
                                onChange={(e) => SetValue(e.target.value)}
                            />
                        </div>
                        {/* <h2>Parameters</h2>
                        <div className="parameters">
                            <div className="childparameters">
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="From Date"
                                    type="From Date"
                                    fullWidth
                                    variant="standard"
                                />
                            </div>
                            <div className="childparameters">
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="To Date"
                                    type="To Date"
                                    fullWidth
                                    variant="standard"
                                />
                            </div>
                        </div> */}
                        <Button className="add" onClick={empty}>+Add Record</Button>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Save Consent</Button>
                </DialogActions>
            </Dialog >
        </Grid >
    );
}


export default AllConsents;
