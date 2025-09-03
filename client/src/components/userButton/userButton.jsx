import { useState, useEffect } from "react";
import "./userButton.css";
import Image from "../image/image";
import apiRequest from "../../utils/apiRequest";
import { Link, useNavigate } from "react-router";
import useAuthStore from "../../utils/authStore";
import { ethers } from "ethers";

const UserButton = () => {
  const [open, setOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const navigate = useNavigate();
  const { currentUser, removeCurrentUser } = useAuthStore();

  // Khi component mount, nếu user đã có wallet lưu trên server
  useEffect(() => {
    if (currentUser?.walletAddress) {
      setWalletAddress(currentUser.walletAddress);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/users/auth/logout", {});
      removeCurrentUser();
      navigate("/auth");
    } catch (err) {
      console.log(err);
    }
  };

  const handleConnectWallet = async () => {
  if (!window.ethereum) {
    alert("Cần cài MetaMask!");
    return;
  }

  try {
    // 1. Lấy address từ MetaMask
    const [address] = await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("MetaMask address:", address);

    // 2. Lấy nonce từ server
    const nonceRes = await apiRequest.get("/users/wallet-nonce");
    console.log("Nonce from server:", nonceRes.data);
    const nonce = nonceRes.data.nonce;

    // 3. Ký message
    const message = `Sign this message to link wallet: ${nonce}`;
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [message, address],
    });
    console.log("Signature:", signature);

    // 4. Gửi verify wallet
    console.log("Sending verify-wallet request...");
    const verifyRes = await apiRequest.post(
      "/users/verify-wallet",
      { address, signature },
      { withCredentials: true } // quan trọng để gửi cookie
    );
    console.log("verify-wallet response:", verifyRes.data);

    if (verifyRes.data?.message === "Wallet verified successfully") {
      setWalletAddress(address);
      alert("Kết nối ví thành công!");
    } else {
      alert(verifyRes.data?.message || "Lỗi khi kết nối ví");
    }
  } catch (err) {
    console.error("Error in handleConnectWallet:", err);
    alert("Kết nối ví thất bại");
  }
};


  const renderWalletButton = () => {
    if (walletAddress) {
      return (
        <div className="userOption">
          Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </div>
      );
    } else {
      return (
        <div className="userOption" onClick={handleConnectWallet}>
          Connect Wallet
        </div>
      );
    }
  };

  return currentUser ? (
    <div className="userButton">
      <Image path={currentUser.img || "/general/noAvatar.png"} alt="" />
      <div onClick={() => setOpen((prev) => !prev)}>
        <Image path="/general/arrow.svg" alt="" className="arrow" />
      </div>
      {open && (
        <div className="userOptions">
          <Link to={`/profile/${currentUser.username}`} className="userOption">
            Profile
          </Link>
          <div className="userOption">Setting</div>
          {renderWalletButton()}
          <div className="userOption" onClick={handleLogout}>
            Logout
          </div>
        </div>
      )}
    </div>
  ) : (
    <Link to="/auth" className="loginLink">
      Login / Sign Up
    </Link>
  );
};

export default UserButton;
