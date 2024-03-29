require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const PRIVATE_KEY = "309a4ce128542c425c47825b6df6e912befb8eb26341c6a09c62237872e9ada6"

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  defaultNetwork: "testnet",
  networks: {
    hardhat: {},
    testnet: {
      url: "https://testnet-rpc.ultraproscan.io/",
      chainId: 606626,
      gasPrice: 20000000000,
      accounts: [PRIVATE_KEY],
    },
  },
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};
