import { Routes, Route, Link } from "react-router-dom";
import { Layout, Button } from "@stellar/design-system";
import "./App.module.css";
import ConnectAccount from "./components/ConnectAccount.tsx";
import Starscape from "./components/Starscape";
import NFTBidModule from "./components/NFTBidModule";
import SpacemenGallery from "./pages/SpacemenGallery";
import Docs from "./pages/Docs";

function HomePage() {
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
          <img
            src="https://crimson-peaceful-impala-136.mypinata.cloud/ipfs/bafybeiaxbvl7t7mvv77pkq7jh5xr2yg3yhq3smeaubmja3xglgdrp76aoy"
            alt="NFT preview"
            style={{
              width: "48%",
              height: "auto",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: "8px",
              boxShadow: "0 0 8px rgba(0,0,0,0.15)",
            }}
          />
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
              <NFTBidModule
                nftId={1555}
                currentBid={0.69}
                lastBidder={"0xF...89DF"}
                auctionEndTime={new Date(Date.now() + 18 * 60 * 60 * 1000)}
                onPlaceBid={(amount) => {
                  console.log("Bid placed:", amount);
                }}
              />
            </div>
            <p
              style={{
                marginTop: "1rem",
                fontSize: "0.9rem",
                textAlign: "center",
              }}
            >
              <span style={{ color: "#9b59b6" }}>Stellar Blockchain</span>{" "}
              <span style={{ color: "#f1c40f" }}>NFT Auction</span>{" "}
              <span style={{ color: "#ffffff" }}>— Make your bid now!</span>
            </p>
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
      <div style={{ flex: 1, padding: "1rem 1rem" }}>
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
