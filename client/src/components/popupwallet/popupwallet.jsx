import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./popupwallet.css";

const PopupWallet = ({ walletAddress, followers, displayName, onDisconnect, onClose }) => {
  const [balance, setBalance] = useState("0 ETH");
  const [txList, setTxList] = useState([]);

  // Lấy balance từ MetaMask
  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress || !window.ethereum) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const bal = await provider.getBalance(walletAddress);
        setBalance(ethers.formatEther(bal) + " ETH");
      } catch (err) {
        console.error("Fetch balance error:", err);
      }
    };
    fetchBalance();
  }, [walletAddress]);

  // Lấy danh sách donations từ server
  useEffect(() => {
    const fetchDonations = async () => {
      if (!walletAddress) return;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/donations?owner=${walletAddress}`
        );
        if (!res.ok) throw new Error("Failed to fetch donations");
        const data = await res.json();
        setTxList(data);
      } catch (err) {
        console.error("Fetch donations error:", err);
      }
    };
    fetchDonations();
  }, [walletAddress]);

  // Disconnect với confirm
  const handleDisconnectClick = () => {
    const confirmed = window.confirm("Bạn có chắc muốn disconnect ví không?");
    if (confirmed) {
      onDisconnect();
    }
  };

  return (
    <div className="walletOverlay" onClick={onClose}>
      <div className="walletContent" onClick={(e) => e.stopPropagation()}>
        <h3>Your Wallet</h3>
        <div className="walletBody">
          {/* Cột trái: wallet info */}
          <div className="walletInfo">
            <p>
              <strong>Name:</strong> {displayName}
            </p>
            <p>
              <strong>Followers:</strong> {followers}
            </p>
            <p>
              <strong>Address:</strong> {walletAddress}
            </p>
            <p>
              <strong>Balance:</strong> {balance}
            </p>
          </div>

          {/* Cột phải: transactions */}
          <div className="transactions">
            <h4>Recent Transactions</h4>
            <div className="txList">
              {txList.length === 0 ? (
                <p>No transactions yet</p>
              ) : (
                txList.map((tx, index) => (
                  <div key={index} className="txItem">
                    <span
                      className={`txAmount ${
                        tx.from?.toLowerCase() === walletAddress?.toLowerCase()
                          ? "outgoing"
                          : "incoming"
                      }`}
                    >
                      <p className="label">Balance:</p>
                      <span className="value">
                        {tx.from?.toLowerCase() === walletAddress?.toLowerCase()
                          ? `- ${tx.amount} ETH`
                          : `+ ${tx.amount} ETH`}
                      </span>
                    </span>
                    <span className="txFrom">
                      <p className="label">From:</p>
                      {tx.from
                        ? tx.from.slice(0, 6) + "..." + tx.from.slice(-4)
                        : "N/A"}
                    </span>
                    <span className="txMsg">
                      <p className="label">Message:</p>
                      {tx.message || "No message"}</span>
                    <span className="txHash">
                      <p>From:</p>
                      {tx.from
                        ? tx.from.slice(0, 10) + "..."
                        : "No hash"}
                    </span>
                    <span className="txTime">
                      <p className="label">Time:</p>
                      {new Date(tx.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <h2 className="walletSuccess">Wallet connected successfully!</h2>

        {/* Nút Disconnect + Close */}
        <div className="walletButtons">
          <button onClick={handleDisconnectClick} className="disconnectBtn">
            Disconnect
          </button>
          <button onClick={onClose} className="closeBtn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupWallet;
