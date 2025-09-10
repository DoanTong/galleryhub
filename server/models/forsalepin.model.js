import mongoose from "mongoose";
const { Schema } = mongoose;

const ForSalePinSchema = new Schema(
  {
    pinId: { type: Schema.Types.ObjectId, ref: "Pin", required: true },
    tokenId: { type: String, required: true },
    contractAddress: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: String, required: true },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("ForSalePin", ForSalePinSchema);
