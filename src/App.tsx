import { Routes, Route, Link } from "react-router-dom";
import { Layout, Button } from "@stellar/design-system";
import "./App.module.css";
import ConnectAccount from "./components/ConnectAccount.tsx";
import Starscape from "./components/Starscape";
import NFTBidModule from "./components/NFTBidModule";
import SpacemenGallery from "./pages/SpacemenGallery";
import Docs from "./pages/Docs";
import { useState, useEffect } from "react";
import superman from "./util/superman";
import { imageUrls } from "./util/constants";

const auctionTextStyle = {
  marginTop: 0,
  fontSize: "0.9rem",
  textAlign: "center" as const,
};

const centeredHeading = {
  fontSize: "3rem",
  marginBottom: "2rem",
  color: "#FFFF00",
  textAlign: "center" as const,
};

function HomePage() {
  const [bidData, setBidData] = useState({
    highestBid: 0,
    highestBidder: "0x...",
    tokenUri: "",
    tokenId: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBidData = async () => {
      try {
        const bidState = await superman.getCurrentBidState();
        if (bidState) {
          // Convert the highest bid from stroops to XLM (1 XLM = 10^7 stroops)
          const highestBidInXLM = Number(bidState.highestBid.result) / 10000000;

          console.log("Token URI from blockchain:", bidState.tokenUri);
          console.log("Token URI type:", typeof bidState.tokenUri);
          console.log("Token ID:", bidState.tokenId.result);
          console.log("Highest bid:", highestBidInXLM);
          console.log("Highest bidder:", bidState.highestBidder.result);

          // Use the imageUrls from the gallery instead of tokenUri from blockchain
          const tokenId = Number(bidState.tokenId.result) || 0;
          const imageUrl = imageUrls[tokenId] || imageUrls[0]; // Fallback to first image if tokenId is out of range
          console.log("Using image from gallery:", imageUrl);

          setBidData({
            highestBid: highestBidInXLM,
            highestBidder: bidState.highestBidder.result || "0x...",
            tokenUri: imageUrl,
            tokenId: tokenId,
          });
        }
      } catch (error) {
        console.error("Error fetching bid data:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchBidData();

    // Refresh bid data every 30 seconds
    const interval = setInterval(() => {
      void fetchBidData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: "100%" }}>
      <Layout.Inset>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "stretch",
            padding: "0 2rem",
          }}
        >
          {loading ? (
            <div
              style={{
                width: "48%",
                height: "auto",
                maxHeight: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "2px dashed rgba(255,255,255,0.3)",
              }}
            >
              <p style={{ color: "#ffffff", textAlign: "center" }}>
                Loading NFT image...
              </p>
            </div>
          ) : (
            <img
              src={bidData.tokenUri}
              alt={`NFT preview - Token ${bidData.tokenId}`}
              style={{
                width: "48%",
                height: "auto",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 0 8px rgba(0,0,0,0.15)",
              }}
              onError={(e) => {
                // Fallback to first image if current one fails
                console.log("Image failed to load from:", bidData.tokenUri);
                console.log("Falling back to first image");
                e.currentTarget.src = imageUrls[0];
              }}
              onLoad={() => {
                console.log(
                  "Image loaded successfully from:",
                  bidData.tokenUri,
                );
              }}
            />
          )}
          <div
            style={{
              width: "48%",
              maxHeight: "350px",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "1.5rem",
              borderRadius: "12px",
              backgroundColor: "transparent",
              color: "#ffffff",
              fontWeight: 600,
            }}
          >
            <div style={{ flexGrow: 1 }}>
              {loading ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <p>Loading auction data...</p>
                </div>
              ) : (
                <NFTBidModule
                  nftId={bidData.tokenId}
                  currentBid={bidData.highestBid}
                  lastBidder={bidData.highestBidder}
                  auctionEndTime={new Date(Date.now() + 18 * 60 * 60 * 1000)}
                />
              )}
            </div>
          </div>
        </div>
      </Layout.Inset>
    </div>
  );
}

function App() {
  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Starscape />
      <Layout.Header
        projectId="Interstellar"
        projectTitle="Interstellar"
        contentRight={
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link to="/spacemen">
              <Button size="sm" variant="secondary">
                Spacemen
              </Button>
            </Link>
            <Link to="/docs">
              <Button size="sm" variant="secondary">
                Docs
              </Button>
            </Link>
            <ConnectAccount />
          </div>
        }
      />
      <div style={{ padding: "0 2rem", textAlign: "center" }}>
        <h1 style={centeredHeading}>
          Yours to mint. Yours to hold. Yours to orbit.
        </h1>
      </div>
      <p style={auctionTextStyle}>
        <span style={{ color: "#9b59b6" }}>Stellar Blockchain</span>{" "}
        <span style={{ color: "#f1c40f" }}>NFT Auction</span>{" "}
        <span style={{ color: "#ffffff" }}>— Make your bid now!</span>
      </p>
      <div style={{ flex: 1, padding: "1rem" }}>
        <Layout.Content>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/spacemen" element={<SpacemenGallery />} />
            <Route path="/docs" element={<Docs />} />
          </Routes>
        </Layout.Content>
      </div>
      <Layout.Footer>
        <span>
          <span style={{ color: "#f1c40f" }}>
            © {new Date().getFullYear()}
          </span>{" "}
          <span style={{ color: "#9b59b6" }}>Interstellar.</span>
          <span style={{ color: "#ffffff" }}> All rights reserved.</span>
        </span>
      </Layout.Footer>
    </main>
  );
}

export default App;
