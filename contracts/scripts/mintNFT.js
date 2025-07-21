const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const galleryNFT = await ethers.getContract("GalleryNFT");

  const to = deployer.address;
  const tokenURI = "ipfs://your-ipfs-hash-of-metadata";

  const tx = await galleryNFT.mint(to, tokenURI);
  const receipt = await tx.wait();

  const tokenId = receipt.events?.find((e) => e.event === "Transfer")?.args.tokenId;
  console.log(`✅ Minted NFT with tokenId: ${tokenId.toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
