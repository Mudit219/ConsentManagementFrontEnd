import React from "react";
import ConnectDoctor from "../Components/General/ConnectDoctor";

const ConnectedDoctors=({web3})=>{
    // console.log(web3);
    return (
        <ConnectDoctor web3={web3}/>
    );
}

export default ConnectedDoctors;