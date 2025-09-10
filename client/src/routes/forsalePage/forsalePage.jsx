import { useEffect, useState, useCallback } from "react";
import GalleryItem from "../../components/galleryItem/galleryItem";
import "./forsalePage.css";

// Popup riêng để hiển thị chi tiết và Buy
const PopupItem = ({ item, onClose, onBuy }) => {
  const [buying, setBuying] = useState(false);

  const handleBuyClick = async () => {
    if (buying) return; // tránh click nhiều lần
    setBuying(true);
    try {
      await onBuy(item._id);
    } finally {
      setBuying(false);
      onClose(); // đóng popup sau khi mua xong
    }
  };

  return (
    <div className="popupOverlay" onClick={() => !buying && onClose()}>
      <div className="popupContent" onClick={(e) => e.stopPropagation()}>
        <h3>{item.title || "Untitled"}</h3>
        {item.media && (
          <img
            src={item.media}
            alt={item.title}
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        )}
        <p><strong>Token ID:</strong> {item.tokenId}</p>
        <p><strong>Contract:</strong> {item.contractAddress}</p>
        <p><strong>Owner:</strong> {item.ownerId}</p>
        <p><strong>Giá:</strong> {item.price} ETH</p>
        <p><strong>Trạng thái:</strong> {item.status}</p>
        <button onClick={handleBuyClick} disabled={buying}>
          {buying ? "Đang mua..." : "Mua"}
        </button>
        <button onClick={onClose} disabled={buying}>Đóng</button>
      </div>
    </div>
  );
};

const ForSalePage = () => {
  const [forsales, setForsales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch for-sale pins
  const fetchForsales = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/forsale?status=active`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Lỗi fetch for-sale pins: ${res.status}`);
      const data = await res.json();
      setForsales(data);
    } catch (err) {
      console.error("Fetch forsales error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForsales();
  }, [fetchForsales]);

  // Hàm xử lý khi pin được mua thành công
  const handleBuyed = async (pinId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/forsale/${pinId}`, {
        method: "DELETE", // hoặc PATCH nếu muốn đánh dấu lock
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Xóa pin thất bại: ${res.status}`);

      setForsales((prev) => prev.filter((p) => p._id !== pinId));
    } catch (err) {
      console.error("Handle buyed error:", err);
      alert("Có lỗi khi cập nhật pin sau khi mua!");
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!forsales.length) return <div>Hiện chưa có tranh nào được rao bán.</div>;

  return (
    <div className="forSalePage">
      <h2>Tranh Đang Rao Bán</h2>
      <div className="forSaleList">
        {forsales.map((p) => {
          const itemData = {
            ...p.pinId,
            price: p.price,
            tokenId: p.tokenId,
            contractAddress: p.contractAddress,
            ownerId: p.ownerId,
            status: p.status,
            _id: p._id,
          };
          return (
            <div key={p._id} className="forSaleItem">
              <GalleryItem
                item={itemData}
                onClick={() => setSelectedItem(itemData)}
                onPurchase={() => handleBuyed(p._id)}
              />
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <PopupItem
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onBuy={handleBuyed}
        />
      )}
    </div>
  );
};

export default ForSalePage;
