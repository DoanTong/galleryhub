import express from 'express';
import {
    listForSale,
    buyArtwork,
    startAuction,
    placeBid,
    endAuction
} from '../controllers/MarketplaceController.js';

const router = express.Router();

router.post('/list', listForSale);
router.post('/buy', buyArtwork);
router.post('/auction/start', startAuction);
router.post('/auction/bid', placeBid);
router.post('/auction/end', endAuction);

export default router;
