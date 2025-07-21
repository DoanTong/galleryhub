const { ethers } = require("hardhat");

async function main() {
  const [admin] = await ethers.getSigners();
  const roleManager = await ethers.getContract("RoleManager");

  const artistRole = await roleManager.ARTIST_ROLE();
  const targetUser = "0xArtistAddress...";

  const tx = await roleManager.connect(admin).grantRole(artistRole, targetUser);
  await tx.wait();

  console.log(`✅ Assigned ARTIST_ROLE to ${targetUser}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
