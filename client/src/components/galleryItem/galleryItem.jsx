import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import ReactDOM from "react-dom";
import Image from "../image/image";
import useAuthStore from "../../utils/authStore";
import "./GalleryItem.css";
import PopupDonate from "../popupdonate/popupdonate"; // sửa path đúng với file của bạn

const GalleryItem = ({ item, onDelete }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();
  const { currentUser } = useAuthStore(); // lấy user từ store
  const [donatePopupOpen, setDonatePopupOpen] = useState(false);
  const optimizedHeight = (372 * item.height) / item.width;

  // Xác định owner
console.log("Gallery item:", item);
const ownerId = item.user?._id || item.owner || item.ownerId;
console.log("OwnerId resolved:", ownerId);
  const isOwner = currentUser ? String(currentUser._id) === String(ownerId) : false;

  console.log("Owner ID:", ownerId, "CurrentUser ID:", currentUser?._id, "isOwner:", isOwner);

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
    }else if (action === "Donate") {
    setDonatePopupOpen(true); // mở popup
  }
     else {
      console.log(`${action} clicked`);
    }
  };
  // Chỉ owner mới hiển thị Edit/Delete
  const menuItems = isOwner ? ["Edit", "Delete"] : ["Donate", "Report"];

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
console.log("Gallery item:", item); // xem toàn bộ dữ liệu
  console.log("Owner wallet in GalleryItem:", item.user?.walletAddress); // xem địa chỉ ví
  console.log("Owner ID:", ownerId, "CurrentUser ID:", currentUser?._id, "isOwner:", isOwner);
  return (
    <div className="galleryItem" style={{ gridRowEnd: `span ${Math.ceil(item.height / 100)}` }}>
      <Image path={item.media} alt="" w={372} h={optimizedHeight} />
      <Link to={`/pin/${item._id}`} className="overlay" />

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
  <PopupDonate
    ownerWallet={item.user?.walletAddress} // ví owner nhận donate
    onClose={() => setDonatePopupOpen(false)} // đóng popup
  />
)}

    </div>
  );
};

export default GalleryItem;
