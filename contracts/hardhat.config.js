require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // RPC URL từ Infura hoặc Alchemy
      accounts: [process.env.PRIVATE_KEY] // Tạo private key từ Metamask
    }
  }
};
  