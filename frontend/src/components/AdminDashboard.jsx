import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ contract }) => {
    // Creation State
    const [electionName, setElectionName] = useState('');
    const [duration, setDuration] = useState(60); // minutes
    const [candidateName, setCandidateName] = useState('');
    const [candidates, setCandidates] = useState([]);

    // Management State
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Fetch elections for management
    useEffect(() => {
        const fetchElections = async () => {
            if (!contract) return;
            try {
                const allElections = await contract.getAllElections();
                setElections(allElections);
            } catch (error) {
                console.error("Error fetching elections:", error);
            }
        };
        fetchElections();
    }, [contract, refreshTrigger]);

    // Creation Logic
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
            alert("Election created successfully! Status: Upcoming");

            // Reset Form and Refresh List
            setElectionName('');
            setCandidates([]);
            setDuration(60);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error creating election:", error);
            alert("Failed to create election.");
        } finally {
            setLoading(false);
        }
    };

    // Management Logic
    const startElection = async (id) => {
        if (!confirm("Are you sure you want to START this election? Voters will be able to vote.")) return;
        try {
            setLoading(true);
            console.log(`Starting election ${id}...`);
            console.log("Contract instance:", contract);
            if (!contract.startElection) {
                throw new Error("startElection function not found on contract object. Check ABI.");
            }
            const tx = await contract.startElection(id);
            console.log("Transaction sent:", tx.hash);
            await tx.wait();
            console.log("Transaction confirmed");
            alert("Election Started!");
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Detailed Error starting election:", error);

            let errorMessage = "Error starting election";
            if (error.reason) {
                errorMessage += ": " + error.reason;
            } else if (error.data && error.data.message) {
                errorMessage += ": " + error.data.message;
            } else if (error.message) {
                errorMessage += ": " + error.message;
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const endElection = async (id) => {
        if (!confirm("Are you sure you want to END this election? No more votes will be accepted.")) return;
        try {
            setLoading(true);
            const tx = await contract.endElection(id);
            await tx.wait();
            alert("Election Ended!");
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error(error);
            alert("Error ending election");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* 1. Create Election Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2">Create New Election</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>

                    <div className="space-y-4">
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
                            <div className="bg-gray-700 p-3 rounded max-h-40 overflow-y-auto">
                                <ul className="space-y-2">
                                    {candidates.map((cand, index) => (
                                        <li key={index} className="flex justify-between items-center bg-gray-600 p-2 rounded">
                                            <span className="text-white">{cand}</span>
                                            <button
                                                onClick={() => removeCandidate(index)}
                                                className="text-red-400 hover:text-red-300 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={createElection}
                    disabled={loading}
                    className="w-full py-3 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition"
                >
                    {loading ? 'Processing...' : 'Create Election'}
                </button>
            </div>

            {/* 2. Manage Elections Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2">Manage Elections</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                        <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {elections.map((election) => {
                                const id = Number(election.id);
                                let status = "Unknown";
                                let color = "text-gray-400";

                                // Handling Struct Boolean Logic
                                if (election.isEnded) {
                                    status = "Ended";
                                    color = "text-red-400";
                                } else if (election.isStarted) {
                                    status = "Active";
                                    color = "text-green-400";
                                } else {
                                    status = "Upcoming";
                                    color = "text-yellow-400";
                                }

                                return (
                                    <tr key={id} className="border-b border-gray-700 hover:bg-gray-750">
                                        <td className="px-6 py-4">{id}</td>
                                        <td className="px-6 py-4 font-medium text-white">{election.name}</td>
                                        <td className={`px-6 py-4 font-bold ${color}`}>
                                            {status}
                                        </td>
                                        <td className="px-6 py-4 space-x-2">
                                            {status === "Upcoming" && (
                                                <button
                                                    onClick={() => startElection(id)}
                                                    disabled={loading}
                                                    className="px-3 py-1 bg-green-900 text-green-200 rounded hover:bg-green-800 text-sm disabled:opacity-50"
                                                >
                                                    Start
                                                </button>
                                            )}
                                            {status === "Active" && (
                                                <button
                                                    onClick={() => endElection(id)}
                                                    disabled={loading}
                                                    className="px-3 py-1 bg-red-900 text-red-200 rounded hover:bg-red-800 text-sm disabled:opacity-50"
                                                >
                                                    End
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {elections.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-gray-500">No elections found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
