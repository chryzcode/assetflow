import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-network-helpers";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

// Ensure required environment variables are present
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

if (!PRIVATE_KEY) {
  throw new Error("❌ WALLET_PRIVATE_KEY is missing from .env.local");
}
if (!INFURA_PROJECT_ID) {
  throw new Error("❌ NEXT_PUBLIC_INFURA_PROJECT_ID is missing from .env.local");
}
if (!ETHERSCAN_API_KEY) {
  throw new Error("❌ ETHERSCAN_API_KEY is missing from .env.local");
}

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [PRIVATE_KEY],
      chainId: 11155111, // Explicitly specify Sepolia chain ID
      gasPrice: 15000000000, // Optional: Set reasonable gas price
      gas: "auto" // Optional: Enable auto gas adjustment
    }
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY // Specify API key for Sepolia specifically
    }
  }
};

export default config;