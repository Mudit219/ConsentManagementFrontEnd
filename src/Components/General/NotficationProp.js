import React from "react";
import { Card,CardHeader,CardContent,CardActions,CardMedia, Typography } from '@mui/material';
import { typography } from '@mui/system';
import { Container } from "@mui/material";
import { Button } from "@mui/material";
import { Grid } from "@mui/material";



const NotificationProp=({title,data,button1Val,button2Val,button1ValClick,button2ValClick})=>{
    return (
    <Grid item lg={12} key={data.metaId}>
        <Card sx={{width: "100%"}}>
            <Typography variant="h5" style={{fontWeight:'bold',padding:10}}> {title} </Typography>
            <CardContent className="subtitle" style={{display:'flex',flexDirection:'row'}}>
                <CardMedia image={data.img} style={{height:"100px",width:"100px",borderRadius:"50%"}} />
                <Container style={{display:'flex',flexDirection:'column'}}>
                    <div style={{display:'flex',flexDirection:'row'}}>
                        {
                            data.name && (
                                <typography  variant="body2" color="text.secondary" style={{marginTop:"3%",fontSize:'1.5rem'}}>
                                    {data.name+" ("+data.metaId +")"}
                                </typography >
                            )
                        }
                        {/* {
                            data.msg && (
                                <typography  variant="body2" color="text.secondary" style={{marginLeft: "1%", marginTop:"3%",fontSize:'1.5rem'}}>
                                    {data.msg}
                                </typography >
                            )
                        } */}
                    </div>
                    {
                        data.description && (
                            <typography  variant="body2" color="text.secondary" style={{marginTop:"3%",fontSize:'1.5rem'}}>
                                {data.description}
                            </typography >
                        )
                    }
                </Container>
                {
                // console.log(button1Val!="",button2Val!="")
            }
            {
                button1Val && button2Val && (
                    <CardActions style={{}}>
                        {
                            // console.log("I ma here")
                        }
                        <Button size="small" onClick={() => button1ValClick(data.metaId)} variant="contained" sx={{width:"175px", backgroundColor:"#2E9CCA"}}> {button1Val}</Button>
                        <Button size="small" onClick={button2ValClick} variant="contained" sx={{ marginLeft: "500px",backgroundColor:"#464866"}}> {button2Val}</Button>
                    </CardActions>
                )
            }
            </CardContent>
            
        </Card>
    </Grid> 
    )
}

export default NotificationProp;