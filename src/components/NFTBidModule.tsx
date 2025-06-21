import React, { useState, useEffect } from "react";

interface NFTBidModuleProps {
  nftId: number;
  currentBid: number;
  lastBidder: string;
  auctionEndTime: Date;
  onPlaceBid: (amount: number) => void;
}

const NFTBidModule: React.FC<NFTBidModuleProps> = ({
  nftId,
  currentBid,
  lastBidder,
  auctionEndTime,
  onPlaceBid,
}) => {
  const [bidInput, setBidInput] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const diff = auctionEndTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Auction ended");
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateTimeLeft(); // initial call
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [auctionEndTime]);

  const handlePlaceBid = () => {
    const bid = parseFloat(bidInput);
    if (!isNaN(bid) && bid > currentBid) {
      onPlaceBid(bid);
    } else {
      alert("Bid must be higher than the current bid.");
    }
  };

  return (
    <div
      style={{
        maxWidth: 420,
        padding: 24,
        borderRadius: 12,
        background: "#f4f4f8",
        fontFamily: "Arial, sans-serif",
        marginBottom: 32,
      }}
    >
      <p style={{ color: "#888", marginBottom: 8 }}>
        {auctionEndTime.toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>
      <h2 style={{ fontSize: 32, margin: "4px 0" }}>Spaceman {nftId}</h2>
      <div style={{ marginTop: 16, marginBottom: 12 }}>
        <p>
          <strong>Current bid:</strong> Ξ {currentBid.toFixed(2)}
        </p>
        <p>
          <strong>Auction ends in:</strong> {timeLeft}
        </p>
      </div>
      <input
        type="number"
        min={currentBid + 0.01}
        step="0.01"
        value={bidInput}
        onChange={(e) => setBidInput(e.target.value)}
        placeholder={`Ξ ${currentBid + 0.01} or more`}
        style={{
          padding: "8px 12px",
          fontSize: 16,
          width: "100%",
          marginBottom: 8,
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
      />
      <button
        onClick={handlePlaceBid}
        style={{
          width: "100%",
          backgroundColor: "#666",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "10px 0",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Place bid
      </button>
      <div style={{ marginTop: 16 }}>
        <p>
          <strong>Last bidder:</strong> {lastBidder}
        </p>
      </div>
    </div>
  );
};

export default NFTBidModule;
