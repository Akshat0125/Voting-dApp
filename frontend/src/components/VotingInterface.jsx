import React, { useEffect, useState } from 'react';

const VotingInterface = ({ contract, account }) => {
    const [elections, setElections] = useState([]);
    const [candidates, setCandidates] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [filter, setFilter] = useState('active'); // active, upcoming, ended

    const fetchElections = async () => {
        if (!contract) return;
        try {
            const allElections = await contract.getAllElections();
            setElections(allElections);
        } catch (error) {
            console.error("Error fetching elections:", error);
        }
    };

    const fetchCandidates = async (electionId) => {
        if (!contract) return;
        try {
            const cands = await contract.getCandidates(electionId);
            setCandidates(prev => ({ ...prev, [electionId]: cands }));
        } catch (error) {
            console.error(`Error fetching candidates for ${electionId}:`, error);
        }
    };

    useEffect(() => {
        fetchElections();
        // Set up event listener for updates (simplified polling for now by dependancy array)
    }, [contract]);

    const handleVote = async (electionId) => {
        if (selectedCandidate === null) return;
        try {
            setLoading(true);
            const tx = await contract.vote(electionId, selectedCandidate);
            await tx.wait();
            alert("Vote cast successfully!");
            fetchCandidates(electionId); // Refresh results directly
            setSelectedCandidate(null);
        } catch (error) {
            console.error("Voting error:", error);
            // Parse error message for clarity
            let msg = "Error casting vote.";
            if (error.message.includes("Already voted")) msg = "You have already voted in this election.";
            if (error.message.includes("Election has ended")) msg = "Voting has ended.";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredElections = elections.filter(election => {
        if (filter === 'active') return election.isStarted && !election.isEnded;
        if (filter === 'upcoming') return !election.isStarted && !election.isEnded;
        if (filter === 'ended') return election.isEnded;
        return false;
    });

    return (
        <div className="max-w-5xl mx-auto mt-6 px-4">

            {/* Filter Tabs */}
            <div className="flex justify-center mb-8 border-b border-gray-700">
                <button
                    onClick={() => setFilter('active')}
                    className={`px-6 py-3 font-medium text-lg border-b-2 transition ${filter === 'active' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Active
                </button>
                <button
                    onClick={() => setFilter('upcoming')}
                    className={`px-6 py-3 font-medium text-lg border-b-2 transition ${filter === 'upcoming' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setFilter('ended')}
                    className={`px-6 py-3 font-medium text-lg border-b-2 transition ${filter === 'ended' ? 'border-red-500 text-red-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Ended
                </button>
            </div>

            {filteredElections.length === 0 ? (
                <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700/50">
                    <p className="text-gray-400 text-lg">No {filter} elections found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredElections.map((election) => {
                        const electionId = Number(election.id);

                        return (
                            <div key={electionId} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col hover:border-gray-600 transition">
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-white">{election.name}</h3>
                                        {/* Status Badge */}
                                        {filter === 'active' && <span className="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded border border-green-700 animate-pulse">● Live</span>}
                                        {filter === 'upcoming' && <span className="px-2 py-1 bg-yellow-900/50 text-yellow-300 text-xs rounded border border-yellow-700">Waiting to Start</span>}
                                        {filter === 'ended' && <span className="px-2 py-1 bg-red-900/50 text-red-300 text-xs rounded border border-red-700">Final Results</span>}
                                    </div>

                                    {!candidates[electionId] ? (
                                        <button
                                            onClick={() => fetchCandidates(electionId)}
                                            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition"
                                        >
                                            View Candidates / Results
                                        </button>
                                    ) : (
                                        <div className="space-y-3 mt-4">
                                            {candidates[electionId].map((cand) => (
                                                <div
                                                    key={Number(cand.id)}
                                                    onClick={() => filter === 'active' && setSelectedCandidate(Number(cand.id))}
                                                    className={`p-3 rounded-lg border transition flex justify-between items-center ${selectedCandidate === Number(cand.id) && filter === 'active'
                                                            ? 'bg-blue-600/20 border-blue-500' // Selected
                                                            : filter === 'active'
                                                                ? 'bg-gray-700 border-gray-600 cursor-pointer hover:bg-gray-600' // Active option
                                                                : 'bg-gray-700/50 border-gray-700' // Read-only
                                                        }`}
                                                >
                                                    <span className="text-white font-medium">{cand.name}</span>
                                                    {/* Always show votes for transparency */}
                                                    <span className="text-sm px-2 py-0.5 bg-gray-900 rounded text-gray-400 font-mono">
                                                        {Number(cand.voteCount)} votes
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {candidates[electionId] && filter === 'active' && (
                                    <div className="p-4 bg-gray-750 border-t border-gray-700">
                                        <button
                                            onClick={() => handleVote(electionId)}
                                            disabled={loading || selectedCandidate === null}
                                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:-translate-y-0.5"
                                        >
                                            {loading ? 'Confirming...' : 'Vote Now'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default VotingInterface;
