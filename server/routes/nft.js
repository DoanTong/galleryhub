import express from "express";

const router = express.Router();

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

    if (!uploadRes.ok) {
      return res.status(400).json({ error: data });
    }

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

export default router;
