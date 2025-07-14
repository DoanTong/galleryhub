import express from 'express';
const router = express.Router();

router.post('/send', async (req, res) => {
  const { toAddress, amount } = req.body;
  // Logic gửi tip bằng crypto có thể được thực hiện ở client thông qua Web3
  res.json({ message: 'Tip simulated (should be done via MetaMask)' });
});

export default router;
