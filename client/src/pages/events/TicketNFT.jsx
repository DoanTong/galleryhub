import React from 'react';
import { mintNFT } from '../../services/nft';

const TicketNFT = ({ metadataURI }) => {
  const handleMint = async () => {
    try {
      await mintNFT(metadataURI);
      alert('Ticket NFT minted!');
    } catch (err) {
      alert('Mint failed');
    }
  };

  return (
    <button onClick={handleMint} className="bg-purple-600 text-white px-4 py-2 rounded">
      Get Ticket NFT
    </button>
  );
};

export default TicketNFT;
