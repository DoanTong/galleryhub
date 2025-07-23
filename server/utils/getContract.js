const { ethers } = require('ethers');
const nftAbi = require('../abi/GalleryNFT.json');
const tokenAbi = require('../abi/GalleryToken.json');

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

function getNFTContract() {
  return new ethers.Contract(process.env.NFT_CONTRACT_ADDRESS, nftAbi, signer);
}

function getTokenContract() {
  return new ethers.Contract(process.env.TOKEN_CONTRACT_ADDRESS, tokenAbi, signer);
}

module.exports = {
  getNFTContract,
  getTokenContract,
  signer
};
