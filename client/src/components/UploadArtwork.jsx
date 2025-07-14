import React, { useState } from 'react';
import axios from 'axios';

const UploadArtwork = ({ onUpload }) => {
  const [art, setArt] = useState({ title: '', description: '', image: null });

  const handleChange = e => {
    const { name, value, files } = e.target;
    setArt(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', art.title);
    formData.append('description', art.description);
    formData.append('image', art.image);

    const res = await axios.post('/api/artworks', formData);
    onUpload && onUpload(res.data);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-2">
      <input name="title" placeholder="Title" onChange={handleChange} className="border p-2" />
      <textarea name="description" placeholder="Description" onChange={handleChange} className="border p-2" />
      <input type="file" name="image" onChange={handleChange} className="p-2" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
    </form>
  );
};

export default UploadArtwork;