import React, { useEffect, useState } from "react";

interface AuctionResultProps {
  nftId: number;
  winnerAddress: string;
  finalBid: number;
  auctionEndTime: Date;
  nftImage?: string;
}

const AuctionResult: React.FC<AuctionResultProps> = ({
  nftId,
  winnerAddress,
  finalBid,
  auctionEndTime,
  nftImage,
}) => {
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      if (now >= auctionEndTime) {
        setHasEnded(true);
      }
    };

    const interval = setInterval(checkTime, 1000);
    checkTime(); // Run once immediately on mount
    return () => clearInterval(interval);
  }, [auctionEndTime]);

  if (!hasEnded) return null;

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.08)",
        padding: "2rem",
        borderRadius: "16px",
        textAlign: "center",
        color: "#fff",
        marginTop: "2rem",
        border: "2px solid purple",
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)",
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        🎉 Auction Ended!
      </h2>
      <p>Congrats to the top bidder:</p>
      <h3 style={{ color: "yellow", margin: "0.5rem 0" }}>{winnerAddress}</h3>
      <p>Won NFT #{nftId} for</p>
      <h3 style={{ color: "lightgreen" }}>{finalBid.toFixed(2)} XLM</h3>
      {nftImage && (
        <img
          src={nftImage}
          alt={`NFT #${nftId}`}
          style={{
            marginTop: "1rem",
            width: "100%",
            maxWidth: "300px",
            borderRadius: "12px",
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
};

export default AuctionResult;
