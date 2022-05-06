import React from "react";
import { Card, CardContent,CardHeader,CardMedia} from "@mui/material";
import { Grid } from "@mui/material";
import ConnectionProfileDialog from './ConnectionProfileDialog'
import { useState } from "react";
import { Typography,Button } from "@mui/material";

const ConnectionProfile=({doctor})=>{

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Grid item key={doctor.metaId} lg={3}>
            <Card sx={{width:"100%"}}>
                <CardMedia
                    component="img"
                    height="200"
                    image={doctor.img}
                    alt="doctor"
                />
                <CardHeader title={doctor.name} style={{marginBottom:"-20%",display:'inline-flex'}} />
                
                <CardContent >
                    <Typography variant="body1" color="text.secondary">
                        {doctor.specialization}
                    </Typography>
                    <Button onClick={handleOpen} style={{marginLeft:"50%",marginTop:"4%",position:"relative"}} >View Profile</Button>
                </CardContent>
                <ConnectionProfileDialog open={open} handleClose={handleClose} doctor={doctor} />
            </Card>
        </Grid>
    );
}

export default ConnectionProfile;