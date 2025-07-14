import { ethers } from 'ethers';
import { contractAddress, contractABI } from '../../client/src/web3/constants.js';

export const rewardUser = async (req, res) => {
  try {
    const { toAddress, amount } = req.body;
    const provider = new ethers.JsonRpcProvider(process.env.VITE_RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);

    const tx = await tokenContract.reward(toAddress, amount);
    await tx.wait();

    res.json({ message: `Rewarded ${amount} tokens to ${toAddress}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};