import React, { useEffect, useState } from 'react';

const VotingInterface = ({ contract, account }) => {
    const [elections, setElections] = useState([]);
    const [candidates, setCandidates] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const fetchElections = async () => {
        if (!contract) return;
        try {
            const allElections = await contract.getAllElections();
            // Filter inactive if needed, or show all. Ethers returns Proxy/Result objects, need manual mapping sometimes or structured access
            // Solidity returns struct array.
            const formattedElections = [];

            // Loop over array properties if not iterable directly
            for (let i = 0; i < allElections.length; i++) {
                formattedElections.push(allElections[i]);
            }
            setElections(formattedElections);
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
    }, [contract]);

    const handleVote = async (electionId) => {
        if (selectedCandidate === null) return;
        try {
            setLoading(true);
            const tx = await contract.vote(electionId, selectedCandidate);
            await tx.wait();
            alert("Vote cast successfully!");
            fetchCandidates(electionId); // Refresh results
            setSelectedCandidate(null);
        } catch (error) {
            console.error("Voting error:", error);
            alert("Error casting vote (Already voted or election closed?)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 px-4">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Active Elections</h2>

            {elections.length === 0 ? (
                <p className="text-center text-gray-400">No elections found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {elections.map((election) => {
                        const electionId = Number(election.id);
                        const isExpired = Date.now() / 1000 > Number(election.endTime);

                        return (
                            <div key={electionId} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col">
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-blue-400">{election.name}</h3>
                                        <span className={`px-2 py-1 text-xs rounded ${isExpired ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                                            {isExpired ? 'Ended' : 'Active'}
                                        </span>
                                    </div>

                                    {!candidates[electionId] ? (
                                        <button
                                            onClick={() => fetchCandidates(electionId)}
                                            className="text-sm text-blue-300 underline"
                                        >
                                            Load Candidates
                                        </button>
                                    ) : (
                                        <div className="space-y-3 mt-4">
                                            {candidates[electionId].map((cand) => (
                                                <div
                                                    key={Number(cand.id)}
                                                    onClick={() => !isExpired && setSelectedCandidate(Number(cand.id))}
                                                    className={`p-3 rounded-lg border cursor-pointer transition ${selectedCandidate === Number(cand.id)
                                                            ? 'bg-blue-600 border-blue-400'
                                                            : 'bg-gray-700 border-gray-600 hover:bg-gray-650'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-white font-medium">{cand.name}</span>
                                                        <span className="text-sm text-gray-400">{Number(cand.voteCount)} votes</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {candidates[electionId] && !isExpired && (
                                    <div className="p-4 bg-gray-750 border-t border-gray-700">
                                        <button
                                            onClick={() => handleVote(electionId)}
                                            disabled={loading || selectedCandidate === null}
                                            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Confirming...' : 'Vote'}
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
