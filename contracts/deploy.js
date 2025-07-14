async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance));

  const GalleryNFT = await ethers.getContractFactory("GalleryNFT");
  const galleryNFT = await GalleryNFT.deploy();
  console.log("GalleryNFT deployed to:", galleryNFT.address);

  // Ví dụ nếu bạn muốn parseUnits:
  const amount = ethers.utils.parseUnits("1000", 18);
  console.log("Parsed amount:", amount.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
