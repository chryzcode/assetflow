import { ethers } from "hardhat";

async function main() {
  const ContractFactory = await ethers.getContractFactory("AssetMarketplace");
  const contract = await ContractFactory.deploy();
  await contract.waitForDeployment();

  const contractAddress = contract.target;
  console.log(`✅ Contract deployed...${contractAddress}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
