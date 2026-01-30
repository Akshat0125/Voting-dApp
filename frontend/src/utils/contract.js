import { ethers } from "ethers";
import VotingConfig from "../artifacts/Voting.json";

// You can hardcode the deployed address for local testing after deployment, 
// or pass it via import/env. For now we will use a placeholder or localhost address if known.
// When deploying to Sepolia, this logic should adapt.

export const getContract = async (contractAddress, runner) => {
    return new ethers.Contract(contractAddress, VotingConfig.abi, runner);
};

export const connectWallet = async () => {
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();

        return { provider, signer, address, chainId: network.chainId };
    } catch (error) {
        console.error("Wallet connection failed:", error);
        throw error;
    }
};
