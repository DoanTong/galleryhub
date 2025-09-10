// import { useState, useEffect, useRef } from "react";
// import "./userButton.css";
// import Image from "../image/image";
// import apiRequest from "../../utils/apiRequest";
// import { Link, useNavigate } from "react-router";
// import useAuthStore from "../../utils/authStore";
// import { ethers } from "ethers";
// import PopupWallet from "../popupwallet/popupwallet";

// const UserButton = () => {
//   const [open, setOpen] = useState(false);
//   const [walletAddress, setWalletAddress] = useState("");
//   const [walletPopupOpen, setWalletPopupOpen] = useState(false);
//   const { currentUser, removeCurrentUser } = useAuthStore();
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);

//   // Khi component mount, nếu user đã có wallet lưu trên server
//   useEffect(() => {
//     if (currentUser?.walletAddress) {
//       setWalletAddress(currentUser.walletAddress);
//     }
//   }, [currentUser]);

//   // Đóng dropdown khi click ngoài
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await apiRequest.post("/users/auth/logout", {});
//       removeCurrentUser();
//       navigate("/auth");
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // Connect wallet
//   const handleConnectWallet = async () => {
//     if (!window.ethereum) return alert("Cần cài MetaMask!");

//     try {
//       const [address] = await window.ethereum.request({ method: "eth_requestAccounts" });
//       // Lấy nonce từ server
//       const nonceRes = await apiRequest.get("/users/wallet-nonce");
//       const nonce = nonceRes.data.nonce;
//       const message = `Sign this message to link wallet: ${nonce}`;
//       const signature = await window.ethereum.request({
//         method: "personal_sign",
//         params: [message, address],
//       });

//       const verifyRes = await apiRequest.post(
//         "/users/verify-wallet",
//         { address, signature },
//         { withCredentials: true }
//       );

//       if (verifyRes.data?.message === "Wallet verified successfully") {
//         setWalletAddress(address);
//         alert("Kết nối ví thành công!");
//       } else {
//         alert(verifyRes.data?.message || "Lỗi khi kết nối ví");
//       }
//     } catch (err) {
//       console.error("Error in handleConnectWallet:", err);
//       alert("Kết nối ví thất bại");
//     }
//   };

//   // Click vào nút wallet
//   const handleWalletClick = async () => {
//     if (!walletAddress) {
//       await handleConnectWallet();
//       return;
//     }
//     setWalletPopupOpen(true);
//   };

//   // Disconnect wallet
//   const handleDisconnectWallet = () => {
//     setWalletAddress("");
//     setWalletPopupOpen(false);
//   };

//   const renderWalletButton = () => {
//     if (walletAddress) {
//       return (
//         <div className="userOption" onClick={handleWalletClick}>
//           Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
//         </div>
//       );
//     } else {
//       return (
//         <div className="userOption" onClick={handleConnectWallet}>
//           Connect Wallet
//         </div>
//       );
//     }
//   };

//   return currentUser ? (
//     <>
//       <div className="userButton" ref={dropdownRef}>
//         <Image path={currentUser.img || "/general/noAvatar.png"} alt="" />
//         <div onClick={() => setOpen((prev) => !prev)}>
//           <Image path="/general/arrow.svg" alt="" className="arrow" />
//         </div>
//         {open && (
//           <div className="userOptions">
//             <Link to={`/profile/${currentUser.username}`} className="userOption">
//               Profile
//             </Link>
//             <div className="userOption">Setting</div>
//             {renderWalletButton()}
//             {currentUser.isOwner && (
//               <>
//                 <div className="userOption" onClick={() => navigate(`/edit/${currentUser.id}`)}>
//                   Edit
//                 </div>
//                 <div className="userOption" onClick={() => console.log("Delete action")}>
//                   Delete
//                 </div>
//               </>
//             )}
//             <div className="userOption" onClick={handleLogout}>
//               Logout
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Popup Wallet */}
//       {walletPopupOpen && (
//         <PopupWallet
//           displayName={currentUser.displayName}
//           followers={currentUser.followerCount}
//           walletAddress={walletAddress}
//           onDisconnect={handleDisconnectWallet}
//           onClose={() => setWalletPopupOpen(false)}
//         />
        
//       )}
//     </>
//   ) : (
//     <Link to="/auth" className="loginLink">
//       Login / Sign Up
//     </Link>
//   );
// };

// export default UserButton;
import { useState, useEffect, useRef } from "react";
import "./userButton.css";
import Image from "../image/image";
import apiRequest from "../../utils/apiRequest";
import { Link, useNavigate } from "react-router";
import useAuthStore from "../../utils/authStore";
import { ethers } from "ethers";
import PopupWallet from "../popupwallet/popupwallet";

const UserButton = () => {
  const [open, setOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletPopupOpen, setWalletPopupOpen] = useState(false);
  const { currentUser, removeCurrentUser, setCurrentUser } = useAuthStore();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Khi component mount, nếu user đã có wallet lưu trên server
  useEffect(() => {
    if (currentUser?.walletAddress) {
      setWalletAddress(currentUser.walletAddress);
    }
  }, [currentUser]);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/users/auth/logout", {});
      removeCurrentUser();
      navigate("/auth");
    } catch (err) {
      console.log(err);
    }
  };

  // Connect wallet
  const handleConnectWallet = async () => {
    if (!window.ethereum) return alert("Cần cài MetaMask!");
    try {
      const [address] = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (!address || !ethers.isAddress(address)) {
        return alert("Không lấy được địa chỉ ví từ MetaMask!");
      }

      // Lấy nonce từ server
      const nonceRes = await apiRequest.get("/users/wallet-nonce");
      const nonce = nonceRes.data.nonce;
      const message = `Sign this message to link wallet: ${nonce}`;

      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, address],
      });

      // Verify wallet với backend
      const verifyRes = await apiRequest.post(
        "/users/verify-wallet",
        { address, signature },
        { withCredentials: true }
      );

      if (verifyRes.data?.message === "Wallet verified successfully") {
        setWalletAddress(address);
        setCurrentUser({ ...currentUser, walletAddress: address }); // update store
        alert("Kết nối ví thành công!");
      } else {
        alert(verifyRes.data?.message || "Lỗi khi kết nối ví");
      }
    } catch (err) {
      console.error("Error in handleConnectWallet:", err);
      alert("Kết nối ví thất bại");
    }
  };

  // Click vào nút wallet
  const handleWalletClick = async () => {
    if (!walletAddress) {
      await handleConnectWallet();
      return;
    }
    setWalletPopupOpen(true);
  };

  // Disconnect wallet
  const handleDisconnectWallet = () => {
    setWalletAddress("");
    setWalletPopupOpen(false);
    setCurrentUser({ ...currentUser, walletAddress: null }); // remove wallet from store
  };

  const renderWalletButton = () => {
    if (walletAddress) {
      return (
        <div className="userOption" onClick={handleWalletClick}>
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
    <>
      <div className="userButton" ref={dropdownRef}>
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
            {currentUser.isOwner && (
              <>
                <div className="userOption" onClick={() => navigate(`/edit/${currentUser.id}`)}>
                  Edit
                </div>
                <div className="userOption" onClick={() => console.log("Delete action")}>
                  Delete
                </div>
              </>
            )}
            <div className="userOption" onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </div>

      {/* Popup Wallet */}
      {walletPopupOpen && (
        <PopupWallet
          displayName={currentUser.displayName}
          followers={currentUser.followerCount}
          walletAddress={walletAddress}
          onDisconnect={handleDisconnectWallet}
          onClose={() => setWalletPopupOpen(false)}
        />
      )}
    </>
  ) : (
    <Link to="/auth" className="loginLink">
      Login / Sign Up
    </Link>
  );
};

export default UserButton;
