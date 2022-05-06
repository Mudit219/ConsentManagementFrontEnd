import React from "react";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import { Button,Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { TextField } from "@mui/material";
import { ImageListItem } from "@mui/icons-material";
import { Container } from "@mui/material";

const ConnectionProfileDialog=(props)=>{

    const {open,handleClose,doctor} = props;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby={doctor.name}
            maxWidth="md">
            <DialogTitle id="scroll-dialog-title" style={{textAlign:"center"}} >
            <img src={doctor.img} style={{height:"200px",width:"200px",borderRadius:"20%"}}/>
                <Typography variant="h4" color="text.primary" >
                        {doctor.name}
                </Typography>
            </DialogTitle>
            <DialogContent>
            <form style={{ backgroundColor: "#FFFFFF",marginTop:"5%" }}>
                    <Grid container spacing={5}>
                        {
                            Object.keys(doctor).filter(function(item){
                                return item!='img' && item!='authorities' && item!='name'
                            }).map((field)=>(
                                <Grid item lg={4}>
                                    <TextField
                                    id="outlined-read-only-input"
                                    label={field}
                                    multiline
                                    variant="filled"
                                    defaultValue={doctor[field]}
                                    InputProps={{
                                        readOnly: true,
                                    }}/>
                                </Grid>))
                        } 
                    </Grid>
            </form>           
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConnectionProfileDialog;