import React from "react";
import { Card,CardHeader,CardContent,CardActions } from '@mui/material';
import { typography } from '@mui/system';
import { Container } from "@mui/material";
import { Button } from "@mui/material";
import { Grid } from "@mui/material";



const NotificationProp=({title,data,button1Val,button2Val})=>{
    return (
    <Grid item lg={12} key={data.metaId}>
        <Card sx={{height:"30vh",width: "100%"}}>
            <CardHeader title={title}/>
            <CardContent className="subtitle" style={{display:'flex',flexDirection:'row'}}>
                <img src='https://st.depositphotos.com/1771835/1477/i/450/depositphotos_14779771-stock-photo-portrait-of-confident-young-doctor.jpg' style={{height:"150px",width:"150px",borderRadius:"50%"}} />
                <Container style={{display:'flex',flexDirection:'column'}}>
                    {
                        data.name && (
                            <typography  variant="body2" color="text.secondary" style={{marginTop:"3%",fontSize:'1.5rem'}}>
                                {data.name + " has accepted your connection request"}
                            </typography >
                        )
                    }
                    {
                        data.description && (
                            <typography  variant="body2" color="text.secondary" style={{marginTop:"3%",fontSize:'1.5rem'}}>
                                {data.description}
                            </typography >
                        )
                    }
                </Container>
            </CardContent>
            {
                console.log(button1Val!="",button2Val!="")
            }
            {
                button1Val && button2Val && (
                    <CardActions style={{marginLeft:"30%",marginTop:"-7%"}}>
                        {
                            console.log("I ma here")
                        }
                        <Button size="small" variant="contained" sx={{ marginLeft: "700px",backgroundColor:"#2E9CCA"}}> {button1Val}</Button>
                        <Button size="small" variant="contained" sx={{ marginLeft: "700px",backgroundColor:"#464866"}}> {button2Val}</Button>
                    </CardActions>
                )
            }
        </Card>
    </Grid> 
    )
}

export default NotificationProp;