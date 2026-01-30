// Environment Variable for Production, fallback to Localhost for dev
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

import React, { useState, useEffect } from 'react';
import { connectWallet, getContract } from './utils/contract';
import AdminDashboard from './components/AdminDashboard';
import VotingInterface from './components/VotingInterface';
import LandingPage from './components/LandingPage';
import AboutModal from './components/AboutModal';

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const [networkName, setNetworkName] = useState("");

  // Auto-reconnect if previously connected (optional, but good UX)
  // For now, let's keep it manual as requested by standard flow

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const { signer, address, provider } = await connectWallet();
      setCurrentAccount(address);

      const contractInstance = await getContract(CONTRACT_ADDRESS, signer);
      setContract(contractInstance);
      console.log("Contract initialized:", contractInstance);

      // Get Network Name
      const network = await provider.getNetwork();
      setNetworkName(network.name === 'unknown' ? `Chain ID: ${network.chainId}` : network.name);

      // Check if admin
      try {
        const adminAddress = await contractInstance.admin();
        if (address.toLowerCase() === adminAddress.toLowerCase()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Failed to check admin status", err);
        setIsAdmin(false); // Default to voter
      }

    } catch (err) {
      console.error(err);
      alert("Failed to connect wallet: " + (err.reason || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        // Reloading is the safest way to ensure all state checks (admin, etc) are re-run cleanly
        window.location.reload();
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => { });
        window.ethereum.removeListener('chainChanged', () => { });
      }
    };
  }, []);

  // Logic to determine which Main View to render
  const renderContent = () => {
    // 1. Not Connected -> Landing Page
    if (!currentAccount) {
      return <LandingPage onConnect={handleConnect} isLoading={isLoading} />;
    }

    // 2. Connected & Admin -> Admin Dashboard
    if (isAdmin) {
      return <AdminDashboard contract={contract} />;
    }

    // 3. Connected & User -> Voting Interface
    return <VotingInterface contract={contract} account={currentAccount} />;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo - click resets to home/landing only if not connected, else static */}
            <div className="flex items-center cursor-pointer" onClick={() => !currentAccount && window.location.reload()}>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                DecentraVote
              </span>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setShowAbout(true)}
                className="text-gray-400 hover:text-white transition text-sm font-medium"
              >
                About
              </button>

              {currentAccount ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block px-3 py-1 bg-gray-800 rounded-full border border-gray-700 text-sm font-mono text-gray-300">
                    {networkName && <span className="text-yellow-500 mr-2">● {networkName}</span>}
                    {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                  </div>
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      ADMIN
                    </span>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
}

export default App;
