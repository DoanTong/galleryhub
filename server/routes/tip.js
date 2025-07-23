const express = require('express');
const router = express.Router();
const { getTokenContract } = require('../utils/getContract');
const { ethers } = require('ethers');

// POST /api/tip/send
router.post('/send', async (req, res) => {
  try {
    const { tokenId, amountInGtk } = req.body;
    const contract = await getTokenContract();

    const amount = ethers.utils.parseEther(amountInGtk);

    // Gửi tip
    const tx = await contract.tipNFT(tokenId, amount); 

    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error('Tip Error:', err);
    res.status(500).json({ error: err.message });
  }
});


// GET /api/tip/total/:tokenId
router.get('/total/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const contract = await getTokenContract();

    const total = await contract.getTotalTips(tokenId);
    res.json({
      tokenId,
      totalTipsInEth: ethers.utils.formatEther(total),
    });
  } catch (err) {
    console.error('Get Tip Error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
