import { ethers } from "hardhat";

async function main() {
  const ContractFactory = await ethers.getContractFactory("AssetMarketplace");
  const contract = await ContractFactory.deploy();
  await contract.waitForDeployment(); // Updated for Ethers v6
  console.log(`Contract deployed to: ${contract.target}`); // Updated property for contract address
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
