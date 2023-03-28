require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  //below is the config for the matic testnet
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
  },

  //below is the config for the apikey for etherscan, change respective to block explorer
  // etherscan : {
  //   apiKey: process.env.ETHERSCAN_API_KEY
  // },
  paths: {
    artifacts: "./src/artifacts",
  },
};
