import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const LikeButton = () => {
  const [liked, setLiked] = useState(false);
  const toggleLike = () => setLiked(prev => !prev);

  return (
    <button onClick={toggleLike} className="flex items-center gap-1">
      <Heart className={liked ? 'text-red-500 fill-red-500' : 'text-gray-500'} />
      {liked ? 'Liked' : 'Like'}
    </button>
  );
};

export default LikeButton;
