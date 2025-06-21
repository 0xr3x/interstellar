import { Routes, Route, Link } from "react-router-dom";
import { Layout, Button } from "@stellar/design-system";
import "./App.module.css";
import ConnectAccount from "./components/ConnectAccount.tsx";
import Starscape from "./components/Starscape";
import NFTBidModule from "./components/NFTBidModule";
import SpacemenGallery from "./pages/SpacemenGallery";

function HomePage() {
  return (
    <Layout.Inset>
      <NFTBidModule
        nftId={1555}
        currentBid={0.69}
        lastBidder={"0xF...89DF"}
        auctionEndTime={new Date(Date.now() + 18 * 60 * 60 * 1000)}
        onPlaceBid={(amount) => console.log("Bid placed:", amount)}
      />
      <h1>Welcome to your app!</h1>
      {/* the rest of your homepage content */}
    </Layout.Inset>
  );
}

function App() {
  return (
    <main>
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
            <ConnectAccount />
          </div>
        }
      />
      <Layout.Content>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/spacemen" element={<SpacemenGallery />} />
        </Routes>
      </Layout.Content>
      <Layout.Footer>
        <span>
          © {new Date().getFullYear()} Interstellar. Licensed under the{" "}
          <a
            href="http://www.apache.org/licenses/LICENSE-2.0"
            target="_blank"
            rel="noopener noreferrer"
          >
            Apache License, Version 2.0
          </a>
          .
        </span>
      </Layout.Footer>
    </main>
  );
}

export default App;
