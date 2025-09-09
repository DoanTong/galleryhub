import mongoose, { Schema } from "mongoose";

const nftSchema = new Schema(
  {
    pinId: { type: Schema.Types.ObjectId, ref: "Pin", required: true },
    tokenId: { type: String, required: true },
    uri: { type: String },
    txHash: { type: String, required: true },
    minter: { type: Schema.Types.ObjectId, ref: "User" },
    ownerWallet: { type: String }, // optional: theo dõi owner hiện tại (ví on-chain)
  },
  { timestamps: true }
);

export default mongoose.model("NFT", nftSchema);
