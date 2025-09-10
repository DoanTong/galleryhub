import express from "express";
import ForSalePin from "../models/forsalepin.model.js";
const router = express.Router();

// Lấy tất cả pins đang rao bán (kèm info từ bảng pins)
router.get("/", async (req, res) => {
  try {
    const pins = await ForSalePin.find({ status: "active" })
      .populate("pinId") // 👈 lấy dữ liệu từ bảng Pin
      .sort({ createdAt: -1 });

    res.json(pins);
  } catch (err) {
    console.error("Fetch forsale error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST thêm pin for sale (của bạn đã có)
router.post("/", async (req, res) => {
  try {
    const { pinId, tokenId, contractAddress, ownerId, price } = req.body;
    if (!pinId || !tokenId || !contractAddress || !ownerId || !price)
      return res.status(400).json({ message: "Missing fields" });

    const newForSalePin = new ForSalePin({
      pinId,
      tokenId,
      contractAddress,
      ownerId,
      price,
      status: "active",
    });

    const saved = await newForSalePin.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
