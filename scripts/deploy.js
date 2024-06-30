// const hre = require("hardhat");

// async function main() {
//   // Get the Points smart contract
//   const Degen = await hre.ethers.getContractFactory("DegenToken");

//   // Deploy it
//   const degen = await Degen.deploy();
//   await degen.deployed();

//   // Display the contract address
//   console.log(`Degen token deployed to ${degen.address}`);
// }

// // Hardhat recommends this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// scripts/deploy.js

require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  // Get the deployer account
  const [deployer] = await ethers.getSigners();

  // Print the deployer's address
  console.log("Deploying contracts with the account:", deployer.address);

  // Print the deployer's balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "AVAX");

  // Deploy the contract
  const Module1 = await ethers.getContractFactory("DegenToken");
  const module1 = await Module1.deploy();
  await module1.deployed();

  console.log("Module1 contract deployed to:", module1.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
