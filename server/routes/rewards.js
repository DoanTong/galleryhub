import express from 'express';
import { addInteractionReward } from '../controllers/RewardsController.js';

const router = express.Router();
router.post('/reward', addInteractionReward);

export default router;


// 📁 server/controllers/MarketplaceController.js
import Artwork from '../models/Artwork.js';

export const listArtwork = async (req, res) => {
  try {
    const { title, tokenId, price, image } = req.body;
    const artwork = new Artwork({ title, tokenId, price, image, isAuction: false });
    await artwork.save();
    res.status(201).json(artwork);
  } catch (err) {
    res.status(500).json({ error: 'Cannot list artwork', detail: err.message });
  }
};

export const startAuction = async (req, res) => {
  try {
    const { title, tokenId, startingPrice, image } = req.body;
    const artwork = new Artwork({ title, tokenId, price: startingPrice, image, isAuction: true });
    await artwork.save();
    res.status(201).json(artwork);
  } catch (err) {
    res.status(500).json({ error: 'Cannot start auction', detail: err.message });
  }
};
