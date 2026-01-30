import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { connectWallet, getContract } from './utils/contract';
import AdminDashboard from './components/AdminDashboard';
import VotingInterface from './components/VotingInterface';
import LandingPage from './components/LandingPage';

// Environment Variable for Production, fallback to Localhost for dev
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState('landing'); // landing, admin, voter

  const handleConnect = async () => {
    try {
      const { signer, address } = await connectWallet();
      setCurrentAccount(address);

      const contractInstance = await getContract(CONTRACT_ADDRESS, signer);
      setContract(contractInstance);

      // Check if admin
      try {
        const adminAddress = await contractInstance.admin();
        if (address.toLowerCase() === adminAddress.toLowerCase()) {
          setIsAdmin(true);
          setView('admin');
        } else {
          setView('voter');
        }
      } catch (err) {
        console.error("Failed to check admin status", err);
        setView('voter'); // Default to voter if check fails or not admin
      }

    } catch (err) {
      alert("Failed to connect wallet: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setView('landing')}>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                DecentraVote
              </span>
            </div>

            <div className="flex items-center gap-4">
              {currentAccount ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block px-3 py-1 bg-gray-800 rounded-full border border-gray-700 text-sm font-mono text-gray-300">
                    {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => setView('admin')}
                      className={`text-sm font-medium hover:text-blue-400 transition ${view === 'admin' ? 'text-blue-400' : 'text-gray-400'}`}
                    >
                      Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => setView('voter')}
                    className={`text-sm font-medium hover:text-blue-400 transition ${view === 'voter' ? 'text-blue-400' : 'text-gray-400'}`}
                  >
                    Vote
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnect}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition shadow-lg shadow-blue-500/20"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="p-4 sm:p-6 lg:p-8">
        {view === 'landing' && <LandingPage onConnect={handleConnect} isConnected={!!currentAccount} />}
        {view === 'admin' && currentAccount && <AdminDashboard contract={contract} />}
        {view === 'voter' && currentAccount && <VotingInterface contract={contract} account={currentAccount} />}
      </main>
    </div>
  );
}

export default App;
