const { ethers } = require("hardhat");
// imports the ethers module from the Hardhat library,

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const PROBINAR = await ethers.getContractFactory("PROBINAR");
  const probinar = await PROBINAR.deploy(deployer.address);

  console.log("PROBINAR address:", probinar.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
      console.error(error);
      process.exit(1);
  });
