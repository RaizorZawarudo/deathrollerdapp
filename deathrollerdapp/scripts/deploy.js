// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const chainId = hre.network.chainId

async function main() {

  const Deathroller = await hre.ethers.getContractFactory("DeathRoller");
  const deathroller = await Deathroller.deploy();

  deployedDR = await deathroller.deployed();
  // console.log(deployedDR);

  console.log(`DeathRoller MATIC and unlock timestamp ${deployedDR.address} and owner is ${deployedDR.signer.address}`);
  //below is the verification function if your deploy on a testnet
  //await sleep(45 * 1000);
  // await hre.run("verify:verify", {
  //   address: deployedDR.address,
  //   constructorArguments: [],
  // });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
