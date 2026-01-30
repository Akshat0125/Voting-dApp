import React from 'react';

const LandingPage = ({ onConnect, isConnected }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="max-w-3xl space-y-8">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                    <span className="block text-white mb-2">Secure & Transparent</span>
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        Decentralized Voting
                    </span>
                </h1>

                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Empower your community with tamper-proof elections using Blockchain technology.
                    Create elections, cast votes, and view real-time results instantly.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    {/* Button Area */}
                    {!isConnected && (
                        <button
                            onClick={onConnect}
                            className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-200 transition shadow-xl"
                        >
                            Get Started
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-left">
                    <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm hover:border-blue-500/50 transition">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 shrink-0">
                            <span className="text-2xl">🔒</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Secure</h3>
                        <p className="text-gray-400">Powered by Ethereum smart contracts, ensuring every vote is immutable and verifiable.</p>
                    </div>
                    <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm hover:border-purple-500/50 transition">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 shrink-0">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Instant</h3>
                        <p className="text-gray-400">Real-time tallying of results. No waiting periods, immediate transparency.</p>
                    </div>
                    <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm hover:border-pink-500/50 transition">
                        <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 shrink-0">
                            <span className="text-2xl">🌍</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Accessible</h3>
                        <p className="text-gray-400">Vote from anywhere in the world using your crypto wallet. Permissionless and open.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
