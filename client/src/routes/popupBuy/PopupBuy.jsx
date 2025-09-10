import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../../artifacts/GalleryBuy.json";
import nftContractABI from "../../artifacts/GalleryNFT.json";
import useAuthStore from "../../utils/authStore";
import "./popupBuy.css";

const BUY_CONTRACT_ADDRESS = "0xe3a97B766CCE5fe22b1430f0746A8741d418b3B7";
const NFT_CONTRACT_ADDRESS = "0x53041DD98e5A6deacB81DCfef2B7ce4B05027C25";

const PopupBuy = ({ pinId, tokenId, ownerWallet, onClose, onPurchase }) => {
  const { currentUser } = useAuthStore();
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  // ✅ fetch giá từ blockchain khi popup mở
  useEffect(() => {
    const fetchPrice = async () => {
      if (!window.ethereum || !tokenId) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          BUY_CONTRACT_ADDRESS,
          contractABI.abi,
          provider
        );
        const priceWei = await contract.prices(NFT_CONTRACT_ADDRESS, tokenId);
        const priceEth = ethers.formatEther(priceWei);
        setPrice(priceEth);
      } catch (err) {
        console.error("Fetch price error:", err);
        setPrice(null);
      }
    };
    fetchPrice();
  }, [tokenId]);

  const handleBuy = async () => {
    if (!window.ethereum) return alert("Vui lòng cài đặt MetaMask!");
    if (!currentUser?._id) return alert("Bạn cần đăng nhập để mua NFT!");
    if (!price) return alert("Không tìm thấy giá NFT trên blockchain!");

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        BUY_CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      );
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        nftContractABI.abi,
        signer
      );
      const userAddress = await signer.getAddress();

      // ✅ Kiểm tra owner hiện tại
      const currentOwner = await nftContract.ownerOf(tokenId);
      if (userAddress.toLowerCase() === currentOwner.toLowerCase()) {
        alert("Bạn không thể mua NFT của chính mình!");
        setLoading(false);
        return;
      }

      // ✅ Gọi contract để mua, gửi đúng giá owner đã set
      const tx = await contract.buyNFT(NFT_CONTRACT_ADDRESS, Number(tokenId), {
        value: ethers.parseEther(price.toString()),
      });
      const receipt = await tx.wait();

      // ✅ Gửi thông tin giao dịch về backend
      await fetch(`${import.meta.env.VITE_API_ENDPOINT}/nft/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          pinId,
          tokenId: tokenId?.toString?.() ?? tokenId,
          buyerId: currentUser._id,
          amount: parseFloat(price),
          txHash: receipt.hash || tx.hash,
        }),
      });

      alert("Mua thành công!");
      onPurchase?.();
      onClose?.();
      setTxHash(receipt.hash);
    } catch (err) {
      console.error("Buy error:", err);
      // alert(`Mua thất bại! ${err.reason || err.message || ""}`);
      alert(`Bạn không đủ tiền trong MetaMask!!!`);
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
        <p>
          Giá:{" "}
          {price !== null ? `${price} ETH` : "Đang tải... hoặc chưa được set"}
        </p>

        <div className="popupBuy__actions">
          <button onClick={handleBuy} disabled={loading || !price}>
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
