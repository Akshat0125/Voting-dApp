require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const { task } = require("hardhat/config");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.28",
    networks: {
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL || "",
            accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== "YOUR_PRIVATE_KEY") ? [process.env.PRIVATE_KEY] : [],
        },
        localhost: {
            url: "http://127.0.0.1:8545",
        },
    },
};

// Subtask for verification (runs on every task)
task("check-env", "Checks env vars", async () => {
    if (hre.network.name === 'sepolia') {
        if (!process.env.SEPOLIA_RPC_URL || process.env.SEPOLIA_RPC_URL.includes("YOUR_API_KEY")) {
            throw new Error("❌ SEPOLIA_RPC_URL is missing or invalid in backend/.env");
        }
        if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY.includes("YOUR_PRIVATE_KEY")) {
            throw new Error("❌ PRIVATE_KEY is missing or invalid in backend/.env");
        }
    }
});
