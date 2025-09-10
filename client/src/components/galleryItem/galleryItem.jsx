import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import ReactDOM from "react-dom";
import Image from "../image/image";
import useAuthStore from "../../utils/authStore";
import "./GalleryItem.css";
import PopupDonate from "../popupdonate/popupdonate"; // sửa path đúng với file của bạn

<<<<<<< Updated upstream
const GalleryItem = ({ item, onDelete }) => {
=======
// ========== Config ==========
const BUY_CONTRACT_ADDRESS = "0xe3a97B766CCE5fe22b1430f0746A8741d418b3B7";
const NFT_CONTRACT_ADDRESS = "0x53041DD98e5A6deacB81DCfef2B7ce4B05027C25";

// ========== PopupSetPrice ==========
const PopupSetPrice = ({ onClose, onConfirm }) => {
  const [price, setPrice] = useState("");

  const handleConfirm = () => {
    if (!price || isNaN(price) || Number(price) <= 0) {
      alert("Vui lòng nhập giá hợp lệ!");
      return;
    }
    onConfirm(price);
  };

  return ReactDOM.createPortal(
    <div className="popupOverlay">
      <div className="popupContent">
        <h3>Đặt giá bán NFT</h3>
        <input
          type="number"
          placeholder="Nhập giá ETH"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="priceInput"
        />
        <div className="popupActions">
          <button onClick={handleConfirm} className="confirmBtn">
            Xác nhận
          </button>
          <button onClick={onClose} className="cancelBtn">
            Hủy
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ========== GalleryItem ==========
const GalleryItem = ({ item, onDelete, onPurchase }) => {
>>>>>>> Stashed changes
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();
  const { currentUser } = useAuthStore(); // lấy user từ store
  const [donatePopupOpen, setDonatePopupOpen] = useState(false);
<<<<<<< Updated upstream
=======
  const [buyPopupOpen, setBuyPopupOpen] = useState(false);
  const [setPricePopupOpen, setSetPricePopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

>>>>>>> Stashed changes
  const optimizedHeight = (372 * item.height) / item.width;

<<<<<<< Updated upstream
  // Xác định owner
// console.log("Gallery item:", item);
const ownerId = item.user?._id || item.owner || item.ownerId;
// console.log("OwnerId resolved:", ownerId);
  const isOwner = currentUser ? String(currentUser._id) === String(ownerId) : false;

  // console.log("Owner ID:", ownerId, "CurrentUser ID:", currentUser?._id, "isOwner:", isOwner);

=======
  // Kiểm tra trạng thái approve
  useEffect(() => {
    const checkApproved = async () => {
      if (!window.ethereum || !isMinted) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, nftContractABI.abi, provider);

        const approvedAddress = await nftContract.getApproved(item.tokenId);
        setIsApproved(approvedAddress?.toLowerCase() === BUY_CONTRACT_ADDRESS.toLowerCase());
      } catch (err) {
        console.error("Check approve error:", err);
      }
    };
    checkApproved();
  }, [isMinted, item.tokenId]);

  // Dropdown menu
>>>>>>> Stashed changes
  const toggleDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    }
    setOpen(prev => !prev);
  };

  // Click ngoài đóng menu
  useEffect(() => {
    const handleClickOutside = e => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        !e.target.closest(".dropdownMenuFloating")
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // Xử lý menu actions
const handleMenuClick = async (action) => {
  setOpen(false);

  if (action === "Edit") {
    navigate(`/pin/edit/${item._id}`);
  } else if (action === "Delete") {
    if (window.confirm("Bạn có chắc chắn muốn xóa pin này?")) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/pins/${item._id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (res.ok) {
<<<<<<< Updated upstream
          alert("Xóa thành công!");
          if (onDelete) onDelete(item._id); // callback để cha cập nhật
        } else {
          alert("Xóa thất bại!");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("Có lỗi xảy ra!");
      }
    }
  } else if (action === "Donate") {
    setDonatePopupOpen(true); // mở popup donate
  } else if (action === "MintNFT") {
    navigate(`/mint/${item._id}`); // điều hướng sang trang mint NFT
  } else {
    console.log(`${action} clicked`);
=======
          alert("Xóa thành công");
          onDelete?.(item._id);
        } else alert("Xóa thất bại");
      }
    } else if (action === "Donate") setDonatePopupOpen(true);
    else if (action === "MintNFT") navigate(`/mint/${item._id}`);
    else if (action === "Buy") setBuyPopupOpen(true);
    else if (action === "ApproveForSale") {
      if (!window.ethereum) return alert("Vui lòng cài đặt MetaMask!");
      try {
        setLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, nftContractABI.abi, signer);
        const tx = await nftContract.approve(BUY_CONTRACT_ADDRESS, item.tokenId);
        await tx.wait();
        alert("Đã phê duyệt hợp đồng mua!");
        setIsApproved(true);
      } catch (err) {
        console.error("Approve error:", err);
        alert(`Phê duyệt thất bại! ${err.reason || err.message || ""}`);
      } finally {
        setLoading(false);
      }
    } else if (action === "ListForSale") {
      setSetPricePopupOpen(true);
    }
  };

  // Xác nhận giá NFT và lưu vào backend
  const handleConfirmSetPrice = async (priceEth) => {
    setSetPricePopupOpen(false);
    if (!window.ethereum) return alert("Vui lòng cài đặt MetaMask!");
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const buyContract = new ethers.Contract(BUY_CONTRACT_ADDRESS, contractABI.abi, signer);

      const priceInWei = ethers.parseEther(priceEth.toString());
      const currentPrice = await buyContract.prices(NFT_CONTRACT_ADDRESS, item.tokenId);
      if (currentPrice > 0n) {
        alert(`NFT đã được liệt kê với giá ${ethers.formatEther(currentPrice)} ETH!`);
        setLoading(false);
        return;
      }

      const tx = await buyContract.setPrice(NFT_CONTRACT_ADDRESS, item.tokenId, priceInWei);
      await tx.wait();

      // --- Lưu vào backend ---
      await fetch(`${import.meta.env.VITE_API_ENDPOINT}/forsale`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          pinId: item._id,
          tokenId: item.tokenId,
          contractAddress: NFT_CONTRACT_ADDRESS,
          ownerId: currentUser._id,
          price: priceEth,
        }),
      });

      alert(`Đã liệt kê NFT để bán với giá ${priceEth} ETH!`);
    } catch (err) {
      console.error("List error:", err);
      alert(`Liệt kê thất bại! ${err.reason || err.message || ""}`);
    } finally {
      setLoading(false);
    }
  };

  // Menu items logic
  let menuItems = [];
  if (isOwner) {
    if (!isMinted) menuItems = ["Edit", "Delete", "MintNFT"];
    else {
      menuItems = ["Edit", "Delete"];
      if (!isApproved) menuItems.push("ApproveForSale");
      else menuItems.push("ListForSale");
    }
  } else {
    menuItems = ["Donate", "Report"];
    if (isMinted && isApproved) menuItems.unshift("Buy");
>>>>>>> Stashed changes
  }
};
  // Chỉ owner mới hiển thị Edit/Delete
  const menuItems = isOwner ? ["Edit", "Delete","MintNFT"] : ["Donate", "Report"];

  const dropdown = open
    ? ReactDOM.createPortal(
        <div className="dropdownMenuFloating" style={{ top: menuPos.top, left: menuPos.left }}>
          {menuItems.map(label => (
            <div key={label} className="dropdownItem" onClick={() => handleMenuClick(label)}>
              {label}
            </div>
          ))}
        </div>,
        document.body
      )
    : null;

  // Nếu user chưa load xong, không render gallery item
  if (!currentUser) return null;
// console.log("Gallery item:", item); // xem toàn bộ dữ liệu
//   console.log("Owner wallet in GalleryItem:", item.user?.walletAddress); // xem địa chỉ ví
//   console.log("Owner ID:", ownerId, "CurrentUser ID:", currentUser?._id, "isOwner:", isOwner);
  return (
    <div className="galleryItem" style={{ gridRowEnd: `span ${Math.ceil(item.height / 100)}` }}>
      <Image path={item.media} alt="" w={372} h={optimizedHeight} />
      <Link to={`/pin/${item._id}`} className="overlay" />
<<<<<<< Updated upstream
      <button className="saveButton">Save</button>
=======

>>>>>>> Stashed changes
      <div className="overlayIcons">
        <button>
          <Image path="/general/share.svg" alt="Share" />
        </button>
        <button ref={buttonRef} onClick={toggleDropdown}>
          <Image path="/general/more.svg" alt="More" />
        </button>
      </div>

      {dropdown}
<<<<<<< Updated upstream
      {donatePopupOpen && (
  <PopupDonate
    ownerWallet={item.user?.walletAddress} // ví owner nhận donate
    onClose={() => setDonatePopupOpen(false)} // đóng popup
  />
)}

=======

      {donatePopupOpen && <PopupDonate ownerWallet={item.user?.walletAddress} onClose={() => setDonatePopupOpen(false)} />}
      {buyPopupOpen && isMinted && <PopupBuy pinId={item._id} tokenId={item.tokenId} ownerWallet={item.user?.walletAddress} onClose={() => setBuyPopupOpen(false)} onPurchase={onPurchase} />}
      {setPricePopupOpen && <PopupSetPrice onClose={() => setSetPricePopupOpen(false)} onConfirm={handleConfirmSetPrice} />}
>>>>>>> Stashed changes
    </div>
  );
};

export default GalleryItem;
