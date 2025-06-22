import React, { useState, useEffect } from "react";
import { ISS } from "../util/superman";
import { useWallet } from "../hooks/useWallet";
import { wallet } from "../util/wallet";

interface NFTBidModuleProps {
  nftId: number;
  currentBid: number;
  lastBidder: string;
  auctionEndTime: Date;
}

const NFTBidModule: React.FC<NFTBidModuleProps> = ({
  nftId,
  currentBid,
  lastBidder,
  auctionEndTime,
}) => {
  const [bidInput, setBidInput] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const { address } = useWallet();

  // Función para actualizar el tiempo restante de la subasta
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

    updateTimeLeft(); // Llamada inicial
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [auctionEndTime]);

  const handlePlaceBid = async () => {
    const bid = parseFloat(bidInput);
    const bidInteger = BigInt(bid * 10 ** 7); // Corregir el cálculo del BigInt

    try {
      const BidResult = await ISS.bid({
        bidder: address!,
        amount: bidInteger,
      });

      // Firmar y enviar la transacción
      await BidResult.signAndSend({
        signTransaction: (xdr) =>
          wallet.signTransaction(xdr, {
            address: address!,
            networkPassphrase: "Test SDF Network ; September 2015",
          }),
      });

      // TODO: Agregar celebración de la puja exitosa
      alert("Bid placed successfully!");
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place bid. Please try again.");
    }
  };

  // Función síncrona que llama la función asíncrona
  const handleBidClick = () => {
    void handlePlaceBid();
  };

  return (
    <div
      style={{
        maxWidth: 420,
        padding: 24,
        borderRadius: 12,
        background: "transparent",
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
          <strong>Current bid:</strong> USDC {currentBid.toFixed(2)}
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
        placeholder={`USDC ${currentBid + 0.01} or more`}
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
        type="button" // Se agregó el tipo "button"
        onClick={handleBidClick} // Cambié a usar la función síncrona
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
