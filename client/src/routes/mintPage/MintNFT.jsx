import { useState } from "react";
import { ethers } from "ethers";
import { useParams, useNavigate } from "react-router";
import useAuthStore from "../../utils/authStore";
import contractABI from "../../artifacts/GalleryNFT.json";
import "./mintNFT.css";

// Địa chỉ contract đã deploy trên Sepolia
const CONTRACT_ADDRESS = "0x53983a652454551589BD2251684FAe0A830f0697";

const MintNFT = () => {
  const { id } = useParams(); // ID của pin
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

 const handleMint = async () => {
  if (!window.ethereum) {
    alert("Bạn cần cài MetaMask!");
    return;
  }

  try {
    setLoading(true);

    // Lấy pin info
    const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/pins/${id}`);
    const pin = await res.json();

    const metadata = {
      name: pin.title,
      description: pin.description,
      image: pin.media,
      artist: currentUser?.username || "unknown",
    };

    // Upload metadata lên IPFS
    const uploadRes = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/nft/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metadata),
    });
    const uploadData = await uploadRes.json();
    const tokenURI = uploadData.uri;

    // Kết nối contract
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

    // Mint cho signer hiện tại
    const tx = await contract.mintNFT(tokenURI);
    await tx.wait();

    setTxHash(tx.hash);
    alert("Mint thành công!");
  } catch (err) {
    console.error("Mint error:", err);
    alert("Mint thất bại!");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="mintPage">
      <h2>Mint NFT cho Tranh</h2>
      <p>Pin ID: {id}</p>
      {loading ? (
        <p>Đang xử lý...</p>
      ) : (
        <button onClick={handleMint}>Mint NFT</button>
      )}
      {txHash && (
        <p>
          Xem giao dịch:{" "}
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {txHash}
          </a>
        </p>
      )}
      <button onClick={() => navigate(-1)}>Quay lại</button>
    </div>
  );
};

export default MintNFT;
