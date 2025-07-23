require("hardhat-deploy");
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");


module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // account index 0
    },
  },
  solidity: "0.8.21",
};
