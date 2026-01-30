require("dotenv").config();

async function main() {
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.SEPOLIA_RPC_URL;

    console.log("\n--- DEBUGGING CONFIGURATION ---");

    // Check RPC URL
    if (!rpcUrl || rpcUrl.includes("YOUR_API_KEY")) {
        console.error("❌ SEPOLIA_RPC_URL is missing or default.");
    } else {
        console.log("✅ SEPOLIA_RPC_URL found (Starts with: " + rpcUrl.substring(0, 10) + "...)");
    }

    // Check Private Key
    if (!privateKey) {
        console.error("❌ PRIVATE_KEY is missing in .env");
    } else {
        console.log(`ℹ️  Private Key Length: ${privateKey.length} characters`);

        if (privateKey === "YOUR_PRIVATE_KEY") {
            console.error("❌ PRIVATE_KEY is still the default placeholder.");
        } else if (!privateKey.startsWith("0x")) {
            console.warn("⚠️  PRIVATE_KEY does not start with '0x'. Most errors require the '0x' prefix.");
        } else if (privateKey.length !== 66) { // 0x + 64 hex chars
            console.error(`❌ PRIVATE_KEY seems invalid. Expected 66 characters (including '0x'), got ${privateKey.length}.`);
        } else {
            console.log("✅ PRIVATE_KEY format looks correct (0x + 64 hex chars).");
        }
    }
    console.log("-------------------------------\n");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
