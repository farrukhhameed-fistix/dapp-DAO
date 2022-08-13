// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

struct ProposalVote{
    string proposal;
    bool approved;
} 

contract Dao {

    string public orgName;
    
    string public activeProposal;
    uint16 public activeProposalApprovedVotesCount;
    uint16 public activeProposalRejectedVotesCount;  
    mapping(address => ProposalVote) public proposalVotes; 

    address public owner;  
    
    event proposal_ready_for_vote(string proposal);

    constructor(){
        owner = msg.sender;
    }
    
    function setOrgName(string memory _name) public {
        require(msg.sender == owner, "Only owner can set org name");
        orgName = _name;
        console.log("orgnization name set to ", orgName);        
    }

    function setProposal(string  memory _proposal) public {
        require(msg.sender == owner, "Only owner allowed to change proposal");
        activeProposal = _proposal;
        activeProposalApprovedVotesCount = 0;
        activeProposalRejectedVotesCount = 0; 

        console.log("new proposal", _proposal);      
        emit proposal_ready_for_vote(_proposal);
    }

    function castVoteForActiveProposal(bool inProposalFavour) external {

        require(keccak256(bytes(proposalVotes[msg.sender].proposal)) != keccak256(bytes(activeProposal)), "Already vote cast for active proposal");

        if(inProposalFavour)
            activeProposalApprovedVotesCount++;
        else
            activeProposalRejectedVotesCount++;    
            
        proposalVotes[msg.sender] = ProposalVote(activeProposal, inProposalFavour);
        console.log("total votes ", activeProposalApprovedVotesCount, " for proposal", activeProposal); 
    }

}