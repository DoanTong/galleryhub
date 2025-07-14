import React, { useState } from 'react';

const CommentBox = ({ onSubmit }) => {
  const [comment, setComment] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="border p-2 flex-1"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
        Send
      </button>
    </form>
  );
};

export default CommentBox;