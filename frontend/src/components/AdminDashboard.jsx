import React, { useState } from 'react';
import { ethers } from 'ethers';

const AdminDashboard = ({ contract }) => {
    const [electionName, setElectionName] = useState('');
    const [duration, setDuration] = useState(60); // minutes
    const [candidateName, setCandidateName] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);

    const addCandidate = () => {
        if (!candidateName) return;
        setCandidates([...candidates, candidateName]);
        setCandidateName('');
    };

    const removeCandidate = (index) => {
        const newCandidates = [...candidates];
        newCandidates.splice(index, 1);
        setCandidates(newCandidates);
    };

    const createElection = async () => {
        if (!contract) return;
        if (!electionName || candidates.length < 2) {
            alert("Please provide election name and at least 2 candidates.");
            return;
        }

        try {
            setLoading(true);
            const tx = await contract.createElection(electionName, candidates, duration);
            await tx.wait();
            alert("Election created successfully!");
            setElectionName('');
            setCandidates([]);
            setDuration(60);
        } catch (error) {
            console.error("Error creating election:", error);
            alert("Failed to create election. See console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-gray-300 mb-2">Election Name</label>
                    <input
                        type="text"
                        value={electionName}
                        onChange={(e) => setElectionName(e.target.value)}
                        className="w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Class President"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 mb-2">Duration (Minutes)</label>
                    <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 mb-2">Add Candidates</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            className="flex-1 p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Candidate Name"
                        />
                        <button
                            onClick={addCandidate}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded transition font-medium"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {candidates.length > 0 && (
                    <div className="bg-gray-700 p-4 rounded mt-2">
                        <h4 className="text-gray-300 mb-2 text-sm uppercase tracking-wider">Candidates List</h4>
                        <ul className="space-y-2">
                            {candidates.map((cand, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-600 p-2 rounded">
                                    <span className="text-white">{cand}</span>
                                    <button
                                        onClick={() => removeCandidate(index)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    onClick={createElection}
                    disabled={loading}
                    className="w-full py-4 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition transform hover:-translate-y-0.5"
                >
                    {loading ? 'Creating Election...' : 'Create Election'}
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
