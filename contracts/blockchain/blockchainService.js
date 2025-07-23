import { ethers } from "ethers";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

function loadContract(contractName) {
  const contractPath = path.join("contracts", "deployments", "sepolia", `${contractName}.json`);
  const { abi, address } = JSON.parse(fs.readFileSync(contractPath, "utf8"));
  return new ethers.Contract(address, abi, wallet);
}

// GalleryNFT (ERC-721)
const galleryNFT = loadContract("GalleryNFT");
export async function mintNFT(to, tokenURI) {
  try {
    const tx = await galleryNFT.mint(to, tokenURI);
    const receipt = await tx.wait();
    return { success: true, txHash: receipt.hash };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getNFTOwner(tokenId) {
  try {
    const owner = await galleryNFT.ownerOf(tokenId);
    return { success: true, owner };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// GalleryToken (ERC-20)
const galleryToken = loadContract("GalleryToken");
export async function airdropToken(to, amount) {
  try {
    const tx = await galleryToken.transfer(to, amount);
    const receipt = await tx.wait();
    return { success: true, txHash: receipt.hash };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// RoleManager (Access Control)
const roleManager = loadContract("RoleManager");
export async function assignRole(userAddress, role) {
  try {
    const tx = await roleManager.assignRole(userAddress, role);
    const receipt = await tx.wait();
    return { success: true, txHash: receipt.hash };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getUserRole(userAddress) {
  try {
    const role = await roleManager.getRole(userAddress);
    return { success: true, role };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
