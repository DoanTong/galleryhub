import { useEffect, useState, useCallback } from "react";
import useAuthStore from "../../utils/authStore";
import GalleryItem from "../../components/galleryItem/galleryItem";

import "./buyPage.css";

const BuyPage = () => {
  const { currentUser } = useAuthStore();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null); // tranh được click

  // Fetch purchases
  const fetchPurchases = useCallback(async () => {
    if (!currentUser?._id) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/nft/buy?buyerId=${currentUser._id}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error(`Lỗi fetch purchases: ${res.status}`);
      const data = await res.json();
      setPurchases(data);
    } catch (err) {
      console.error("Fetch purchases error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  if (loading) return <div>Đang tải...</div>;
  if (!purchases.length) return <div>Bạn chưa mua tranh nào.</div>;

  return (
    <div className="buyPage">
      <h2>Tranh Đã Mua</h2>
      <div className="purchaseList">
        {purchases.map((p) => (
          <div key={p._id} className="purchaseItem">
            <GalleryItem
              item={p}
              onPurchase={fetchPurchases}
              onClick={() => setSelectedItem(p)}
            />
          </div>
        ))}
      </div>

      {/* Popup chi tiết */}
      {selectedItem && (
        <div className="popupOverlay" onClick={() => setSelectedItem(null)}>
          <div
            className="popupContent"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{selectedItem.title}</h3>
            <img
              src={selectedItem.media}
              alt={selectedItem.title}
              style={{ maxWidth: "100%", borderRadius: "8px" }}
            />
            <p><strong>Pin ID:</strong> {selectedItem.pinId}</p>
            <p><strong>Token ID:</strong> {selectedItem.tokenId}</p>
            <p><strong>Amount:</strong> {selectedItem.amount} ETH</p>
            <p><strong>Tx Hash:</strong> {selectedItem.txHash}</p>
            <button onClick={() => setSelectedItem(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyPage;
