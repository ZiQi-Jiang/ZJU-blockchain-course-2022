// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment the line to use openzeppelin/ERC20
// You can use this dependency directly because it has been installed already
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MyERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract StudentSocietyDAO {

    // use a event if you want
    // event ProposalInitiated(uint32 proposalIndex);
    event Voted(address indexed voter, uint8 proposal);
    uint256 constant public PASS_REWARD = 10000;
    uint256 constant public VOTE_PRICE = 3000;


    mapping(address => bool) public voted;
    struct Proposal {
        uint256 index;      // index of this proposal
        address proposer;  // who make this proposal
        uint256 startTime; // proposal start time
        uint256 duration;  // proposal duration
        uint256 endTime;
        string name;       // proposal name
        uint32 yes;
        uint32 no;
        // ...
        // TODO add any member if you want
    }

    MyERC20 studentERC20;
    
    // mapping(uint32 => Proposal[]) proposals; // A map from proposal index to proposal
    Proposal[] proposals;
   

    constructor() {
        // maybe you need a constructor
        studentERC20 = new MyERC20("name", "symbol"); 
        studentERC20.airdrop();

    }



    function createProposal(string memory _name) public {

        Proposal memory p3 =  Proposal({
            index:proposals.length,
            proposer: msg.sender,
            startTime:block.timestamp,
            duration: 3 minutes,
            endTime: startTime + duration,
            name:_name,
            yes:0,
            no:0
        });

        proposals.push(p3);


    }
    
    function vote(uint8 _proposal, uint32 index) public {
        // require(block.timestamp < proposals[index].endTime, "The voting has expired.");
        // require(!proposals[index].voted[msg.sender], "Everyone can only vote once");
        // require(studentERC20.balanceOf(msg.sender) > VOTE_PRICE, "Remain balance is not enough.");
        if(_proposal == 1) {
            // proposalY ++;
            proposals[index].yes ++;
        }
        else if(_proposal == 0) {
            proposals[index].no ++;
        }
        studentERC20.transfer(address(this), VOTE_PRICE);
        // emit Voted(msg.sender, _proposal);
    }

    function getYes(uint32 index) public view returns(uint256){
        return proposals[index].yes;
    }
     function getNo(uint32 index) public view returns(uint256){
        return proposals[index].no;
    }
    function getLengths() public view returns(uint256){
        return proposals.length;
    }

    function getProposals() public view returns(Proposal[] memory) {
        return proposals;
    }
    function getProposal(uint32 index) public view returns(Proposal memory) {
        return proposals[index];
    }


    function getERC20() public view returns(uint){
        return studentERC20.balanceOf(msg.sender);
    }

    function getPassReward(uint256 index) public{
        if(block.timestamp > proposals[index].endTime && proposals[index].yes > proposals[index].no)
        {
        studentERC20.transfer(msg.sender, PASS_REWARD);
        proposals[index].yes= 0;
        proposals[index].no = 0;
        
        }

    }
    // ...
    // TODO add any logic if you want
}