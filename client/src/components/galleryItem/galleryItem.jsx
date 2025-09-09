import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import ReactDOM from "react-dom";
import Image from "../image/image";
import useAuthStore from "../../utils/authStore";
import { ethers } from "ethers";
import nftContractABI from "../../artifacts/GalleryNFT.json";
import contractABI from "../../artifacts/GalleryBuy.json";
import "./GalleryItem.css";
import PopupDonate from "../popupdonate/popupdonate";
import PopupBuy from "../../routes/popupBuy/PopupBuy.jsx";

const BUY_CONTRACT_ADDRESS = "0xe3a97B766CCE5fe22b1430f0746A8741d418b3B7";
const NFT_CONTRACT_ADDRESS = "0x53041DD98e5A6deacB81DCfef2B7ce4B05027C25";

const GalleryItem = ({ item, onDelete, onPurchase }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();

  const [donatePopupOpen, setDonatePopupOpen] = useState(false);
  const [buyPopupOpen, setBuyPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const optimizedHeight = (372 * item.height) / item.width;
  const ownerId = item.user?._id || item.owner || item.ownerId;
  const isOwner = currentUser ? String(currentUser._id) === String(ownerId) : false;
  const isMinted = !!item.tokenId;

  // Dropdown menu
  const toggleDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    }
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
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

  const handleMenuClick = async (action) => {
    setOpen(false);

    if (action === "Edit") navigate(`/pin/edit/${item._id}`);
    else if (action === "Delete") {
      if (confirm("Bạn có chắc muốn xóa pin này?")) {
        const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/pins/${item._id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
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
        const tx = await nftContract.setApprovalForAll(BUY_CONTRACT_ADDRESS, true);
        await tx.wait();
        alert("Đã phê duyệt hợp đồng mua!");
      } catch (err) {
        console.error("Approve error:", err);
        alert(`Phê duyệt thất bại! ${err.reason || err.message || ""}`);
      } finally {
        setLoading(false);
      }
    } else if (action === "ListForSale") {
      if (!window.ethereum) return alert("Vui lòng cài đặt MetaMask!");
      try {
        setLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const buyContract = new ethers.Contract(BUY_CONTRACT_ADDRESS, contractABI.abi, signer);
        const priceInWei = ethers.parseEther("0.005");
        const currentPrice = await buyContract.prices(NFT_CONTRACT_ADDRESS, item.tokenId);
        if (currentPrice > 0) {
          alert(`NFT đã được liệt kê với giá ${ethers.formatEther(currentPrice)} ETH!`);
          setLoading(false);
          return;
        }
        const tx = await buyContract.setPrice(NFT_CONTRACT_ADDRESS, item.tokenId, priceInWei);
        await tx.wait();
        alert("Đã liệt kê NFT để bán với giá 0.005 ETH!");
      } catch (err) {
        console.error("List error:", err);
        alert(`Liệt kê thất bại! ${err.reason || err.message || ""}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Menu items
  let menuItems = [];
  if (isOwner) {
    if (!isMinted) menuItems = ["Edit", "Delete", "MintNFT"];
    else menuItems = ["Edit", "Delete", "ApproveForSale", "ListForSale"];
  } else {
    menuItems = ["Donate", "Report"];
    if (isMinted) menuItems.unshift("Buy");
  }

  // Dropdown portal
  const dropdown = open
    ? ReactDOM.createPortal(
        <div className="dropdownMenuFloating" style={{ top: menuPos.top, left: menuPos.left }}>
          {menuItems.map((label) => (
            <div key={label} className="dropdownItem" onClick={() => handleMenuClick(label)}>
              {label}
            </div>
          ))}
        </div>,
        document.body
      )
    : null;

  if (!currentUser) return null;

  return (
    <div className="galleryItem" style={{ gridRowEnd: `span ${Math.ceil(item.height / 100)}` }}>
      <Image path={item.media} alt="" w={372} h={optimizedHeight} />
      <Link to={`/pin/${item._id}`} className="overlay" />
      <button className="saveButton">Save</button>

      <div className="overlayIcons">
        <button>
          <Image path="/general/share.svg" alt="Share" />
        </button>
        <button ref={buttonRef} onClick={toggleDropdown}>
          <Image path="/general/more.svg" alt="More" />
        </button>
      </div>

      {dropdown}

      {donatePopupOpen && (
        <PopupDonate ownerWallet={item.user?.walletAddress} onClose={() => setDonatePopupOpen(false)} />
      )}

      {buyPopupOpen && isMinted && (
        <PopupBuy
          pinId={item._id}
          tokenId={item.tokenId}
          ownerWallet={item.user?.walletAddress}
          onClose={() => setBuyPopupOpen(false)}
          onPurchase={onPurchase} // callback refresh BuyPage
        />
      )}
    </div>
  );
};

export default GalleryItem;
