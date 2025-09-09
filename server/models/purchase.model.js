import mongoose, { Schema } from "mongoose";

const purchaseSchema = new Schema(
  {
    pinId: { type: Schema.Types.ObjectId, ref: "Pin", required: true },
    tokenId: { type: String, required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true }, // ETH
    txHash: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Purchase", purchaseSchema);
