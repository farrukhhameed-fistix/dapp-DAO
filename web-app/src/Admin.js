import React, { useState } from "react";
import { ethers } from "ethers";
import daoAbi from './contracts/Dao.sol/Dao.json';

export default function Admin({existingOrgName, existingProposal, onSaveSucceed}){

    const [orgName, setOrgName] = useState(existingOrgName);
    const [activeProposal, setActiveProposal] = useState(existingProposal);
    const [callInProgress, setCallInProgress] = useState();
    
    const daoContactAddress = "0x6CDfC287f72e2e46Fd2471564beb5b36e9C667a2";//"0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";//"0x3217C113013faD3Ff2659dc0A1514a2e31617a98";

    const saveOrgnization = async () => {

        if(orgName && window.ethereum){

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner(); 
            const daoContract = new ethers.Contract(daoContactAddress, daoAbi.abi, signer);

            setCallInProgress(true);
            const orgTransaction = await daoContract.setOrgName(orgName);
            await orgTransaction.wait();
            setCallInProgress(false);

            onSaveSucceed();
        }
    }

    const saveProposal = async () => {

        if(activeProposal && window.ethereum){

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner(); 
            const daoContract = new ethers.Contract(daoContactAddress, daoAbi.abi, signer);
            
            setCallInProgress(true);
            const proposalTransaction = await daoContract.setProposal(activeProposal);
            await proposalTransaction.wait();

            setCallInProgress(false);

            onSaveSucceed();
        }
    }
    
    return <>
        <div>
            <label>Orgnization: <input type="text" value={orgName} onChange={(e)=>{setOrgName(e.target.value)}}/></label>
            <button type="button" onClick={saveOrgnization} >Save Orgnization</button>
        </div>
        <div>
            <label>Proposal: <input type="text" value={activeProposal} onChange={(e)=>{setActiveProposal(e.target.value)}}/></label>
            <button type="button" onClick={saveProposal} >Save New Proposal</button>
        </div>
        {callInProgress && '..............................'}
    </>
}  