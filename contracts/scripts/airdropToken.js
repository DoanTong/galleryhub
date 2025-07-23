const { ethers } = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();
  const artxToken = await ethers.getContract("ARTXToken");

  const recipients = [
    "0xAddress1...",
    "0xAddress2..."
  ];
  const amount = ethers.utils.parseUnits("100", 18);

  for (const recipient of recipients) {
    const tx = await artxToken.transfer(recipient, amount);
    await tx.wait();
    console.log(`✅ Airdropped 100 ARTX to ${recipient}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
