import React from "react";
import ConnectDoctor from "../Components/General/ConnectDoctor";
import {useEffect} from 'react'
import {useSelector} from "react-redux";
import {selectUser} from "../Components/Redux/userSlice";


const ConnectedDoctors=({web3})=>{
    const user = useSelector(selectUser);
    
    useEffect(()=>{
        GetConnections();
    },[])

    const GetConnections = async () =>  {
        let abi = require("../contracts/ConsentManagementSystem.json")["abi"];
        let CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACTADDRESS;
        
        // console.log(CONTRACT_ADDRESS,web3,user.account);
        let contract = new web3.eth.Contract(abi,CONTRACT_ADDRESS);
        
        // contract.methods.GetConnectionFile.call().then(console.log);
        var meta_ids_ConnDoc = [];

        await contract.methods.GetConnectionFile().call({from : user.account},async function(err,res) {

            let ConnectionFileAbi = require("../contracts/ConnectionFile.json")["abi"];
            let ConnectionFileContract = new web3.eth.Contract(ConnectionFileAbi,res);
            
            
            await ConnectionFileContract.methods.getListOfConnections().call({from : user.account},async(err,ConnectionList) => {
                // console.log(ConnectionList)
                ConnectionList.forEach(async (connection) => {
                    let ConnectionAbi = require("../contracts/Connection.json")["abi"];
                    let ConnectionContract = new web3.eth.Contract(ConnectionAbi,connection);
                    var ConnectedDoc = await ConnectionContract.methods.getDoctor().call({from : user.account})
                    meta_ids_ConnDoc.push(ConnectedDoc);
                });
            })
        })
        .catch(console.error);

        console.log(meta_ids_ConnDoc)
    }
    // console.log(web3);
    return (
        <ConnectDoctor web3={web3}/>
    );
}

export default ConnectedDoctors;