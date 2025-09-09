import express from "express";
import fetch from "node-fetch";
import NFT from "../models/nft.model.js";
import Purchase from "../models/purchase.model.js";

const router = express.Router();

/** POST /api/nft/upload -> Pinata */
router.post("/upload", async (req, res) => {
  try {
    const metadata = req.body; // { name, description, image, artist }

    const uploadRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify(metadata),
    });

    const data = await uploadRes.json();
    if (!uploadRes.ok) return res.status(400).json({ error: data });

    return res.json({
      success: true,
      ipfsHash: data.IpfsHash,
      uri: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
    });
  } catch (err) {
    console.error("Pinata upload error:", err);
    res.status(500).json({ error: "Failed to upload metadata" });
  }
});

/** POST /api/nft/mint  (lưu record mint) */
router.post("/mint", async (req, res) => {
  try {
    const { pinId, tokenId, uri, txHash, minter, ownerWallet } = req.body;
    if (!pinId || !tokenId || !txHash) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const nft = await NFT.create({ pinId, tokenId, uri, txHash, minter, ownerWallet });
    res.status(201).json(nft);
  } catch (err) {
    console.error("mintNFT error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/** GET /api/nft/by-pin/:pinId -> lấy info mint của pin */
router.get("/by-pin/:pinId", async (req, res) => {
  try {
    const { pinId } = req.params;
    const nft = await NFT.findOne({ pinId }).lean();
    res.json(nft || null);
  } catch (err) {
    console.error("get NFT by pin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/** POST /api/nft/buy  (lưu giao dịch mua + đổi owner trong DB Pin nếu muốn) */
import Pin from "../models/pin.model.js";
router.post("/buy", async (req, res) => {
  try {
    const { pinId, tokenId, buyerId, amount, txHash } = req.body;
    if (!pinId || !tokenId || !buyerId || !amount || !txHash) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // đảm bảo pin đã mint
    const minted = await NFT.findOne({ pinId, tokenId });
    if (!minted) return res.status(400).json({ message: "NFT not minted" });

    const purchase = await Purchase.create({ pinId, tokenId, buyerId, amount, txHash });

    // Optional: cập nhật 'owner' của Pin sang buyerId (để UI thấy isOwner)
    await Pin.findByIdAndUpdate(pinId, { user: buyerId });

    res.status(201).json(purchase);
  } catch (err) {
    console.error("buyNFT error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/** GET /api/nft/buy?buyerId=... -> danh sách đã mua */
router.get("/buy", async (req, res) => {
  try {
    const { buyerId } = req.query;
    if (!buyerId) return res.status(400).json({ message: "buyerId required" });
    const purchases = await Purchase.find({ buyerId }).sort({ createdAt: -1 }).lean();
    res.json(purchases);
  } catch (err) {
    console.error("getPurchases error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
