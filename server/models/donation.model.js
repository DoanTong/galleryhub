import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    from: { type: String, required: true }, // ví người gửi
    to: { type: String, required: true },   // ví người nhận
    amount: { type: String, required: true }, // số ETH (string để tránh lỗi float)
    message: { type: String, default: "" }, // lời nhắn
    txHash: { type: String, required: true }, // hash giao dịch từ blockchain
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);
