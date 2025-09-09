const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("🚀 Deploying contracts with account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");

  // Deploy GalleryNFT
  const GalleryNFT = await ethers.getContractFactory("GalleryNFT");
  const galleryNFT = await GalleryNFT.deploy();
  await galleryNFT.deployed();
  console.log("🎨 GalleryNFT deployed to:", galleryNFT.address);

  // Deploy GalleryBuy
  const GalleryBuy = await ethers.getContractFactory("GalleryBuy");
  const galleryBuy = await GalleryBuy.deploy();
  await galleryBuy.deployed();
  console.log("🛒 GalleryBuy deployed to:", galleryBuy.address);

  // Ví dụ parseUnits (demo để bạn thấy dùng ethers utils)
  const amount = ethers.utils.parseUnits("1000", 18);
  console.log("Parsed amount (1000 tokens, 18 decimals):", amount.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
