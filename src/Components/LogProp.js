import React from "react";
import { Card,CardHeader,CardContent,CardActions,CardMedia,Typography } from '@mui/material';
import { typography } from '@mui/system';
import { Container } from "@mui/material";
import { Button } from "@mui/material";
import { Grid ,Box} from "@mui/material";



const LogProp=({title,data,button1Val,button2Val,button1ValClick,button2ValClick})=>{
    return (
    <Grid item lg={12} key={title}>
        <Card sx={{width: "100%"}}>
        <Typography variant="h5" style={{fontWeight:'bold',padding:10}}> {title} </Typography>            
        <CardContent className="subtitle" style={{display:'flex',flexDirection:'row'}}>
        <CardMedia image={data['patient_data'].img} style={{height:"100px",width:"100px",borderRadius:"50%"}} />
                {/* <img src='https://st.depositphotos.com/1771835/1477/i/450/depositphotos_14779771-stock-photo-portrait-of-confident-young-doctor.jpg' style={{height:"150px",width:"150px",borderRadius:"50%"}} /> */}
                    {
                        data.msg && (
                            <Box style={{display:"inline-flex",flexDirection:'column'}}>
                                <typography  variant="body2" color="text.secondary" style={{marginTop:"3%",fontSize:'1.5rem'}}>
                                    {data.msg.split('Doctor')[0]} 
                                </typography >
                                <typography  variant="body2" color="text.secondary" style={{marginTop:"3%",fontSize:'1.5rem'}}>
                                    {"Doctor " +data.msg.split('Doctor')[1]} 
                                </typography >
                                <typography  variant="body2" color="text.secondary" style={{marginTop:"3%",fontSize:'1.5rem'}}>
                                    {data.description}
                                </typography >
                            
                            </Box>
                        )
                    }
                    
            </CardContent>
            
        </Card>
    </Grid> 
    )
}

export default LogProp;