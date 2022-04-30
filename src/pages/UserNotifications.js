import React from 'react';
import {useState,useEffect} from 'react'
import { Card,CardHeader,CardContent } from '@mui/material';
import { typography } from '@mui/system';

const UserNotifications=()=>{

    useEffect(()=>{
        fetchConnectionRequests();
        fetchConsentRequest();
    },[])

    const [requestedRecords,setRequestedRecords] = useState([]);
    const [connectionRequest,setConnectionRequest] = useState([]);

    const fetchConsentRequest=()=>{

    }

    const fetchConnectionRequests=()=>{

    }


    return (
        <Grid lg={12} key={post.title}>
            {/* <Card sx={{ width: "60%", height: "100%"}}>
                <CardHeader title={post.title} />
                <CardContent className="subtitle">
                    <typography  variant="body2" color="text.secondary">
                        {"By: " + post.id}
                    </typography >
                </CardContent>
                <CardContent className="MainBody">
                    <hr/>
                    <typography variant="body2" color="text.secondary">
                    {post.description}
                    </typography>
                </CardContent>
                <Button size="small" variant="contained" onClick={handleAddInterest} sx={{ marginLeft: "700px", position: "static" }}> Interested</Button>
            </Card> */}
        </Grid>
    );
}

export default UserNotifications;