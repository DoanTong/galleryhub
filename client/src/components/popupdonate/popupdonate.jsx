import { useState } from "react";
import { ethers } from "ethers";
import "./popupDonate.css";

const PopupDonate = ({ ownerWallet, onClose }) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // "", "pending", "confirmed", "failed"

  const handleDonate = async () => {
    console.log("Sending donation to wallet:", ownerWallet); // phải hiện ra ví owner

    if (!ownerWallet) {
      alert("Không tìm thấy ví của owner!");
      return;
    }
    if (!window.ethereum) {
      alert("Cần cài MetaMask!");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Nhập số ETH hợp lệ!");
      return;
    }

    try {
      setStatus("pending");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const sender = await signer.getAddress();

      console.log("Sending donation to wallet:", ownerWallet);

      // Gửi ETH on-chain
      const tx = await signer.sendTransaction({
        to: ownerWallet,
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      setStatus("confirmed");

      // Sau khi confirmed → gọi API lưu donation
      await fetch(`${import.meta.env.VITE_API_ENDPOINT}/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: sender,
          to: ownerWallet,
          amount,
          message,
          txHash: tx.hash,
        }),
      });
    } catch (err) {
      console.error("Donate error:", err);
      setStatus("failed");
    }
  };

  return (
    <div className="popupOverlay" onClick={onClose}>
      <div className="popupContent" onClick={(e) => e.stopPropagation()}>
        <h3>Donate ETH</h3>
        <p>
          <strong>Recipient:</strong> {ownerWallet || "Không có địa chỉ ví"}
        </p>

        <div className="donateBody">
          <label>
            Amount (ETH):
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.0001"
              placeholder="0.01"
            />
          </label>

          <label>
            Message (optional):
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Lời nhắn tới owner"
              rows={3}
            />
          </label>

          {status && (
            <p className={`donateStatus ${status}`}>
              {status === "pending" && "Transaction pending..."}
              {status === "confirmed" && "Transaction confirmed ✅"}
              {status === "failed" && "Transaction failed ❌"}
            </p>
          )}
        </div>

        <div className="popupButtons">
          <button onClick={handleDonate} className="confirmBtn">
            Confirm
          </button>
          <button onClick={onClose} className="closeBtn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupDonate;
