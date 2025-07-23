const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RoleManager", function () {
  let roleManager;
  let owner, addr1;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    const RoleManager = await ethers.getContractFactory("RoleManager");
    roleManager = await RoleManager.deploy(owner.address);
    await roleManager.deployed();
  });

  it("should assign ADMIN_ROLE and DEFAULT_ADMIN_ROLE to superAdmin", async function () {
    const ADMIN_ROLE = await roleManager.ADMIN_ROLE();
    const DEFAULT_ADMIN_ROLE = await roleManager.DEFAULT_ADMIN_ROLE();

    expect(await roleManager.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
    expect(await roleManager.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
  });

  it("should allow admin to add an artist", async function () {
    await roleManager.connect(owner).addArtist(addr1.address);
    expect(await roleManager.isArtist(addr1.address)).to.be.true;
  });
});
