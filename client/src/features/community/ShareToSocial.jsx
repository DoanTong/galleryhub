import React from 'react';

const ShareToSocial = ({ imageUrl }) => {
  const share = () => {
    navigator.share
      ? navigator.share({ title: 'Check this artwork!', url: imageUrl })
      : alert('Sharing not supported on this browser');
  };

  return (
    <button onClick={share} className="text-blue-600 underline">
      Share
    </button>
  );
};

export default ShareToSocial;
