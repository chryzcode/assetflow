import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("🚀 Deploying AssetMarketplace contract...");
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);
  console.log(`👤 Deployer address: ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${ethers.formatEther(balance)} ETH`);

  const ContractFactory = await ethers.getContractFactory("AssetMarketplace");
  const contract = await ContractFactory.deploy();
  await contract.waitForDeployment();

  const contractAddress = contract.target;
  console.log(`\n✅ Contract deployed successfully!`);
  console.log(`📍 Contract address: ${contractAddress}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Update NEXT_PUBLIC_CONTRACT_ADDRESS in your .env.local file`);
  console.log(`   2. Set NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  
  // Initialize the contract if it has an initialize function
  try {
    const tx = await contract.initialize();
    await tx.wait();
    console.log(`   3. Contract initialized successfully`);
  } catch (error: any) {
    if (error.message?.includes("already initialized") || error.message?.includes("Initializable: contract is already initialized")) {
      console.log(`   3. Contract already initialized`);
    } else {
      console.log(`   ⚠️  Note: Could not initialize contract (may already be initialized)`);
    }
  }
}

main().catch(error => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
