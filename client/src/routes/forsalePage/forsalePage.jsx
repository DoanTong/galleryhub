import { useEffect, useState, useCallback } from "react";
import GalleryItem from "../../components/galleryItem/galleryItem";
import "./forsalePage.css";

const ForSalePage = () => {
  const [forsales, setForsales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null); // pin đang click

  // Fetch for-sale pins
  const fetchForsales = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/forsale`, {
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

  if (loading) return <div>Đang tải...</div>;
  if (!forsales.length) return <div>Hiện chưa có tranh nào được rao bán.</div>;

  return (
    <div className="forSalePage">
      <h2>Tranh Đang Rao Bán</h2>
      <div className="forSaleList">
        {forsales.map((p) => {
          const itemData = {
            ...p.pinId, // lấy title, media, description từ Pin
            price: p.price,
            tokenId: p.tokenId,
            contractAddress: p.contractAddress,
            ownerId: p.ownerId,
            status: p.status,
          };

          return (
            <div key={p._id} className="forSaleItem">
              <GalleryItem
                item={itemData}
                onClick={() => setSelectedItem(itemData)}
              />
            </div>
          );
        })}
      </div>

      {/* Popup chi tiết */}
      {selectedItem && (
        <div className="popupOverlay" onClick={() => setSelectedItem(null)}>
          <div className="popupContent" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedItem.title || "Untitled"}</h3>
            {selectedItem.media && (
              <img
                src={selectedItem.media}
                alt={selectedItem.title}
                style={{ maxWidth: "100%", borderRadius: "8px" }}
              />
            )}
            <p><strong>Token ID:</strong> {selectedItem.tokenId}</p>
            <p><strong>Contract:</strong> {selectedItem.contractAddress}</p>
            <p><strong>Owner:</strong> {selectedItem.ownerId}</p>
            <p><strong>Giá:</strong> {selectedItem.price} ETH</p>
            <p><strong>Trạng thái:</strong> {selectedItem.status}</p>
            <button onClick={() => setSelectedItem(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForSalePage;
