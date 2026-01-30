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
        uint duration;    // Duration in minutes
        uint startTime;   // Set when admin clicks "Start"
        uint endTime;     // Calculated when started
        bool exists;
        bool isStarted;
        bool isEnded;
    }

    address public admin;
    uint public electionCount;

    // electionId => Election
    mapping(uint => Election) public elections;
    // electionId => list of Candidates
    mapping(uint => Candidate[]) public candidates;
    // electionId => voterAddress => hasVoted
    mapping(uint => mapping(address => bool)) public hasVoted;

    event ElectionCreated(uint id, string name, uint duration);
    event ElectionStarted(uint id, uint startTime, uint endTime);
    event ElectionEnded(uint id, uint endTime);
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
            duration: _durationMinutes,
            startTime: 0,
            endTime: 0,
            exists: true,
            isStarted: false,
            isEnded: false
        });

        for (uint i = 0; i < _candidateNames.length; i++) {
            candidates[electionId].push(Candidate({
                id: i,
                name: _candidateNames[i],
                voteCount: 0
            }));
        }

        emit ElectionCreated(electionId, _name, _durationMinutes);
    }

    function startElection(uint _electionId) public onlyAdmin {
        Election storage election = elections[_electionId];
        require(election.exists, "Election does not exist");
        require(!election.isStarted, "Election already started");
        require(!election.isEnded, "Election already ended");

        election.isStarted = true;
        election.startTime = block.timestamp;
        election.endTime = block.timestamp + (election.duration * 1 minutes);

        emit ElectionStarted(_electionId, election.startTime, election.endTime);
    }

    function endElection(uint _electionId) public onlyAdmin {
        Election storage election = elections[_electionId];
        require(election.exists, "Election does not exist");
        require(election.isStarted, "Election hasn't started yet");
        require(!election.isEnded, "Election already ended");

        election.isEnded = true;
        election.endTime = block.timestamp; // End strictly now

        emit ElectionEnded(_electionId, block.timestamp);
    }

    function vote(uint _electionId, uint _candidateId) public {
        Election storage election = elections[_electionId];
        require(election.exists, "Election does not exist");
        require(election.isStarted, "Election has not started");
        require(!election.isEnded, "Election has ended");
        require(block.timestamp <= election.endTime, "Election time expired");
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
