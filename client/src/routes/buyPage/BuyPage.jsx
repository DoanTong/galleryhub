import { useEffect, useState, useCallback } from "react";
import useAuthStore from "../../utils/authStore";

const BuyPage = () => {
  const { currentUser } = useAuthStore();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <h3>Pin ID: {p.pinId}</h3>
            <p>Token ID: {p.tokenId}</p>
            <p>Số tiền: {p.amount} ETH</p>
            <p>
              Giao dịch:{" "}
              <a
                href={`https://sepolia.etherscan.io/tx/${p.txHash}`}
                target="_blank"
                rel="noreferrer"
              >
                {p.txHash}
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyPage;
