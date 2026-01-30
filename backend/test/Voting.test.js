const { expect } = require("chai");

describe("Voting Contract V2", function () {
    let Voting;
    let voting;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        Voting = await ethers.getContractFactory("Voting");
        voting = await Voting.deploy();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await voting.admin()).to.equal(owner.address);
        });
    });

    describe("Election Lifecycle", function () {
        it("Should allow admin to create an election (Status: Upcoming)", async function () {
            await voting.createElection("Class President", ["Alice", "Bob"], 60);
            const election = await voting.getElection(1);
            expect(election.name).to.equal("Class President");
            expect(election.isStarted).to.equal(false);
            expect(election.isEnded).to.equal(false);
            expect(election.exists).to.equal(true);
        });

        it("Should allow admin to start an election (Status: Active)", async function () {
            await voting.createElection("Test Election", ["Alice"], 60);

            await expect(voting.startElection(1))
                .to.emit(voting, "ElectionStarted");

            const election = await voting.getElection(1);
            expect(election.isStarted).to.equal(true);
            expect(election.startTime).to.be.gt(0);
        });

        it("Should allow admin to end an election (Status: Ended)", async function () {
            await voting.createElection("Test Election", ["Alice"], 60);
            await voting.startElection(1);

            await expect(voting.endElection(1))
                .to.emit(voting, "ElectionEnded");

            const election = await voting.getElection(1);
            expect(election.isEnded).to.equal(true);
        });
    });

    describe("Voting Rules", function () {
        beforeEach(async function () {
            await voting.createElection("Test Election", ["Alice", "Bob"], 60);
        });

        it("Should NOT allow voting if election is not started", async function () {
            await expect(
                voting.connect(addr1).vote(1, 0)
            ).to.be.revertedWith("Election has not started");
        });

        it("Should allow voting when Active", async function () {
            await voting.startElection(1);
            await voting.connect(addr1).vote(1, 0); // Vote for Alice

            const candidates = await voting.getCandidates(1);
            expect(candidates[0].voteCount).to.equal(1);
        });

        it("Should NOT allow voting if election is Ended", async function () {
            await voting.startElection(1);
            await voting.endElection(1);

            await expect(
                voting.connect(addr1).vote(1, 0)
            ).to.be.revertedWith("Election has ended");
        });

        it("Should prevent double voting", async function () {
            await voting.startElection(1);
            await voting.connect(addr1).vote(1, 0);

            await expect(
                voting.connect(addr1).vote(1, 0)
            ).to.be.revertedWith("You have already voted in this election");
        });
    });
});
