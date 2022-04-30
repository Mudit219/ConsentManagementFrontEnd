import React from 'react';

const UserNotifications=()=>{
    return (
        <Grid lg={12} key={post.title}>
            <Card sx={{ width: "60%", height: "100%"}}>
                <CardHeader title={post.title} />

                <Grid container>
                    {
                        post.skills.map((item) => (
                            <Grid item key={item.id}>
                                <Fab color="secondary" aria-label={item.id} sx={{ fontSize: "15px", marginBottom: "10px", marginLeft: "20px", borderRadius: "5px" }} size="small" variant="extended">
                                    {item.skill}
                                </Fab>
                            </Grid>
                        ))  // console.log(post.skills)
                    }
                </Grid>
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
            </Card>
        </Grid>
    );
}

export default UserNotifications;