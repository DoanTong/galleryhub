import React from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '../web3/constants';

const MintNFTButton = ({ metadataURI }) => {
  const mintNFT = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const tx = await contract.mintNFT(signer.address, metadataURI);
      await tx.wait();
      alert('NFT minted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to mint NFT');
    }
  };

  return (
    <button onClick={mintNFT} className="bg-green-600 text-white px-4 py-2 rounded">
      Mint as NFT
    </button>
  );
};

export default MintNFTButton;
