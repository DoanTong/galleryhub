import React from 'react';
import CertificateViewer from '../../components/CertificateViewer';

const RewardNFTPage = ({ tokenId }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Reward NFT</h1>
      <CertificateViewer tokenId={tokenId} />
    </div>
  );
};

export default RewardNFTPage;
