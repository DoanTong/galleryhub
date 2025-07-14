import React, { useState } from 'react';
import UploadArtwork from '../components/UploadArtwork';
import MintNFTButton from '../components/MintNFTButton';
import { uploadToIPFS } from '../services/ipfs';

const UploadPage = () => {
  const [metadataURI, setMetadataURI] = useState('');

  const handleUpload = async (artwork) => {
    const metadata = {
      name: artwork.title,
      description: artwork.description,
      image: artwork.imageURL,
    };
    const uri = await uploadToIPFS(artwork.image, metadata);
    setMetadataURI(uri);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upload & Mint Artwork</h1>
      <UploadArtwork onUpload={handleUpload} />
      {metadataURI && <MintNFTButton metadataURI={metadataURI} />}
    </div>
  );
};

export default UploadPage;