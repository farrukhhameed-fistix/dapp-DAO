import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import daoAbi from './contracts/Dao.sol/Dao.json';
import Admin from './Admin';

export default function ProposalVote(){


    const [ownerAddress, setOwnerAddress] = useState();
    const [orgnizationName, setOrgnizationName] = useState();
    const [proposal, setProposal] = useState();
    const [myVote, setMyVote] = useState();
    const [totalVotesCast, setTotalVotesCast] = useState();
    const [inFavourVotesCount, setInFavourVotesCount] = useState();
    const [notInFavourVotesCount, setNotInFavourVotesCount] = useState();
    const [myAddress, setMyAddress] = useState();
    const [isOwner, setIsOwner] = useState();
    const [callInProgress, setCallInProgress] = useState();
    
    const daoContactAddress = "0x6CDfC287f72e2e46Fd2471564beb5b36e9C667a2";//"0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";//"0x3217C113013faD3Ff2659dc0A1514a2e31617a98";

    useEffect(()=>{
        getMyAddress();
    },[]);

    useEffect(()=>{        
        getProposalInfo();
    },[myAddress]);   

    const getProposalInfo = async () => {
        if (window.ethereum){
            
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const daoContract = new ethers.Contract(daoContactAddress, daoAbi.abi, provider);
            const contractOwner = await daoContract.owner();                        
            const orgName = await daoContract.orgName();            
            const activeProposal = await daoContract.activeProposal();
            const activeProposalApprovedVotesCount = await daoContract.activeProposalApprovedVotesCount();
            const activeProposalRejectedVotesCount = await daoContract.activeProposalRejectedVotesCount();
            if(myAddress){
                const myProposalVote = await daoContract.proposalVotes(myAddress);
                
                if(myProposalVote && myProposalVote.proposal && myProposalVote.proposal == activeProposal){
                     setMyVote(myProposalVote.approved);
                } else{
                    setMyVote(null);
                }
            }

            setOwnerAddress(contractOwner);
            setOrgnizationName(orgName);
            setProposal(activeProposal);
            setTotalVotesCast(activeProposalApprovedVotesCount + activeProposalRejectedVotesCount);
            setInFavourVotesCount(activeProposalApprovedVotesCount);
            setNotInFavourVotesCount(activeProposalRejectedVotesCount);
            setIsOwner(contractOwner.toLowerCase() == myAddress?.toLowerCase())            
        }
    }

    const getMyAddress = async ()=> {
        if(window.ethereum){
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const accounts = await provider.send("eth_requestAccounts",[]);

            if(accounts && accounts[0])
                setMyAddress(accounts[0]);
        }
    }

    const castMyVoteForProposal = async (inFavour) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner(); 
        const daoContract = new ethers.Contract(daoContactAddress, daoAbi.abi, signer);

        setCallInProgress(true);
        const transaction = await daoContract.castVoteForActiveProposal(inFavour);
        await transaction.wait();

        await getProposalInfo();
        setCallInProgress(false);
    }

    const CastVote = ({inFavour, setVote}) => {
        return<>
            <button type="button"  onClick={()=>{castMyVoteForProposal(true)}}>In Favour</button>
            <button type="button"  onClick={()=>{castMyVoteForProposal(false)}}>Not In Favour</button>
            {callInProgress && '.........................'}
        </>
    }

return <>
        <h1>Orgnization: {orgnizationName}</h1>
        <h1>Proposal: {proposal}</h1>
        <h3>Total Votes Cast: {totalVotesCast}</h3>
        <h3>In Favour Votes: {inFavourVotesCount}</h3>
        <h3>Not In Favour Votes: {notInFavourVotesCount}</h3>
        <h3>My Vote: {
                        myVote === true ? 'In Favour' : myVote === false ? 'Not In Favour' 
                        : <CastVote inFavour={myVote} setVote={setMyVote} />
                    }   
        </h3>
        <h3>IsAdmin: {isOwner ? "Yes" : "False"}</h3>                    
        {
        isOwner && <div><Admin existingOrgName={orgnizationName} existingProposal={proposal} onSaveSucceed={getProposalInfo}/></div>
        }     
    </>;
}