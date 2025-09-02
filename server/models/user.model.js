import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    walletAddress: { type: String, unique: true, sparse: true }, // mỗi ví chỉ dùng 1 account
    nonce: { type: Number, default: Math.floor(Math.random() * 1000000) } // dùng cho message signing

  },
  { timestamps: true }
);

export default mongoose.model("User",userSchema)
