import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../../artifacts/GalleryBuy.json";
import nftContractABI from "../../artifacts/GalleryNFT.json";
import "./popupBuy.css";

const BUY_CONTRACT_ADDRESS = "0xe3a97B766CCE5fe22b1430f0746A8741d418b3B7";
const NFT_CONTRACT_ADDRESS = "0x53041DD98e5A6deacB81DCfef2B7ce4B05027C25";

const PopupBuy = ({ pinId, tokenId, ownerWallet, onClose }) => {
  const [price, setPrice] = useState("0.01");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    console.log("PopupBuy props:", { pinId, tokenId, ownerWallet });
  }, [pinId, tokenId, ownerWallet]);

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
      setPrice(value);
    }
  };

  const handleBuy = async () => {
  if (!window.ethereum) return alert("Vui lòng cài đặt MetaMask!");

  try {
    setLoading(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(BUY_CONTRACT_ADDRESS, contractABI.abi, signer);
    const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, nftContractABI.abi, signer);
    const userAddress = await signer.getAddress();

    // Kiểm tra owner
    const currentOwner = await nftContract.ownerOf(tokenId);
    if (userAddress.toLowerCase() === currentOwner.toLowerCase()) {
      alert("Bạn không thể mua NFT của chính mình!");
      setLoading(false);
      return;
    }

    // Lấy buyerId đúng từ localStorage / authStore
    let me = JSON.parse(localStorage.getItem("user") || "{}");
    if (!me?._id) {
      const authStore = (await import("../../utils/authStore")).default;
      me = authStore.getState().currentUser || {};
      if (!me?._id) throw new Error("Không xác định được buyerId");
      localStorage.setItem("user", JSON.stringify(me));
    }

    // Gọi contract mua
    const tx = await contract.buyNFT(NFT_CONTRACT_ADDRESS, Number(tokenId), {
      value: ethers.parseEther(price),
    });
    const receipt = await tx.wait();

    // Lưu giao dịch vào backend
    await fetch(`${import.meta.env.VITE_API_ENDPOINT}/nft/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        pinId,
        tokenId: tokenId?.toString?.() ?? tokenId,
        buyerId: me._id,
        amount: parseFloat(price),
        txHash: receipt.hash || tx.hash,
      }),
    });

    alert("Mua thành công!");
    onPurchase?.(); // refresh BuyPage
    onClose?.();
  } catch (err) {
    console.error("Buy error:", err);
    alert(`Mua thất bại! ${err.reason || err.message || ""}`);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="popupBuy">
      <div className="popupBuy__card">
        <h3>Mua NFT</h3>
        <p>Owner (ví): {ownerWallet || "-"}</p>
        <p>Token ID: {tokenId}</p>

        <label>
          Số ETH:
          <input
            type="number"
            step="0.001"
            min="0"
            value={price}
            onChange={handlePriceChange}
            placeholder="Nhập số ETH (ví dụ: 0.01)"
          />
        </label>

        <div className="popupBuy__actions">
          <button onClick={handleBuy} disabled={loading}>
            {loading ? "Đang xử lý..." : "BUY"}
          </button>
          <button onClick={onClose}>Đóng</button>
        </div>

        {txHash && (
          <p className="tx">
            Tx:{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
            >
              {txHash}
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default PopupBuy;
