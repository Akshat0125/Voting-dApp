# Decentralized Voting DApp

A secure, decentralized voting application built with Solidity, Hardhat, React, and Ethers.js.

## Features
- **Admin Dashboard**: Create elections, add dynamic candidates, set duration.
- **Voter Interface**: View active elections, cast secure votes.
- **Real-time Results**: Live vote count updates.
- **MetaMask Integration**: Connect wallet to interact.
- **Responsive Design**: Modern UI with Tailwind CSS.

## Prerequisites
- Node.js (v18+)
- MetaMask Browser Extension

## Setup Instructions

### 1. Backend Setup (Blockchain)
Open a terminal in the project root:
```bash
cd backend
npm install
```

Start the local Hardhat Node (runs a local blockchain):
```bash
npx hardhat node
```
*Keep this terminal open.*

Open a **second terminal**:
```bash
cd backend
# Deploy the smart contract to the local network
npx hardhat run scripts/deploy.js --network localhost
```
**Note the deployed address** (e.g. `0x5FbDB...`). If it is different from `0x5FbDB2315678afecb367f032d93F642f64180aa3`, update `frontend/src/App.jsx` with the new address.

### 2. Frontend Setup (UI)
Open a **third terminal**:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## How to Use
1. **Connect Wallet**: Click "Connect Wallet" (Connect Localhost Account #0 from Hardhat node metadata).
2. **Admin Mode**: Since you deployed with Account #0, you are the Admin.
   - Go to **Dashboard**.
   - Create an Election (e.g. "Community Lead").
   - Add candidates (e.g. "Alice", "Bob") and click **Create**.
3. **Voting**:
   - Switch MetaMask account to Account #1 (import private key from Hardhat node log).
   - Go to **Vote**.
   - Select a candidate and vote.
   - See results update!

## Testing
Run smart contract tests:
```bash
cd backend
npx hardhat test
```
