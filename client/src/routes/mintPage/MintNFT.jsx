import { useState } from "react";
import { ethers } from "ethers";
import { useParams, useNavigate } from "react-router";
import useAuthStore from "../../utils/authStore";
import contractABI from "../../artifacts/GalleryNFT.json";
import "./mintNFT.css";

const CONTRACT_ADDRESS = "0x53041DD98e5A6deacB81DCfef2B7ce4B05027C25";
const BUY_CONTRACT_ADDRESS = "0xe3a97B766CCE5fe22b1430f0746A8741d418b3B7";

const MintNFT = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  // const handleMint = async () => {
  //   if (!window.ethereum) return alert("Bạn cần cài MetaMask!");
  //   if (!currentUser?._id) return alert("Bạn cần đăng nhập!");

  //   try {
  //     setLoading(true);

  //     // 1. Lấy pin từ backend
  //     const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/pins/${id}`);
  //     if (!res.ok) throw new Error(`Lỗi fetch pin: ${res.status}`);
  //     const pin = await res.json();

  //     // 2. Chuẩn bị metadata
  //     const metadata = {
  //       name: pin.title,
  //       description: pin.description,
  //       image: pin.media,
  //       artist: currentUser.username,
  //     };

  //     // 3. Upload metadata lên IPFS
  //     const uploadRes = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/nft/upload`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(metadata),
  //     });
  //     const uploadData = await uploadRes.json();
  //     if (!uploadRes.ok) throw new Error("Upload metadata thất bại");

  //     const tokenURI = uploadData.uri;
  //     console.log("Token URI:", tokenURI);

  //     // 4. Mint on-chain
  //     const provider = new ethers.BrowserProvider(window.ethereum);
  //     const signer = await provider.getSigner();
  //     const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

  //     const tx = await contract.mintNFT(tokenURI);
  //     const receipt = await tx.wait();

  //     // 5. Lấy tokenId từ event Transfer
  //     const transferEvent = receipt.logs
  //       .map((log) => {
  //         try {
  //           return contract.interface.parseLog(log);
  //         } catch {
  //           return null;
  //         }
  //       })
  //       .find((e) => e && e.name === "Transfer");

  //     const tokenId = transferEvent?.args?.tokenId?.toString();
  //     if (!tokenId) throw new Error("Không lấy được tokenId từ blockchain");

  //     console.log("Minted tokenId:", tokenId);
  //     setTxHash(tx.hash);

  //     // 6. Phê duyệt hợp đồng mua
  //     const isApproved = await contract.isApprovedForAll(currentUser.walletAddress, BUY_CONTRACT_ADDRESS);
  //     if (!isApproved) {
  //       if (confirm("Bạn có muốn phê duyệt hợp đồng mua để bán NFT này không?")) {
  //         const approveTx = await contract.setApprovalForAll(BUY_CONTRACT_ADDRESS, true);
  //         await approveTx.wait();
  //         alert("Đã phê duyệt hợp đồng mua!");
  //       }
  //     }

  //     // 7. Lưu NFT vào backend (NFT collection)
  //     const nftRes = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/nft/mint`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //       body: JSON.stringify({
  //         pinId: pin._id,
  //         tokenId,
  //         uri: tokenURI,
  //         txHash: tx.hash,
  //         minter: currentUser._id,
  //         ownerWallet: currentUser.walletAddress,
  //       }),
  //     });

  //     if (!nftRes.ok) {
  //       const data = await nftRes.json();
  //       throw new Error(`Lỗi lưu NFT vào backend: ${data.message || "Unknown"}`);
  //     }

  //     // 8. Cập nhật Pin đã mint
  //     await fetch(`${import.meta.env.VITE_API_ENDPOINT}/pins/${id}/mint`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //       body: JSON.stringify({
  //         tokenId,
  //         contractAddress: CONTRACT_ADDRESS,
  //         minPrice: 0.005,
  //       }),
  //     });

  //     alert("Mint thành công! NFT đã được lưu vào backend và pin cập nhật tokenId.");
  //     navigate(-1);
  //   } catch (err) {
  //     console.error("Mint error:", err);
  //     alert(`Mint thất bại! ${err.message || err.reason || "Xem console để biết chi tiết."}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleMint = async () => {
  if (!window.ethereum) return alert("Bạn cần cài MetaMask!");
  if (!currentUser?._id) return alert("Bạn cần đăng nhập!");
  if (!currentUser.walletAddress || !ethers.isAddress(currentUser.walletAddress)) {
    return alert("Ví người dùng chưa kết nối hoặc không hợp lệ.");
  }

  try {
    setLoading(true);

    // 1️⃣ Lấy pin từ backend
    const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/pins/${id}`);
    if (!res.ok) throw new Error(`Lỗi fetch pin: ${res.status}`);
    const pin = await res.json();

    // 2️⃣ Chuẩn bị metadata
    const metadata = {
      name: pin.title,
      description: pin.description,
      image: pin.media,
      artist: currentUser.username,
    };

    // 3️⃣ Upload metadata lên IPFS
    const uploadRes = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/nft/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metadata),
    });
    if (!uploadRes.ok) throw new Error("Upload metadata thất bại");
    const { uri: tokenURI } = await uploadRes.json();
    console.log("Token URI:", tokenURI);

    // 4️⃣ Mint NFT on-chain
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

    const tx = await contract.mintNFT(tokenURI);
    const receipt = await tx.wait();
    console.log("Transaction hash:", tx.hash);

    // 5️⃣ Lấy tokenId từ event Transfer
    const transferEvent = receipt.logs
      .map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((e) => e && e.name === "Transfer");

    const tokenId = transferEvent?.args?.tokenId?.toString();
    if (!tokenId) throw new Error("Không lấy được tokenId từ blockchain");
    console.log("Minted tokenId:", tokenId);
    setTxHash(tx.hash);

    // 6️⃣ Phê duyệt hợp đồng mua (chỉ khi chưa approve)
    const isApproved = await contract.isApprovedForAll(currentUser.walletAddress, BUY_CONTRACT_ADDRESS);
    if (!isApproved) {
      if (confirm("Bạn có muốn phê duyệt hợp đồng mua để bán NFT này không?")) {
        const approveTx = await contract.setApprovalForAll(BUY_CONTRACT_ADDRESS, true);
        await approveTx.wait();
        alert("Đã phê duyệt hợp đồng mua!");
      }
    }

    // 7️⃣ Lưu NFT vào backend (NFT collection)
    const nftRes = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/nft/mint`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        pinId: pin._id,
        tokenId,
        uri: tokenURI,
        txHash: tx.hash,
        minter: currentUser._id,
        ownerWallet: currentUser.walletAddress,
      }),
    });
    if (!nftRes.ok) {
      const data = await nftRes.json();
      throw new Error(`Lỗi lưu NFT vào backend: ${data.message || "Unknown"}`);
    }

    // 8️⃣ Cập nhật pin đã mint
    await fetch(`${import.meta.env.VITE_API_ENDPOINT}/pins/${id}/mint`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        tokenId,
        contractAddress: CONTRACT_ADDRESS,
        minPrice: 0.005,
      }),
    });

    alert("Mint thành công! NFT đã được lưu vào backend và pin cập nhật tokenId.");
    navigate(-1);
  } catch (err) {
    console.error("Mint error:", err);
    alert(`Mint thất bại! ${err.message || err.reason || "Xem console để biết chi tiết."}`);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="mintPage">
      <h2>Mint NFT cho Tranh</h2>
      <p>Pin ID: {id}</p>
      {loading ? <p>Đang xử lý...</p> : <button onClick={handleMint}>Mint NFT</button>}
      {txHash && (
        <p>
          Xem giao dịch:{" "}
          <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">
            {txHash}
          </a>
        </p>
      )}
      <button onClick={() => navigate(-1)}>Quay lại</button>
    </div>
  );
};

export default MintNFT;
