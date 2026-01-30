// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Election {
        uint id;
        string name;
        uint startTime;
        uint endTime;
        bool exists;
    }

    address public admin;
    uint public electionCount;

    // electionId => Election
    mapping(uint => Election) public elections;
    // electionId => list of Candidates
    mapping(uint => Candidate[]) public candidates;
    // electionId => voterAddress => hasVoted
    mapping(uint => mapping(address => bool)) public hasVoted;

    event ElectionCreated(uint id, string name, uint startTime, uint endTime);
    event VoteCast(uint electionId, uint candidateId, address voter);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createElection(string memory _name, string[] memory _candidateNames, uint _durationMinutes) public onlyAdmin {
        electionCount++;
        uint electionId = electionCount;

        elections[electionId] = Election({
            id: electionId,
            name: _name,
            startTime: block.timestamp,
            endTime: block.timestamp + (_durationMinutes * 1 minutes),
            exists: true
        });

        for (uint i = 0; i < _candidateNames.length; i++) {
            candidates[electionId].push(Candidate({
                id: i,
                name: _candidateNames[i],
                voteCount: 0
            }));
        }

        emit ElectionCreated(electionId, _name, block.timestamp, block.timestamp + (_durationMinutes * 1 minutes));
    }

    function vote(uint _electionId, uint _candidateId) public {
        require(elections[_electionId].exists, "Election does not exist");
        require(block.timestamp >= elections[_electionId].startTime, "Voting has not started");
        require(block.timestamp <= elections[_electionId].endTime, "Voting has ended");
        require(!hasVoted[_electionId][msg.sender], "You have already voted in this election");
        require(_candidateId < candidates[_electionId].length, "Invalid candidate");

        candidates[_electionId][_candidateId].voteCount++;
        hasVoted[_electionId][msg.sender] = true;

        emit VoteCast(_electionId, _candidateId, msg.sender);
    }

    function getCandidates(uint _electionId) public view returns (Candidate[] memory) {
        return candidates[_electionId];
    }

    function getElection(uint _electionId) public view returns (Election memory) {
        return elections[_electionId];
    }
    
    function getAllElections() public view returns (Election[] memory) {
        Election[] memory allElections = new Election[](electionCount);
        for (uint i = 1; i <= electionCount; i++) {
            allElections[i - 1] = elections[i];
        }
        return allElections;
    }
}
