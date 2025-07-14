import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '../web3/constants';

const CertificateViewer = ({ tokenId }) => {
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    const fetchOwner = async () => {
      const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      try {
        const ownerAddress = await contract.ownerOf(tokenId);
        setOwner(ownerAddress);
      } catch (err) {
        console.error(err);
        setOwner('Not Found');
      }
    };
    fetchOwner();
  }, [tokenId]);

  return (
    <div className="p-4 border rounded">
      <p className="font-bold">NFT Certificate</p>
      <p>Token ID: {tokenId}</p>
      <p>Owner: {owner}</p>
    </div>
  );
};

export default CertificateViewer;