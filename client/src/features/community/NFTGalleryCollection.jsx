import React from 'react';

const NFTGalleryCollection = ({ tokens }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {tokens.map((token, i) => (
        <div key={i} className="border rounded p-2">
          <img src={token.image} alt={token.name} className="w-full" />
          <h3 className="font-bold mt-2">{token.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default NFTGalleryCollection;