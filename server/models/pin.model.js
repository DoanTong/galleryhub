import mongoose from "mongoose";

const pinSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
    },
    tags: {
      type: [String],
      default: [],
    },
    media: {
      type: String,
      required: true,
    },
    width: Number,
    height: Number,

    // 👇 Thêm 2 field để lưu thông tin NFT
    tokenId: {
      type: String,
      default: null,
    },
    contractAddress: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Pin", pinSchema);
