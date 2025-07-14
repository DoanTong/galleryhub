import express from 'express';
import Artwork from '../models/Artwork.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const totalArtworks = await Artwork.countDocuments();
    const verified = await Artwork.countDocuments({ verified: true });
    const unverified = totalArtworks - verified;

    res.json({ totalArtworks, verified, unverified });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
