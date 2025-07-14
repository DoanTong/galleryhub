import { ethers } from 'ethers';
import { contractAddress, contractABI } from '../web3/constants';

export const mintNFT = async (metadataURI) => {
  if (!window.ethereum) throw new Error('MetaMask not installed');
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  const tx = await contract.mintNFT(signer.address, metadataURI);
  return await tx.wait();
};
