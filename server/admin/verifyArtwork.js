import Artwork from '../models/Artwork.js';

export const verifyArtwork = async (req, res) => {
  try {
    const { artworkId, status } = req.body;
    const artwork = await Artwork.findById(artworkId);
    if (!artwork) return res.status(404).json({ error: 'Not found' });

    artwork.verified = status;
    await artwork.save();

    res.json({ message: 'Artwork status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};