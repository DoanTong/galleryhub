import Donation from "../models/donation.model.js";
import express from "express";

const router = express.Router();

// POST /api/donations
router.post("/", async (req, res) => {
  try {
    const { from, to, amount, message, txHash } = req.body;

    const donation = await Donation.create({
      from,
      to,
      amount,
      message,
      txHash,
    });

    res.status(201).json(donation);
  } catch (err) {
    console.error("saveDonation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// GET /api/donations?owner=0x...  -> trả donations where to == owner (recipient)
router.get("/", async (req, res) => {
  try {
    const owner = req.query.owner;
    const filter = owner ? { to: owner } : {};
    const donations = await Donation.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(donations);
  } catch (err) {
    console.error("getDonations error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});
export default router;
