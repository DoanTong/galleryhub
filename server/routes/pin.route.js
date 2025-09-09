import express from "express";
import {
  getPins,
  getPin,
  createPin,
  deletePin,
  interactionCheck,
  interact,
  updatePin, 
} from "../controllers/pin.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import Pin from "../models/pin.model.js";   // 👈 thêm dòng này

const router = express.Router();

router.get("/", getPins);
router.get("/:id", getPin);
router.post("/", verifyToken, createPin);
router.delete("/:id", verifyToken, deletePin);
router.put("/:id", verifyToken, updatePin);
router.get("/interaction-check/:id", interactionCheck);
router.post("/interact/:id", verifyToken, interact);

// 👇 thêm route update mint info ở cuối
router.put("/:id/mint", async (req, res) => {
  try {
    const { id } = req.params;
    const { tokenId, contractAddress } = req.body;
    if (!tokenId || !contractAddress) {
      return res.status(400).json({ message: "Missing tokenId or contractAddress" });
    }

    const updated = await Pin.findByIdAndUpdate(
      id,
      { tokenId, contractAddress },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Update pin mint error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
