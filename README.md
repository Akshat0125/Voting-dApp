# 🗳️ DecentraVote – Decentralized Voting DApp

DecentraVote is a fully decentralized voting application built on blockchain technology to ensure transparency, security, and trust in digital elections. The platform eliminates centralized control and enforces fairness through smart contracts.

🔗 **Live Demo:** https://decentravote-green.vercel.app/  
💻 **Source Code:** https://github.com/Akshat0125/Voting-dApp.git  

---

## 📌 Problem Statement
Traditional voting systems suffer from centralized authority, limited transparency, vote manipulation risks, and weak auditability. DecentraVote addresses these challenges by using blockchain to create a trustless, verifiable, and tamper-proof voting system.

---

## 🎯 Project Objectives
1. Enable transparent and immutable voting  
2. Remove centralized election management  
3. Enforce one-wallet–one-vote participation  
4. Provide real-time election visibility  
5. Maintain fairness through strict role separation  

---

## ✨ Features

### 🔐 Authentication & Access
1. MetaMask-based wallet authentication  
2. Automatic Sepolia testnet validation  
3. On-chain role detection for users and admin  

### 🧑‍💼 Admin Capabilities
1. Create elections dynamically  
2. Add unlimited candidates per election  
3. Start and end voting sessions  
4. Monitor all elections through a dedicated dashboard  
5. Explicitly restricted from voting to preserve neutrality  

### 🧑‍🤝‍🧑 Voter Capabilities
1. View all active and upcoming elections  
2. Participate in voting with a single wallet  
3. Prevent multiple votes per election  
4. View live vote counts during active elections  
5. Access final results after voting concludes  

### ⚙️ System Guarantees
1. Immutable vote storage on the blockchain  
2. One-wallet–one-vote enforcement  
3. Fully decentralized logic with no centralized backend  
4. Transparent and auditable election lifecycle  

---

## 🛠️ Technology Stack
1. **Solidity (v0.8.x)** – Smart contract development  
2. **Hardhat (JavaScript)** – Contract compilation and deployment  
3. **Ethers.js** – Blockchain interaction layer  
4. **React + Vite** – Frontend framework  
5. **MetaMask** – Wallet connection and identity  
6. **Sepolia Testnet** – Cost-free testing environment  
7. **Vercel** – Frontend hosting and deployment  

---

## 🏗️ High-Level Architecture
1. Smart contracts manage elections, candidates, votes, and permissions  
2. Frontend interacts directly with the blockchain using ethers.js  
3. Admin and voter roles are enforced at the contract level  
4. UI updates dynamically based on on-chain state changes  

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)  
- MetaMask browser extension  
- Sepolia testnet ETH (from faucet)  

### Installation & Run
```bash
git clone https://github.com/Akshat0125/Voting-dApp.git
cd Voting-dApp
npm install
npm run dev
