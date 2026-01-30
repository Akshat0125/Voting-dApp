const { expect } = require("chai");

describe("Voting Contract", function () {
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

    describe("Election Creation", function () {
        it("Should create an election successfully", async function () {
            const candidates = ["Alice", "Bob"];
            await voting.createElection("Class President", candidates, 60);

            const election = await voting.elections(1);
            expect(election.name).to.equal("Class President");
            expect(election.exists).to.equal(true);

            const savedCandidates = await voting.getCandidates(1);
            expect(savedCandidates.length).to.equal(2);
            expect(savedCandidates[0].name).to.equal("Alice");
        });

        it("Should emit ElectionCreated event", async function () {
            const candidates = ["Alice"];
            await expect(voting.createElection("Test", candidates, 10))
                .to.emit(voting, "ElectionCreated");
        });
    });

    describe("Voting", function () {
        beforeEach(async function () {
            await voting.createElection("Test Election", ["Alice", "Bob"], 60);
        });

        it("Should allow a user to vote", async function () {
            await voting.connect(addr1).vote(1, 0); // Vote for Alice (index 0)

            const candidates = await voting.getCandidates(1);
            expect(candidates[0].voteCount).to.equal(1);

            const hasVoted = await voting.hasVoted(1, addr1.address);
            expect(hasVoted).to.equal(true);
        });

        it("Should prevent double voting", async function () {
            await voting.connect(addr1).vote(1, 0);
            await expect(
                voting.connect(addr1).vote(1, 0)
            ).to.be.revertedWith("You have already voted in this election");
        });

        it("Should prevent voting for invalid candidate", async function () {
            await expect(
                voting.connect(addr1).vote(1, 5)
            ).to.be.revertedWith("Invalid candidate");
        });
    });
});
