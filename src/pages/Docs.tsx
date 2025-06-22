// src/pages/Docs.tsx

function Docs() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
        color: "white",
        lineHeight: "1.6",
      }}
    >
      <h1 style={{ color: "purple" }}>Interstellar Docs</h1>

      <p>
        <strong style={{ color: "yellow" }}>Interstellar</strong> is a
        collection of 7 NFTs. One NFT is auctioned every 24 hours, and you must
        compete with others to win the bid and complete the entire collection.
      </p>

      <ul>
        <li style={{ color: "purple" }}>
          Each NFT is unique and part of the same Interstellar universe.
        </li>
        <li style={{ color: "yellow" }}>
          Auctions reset every 24h. You must be the top bidder before the timer
          ends.
        </li>
        <li style={{ color: "white" }}>
          You can start your collection anytime, but completing it won’t be
          easy.
        </li>
      </ul>

      <h2 style={{ color: "purple" }}>Auction Contract</h2>
      <p>
        The Interstellar Auction Contract runs 24/7. Once an auction is settled,
        a new NFT is minted and a new 24-hour countdown begins. Proceeds from
        winning bids go directly to the Interstellar DAO treasury.
      </p>

      <p style={{ color: "yellow" }}>
        Since ERC-721 support is new on Stellar, you’ll be one of the first
        collectors!
      </p>

      <h2 style={{ color: "purple" }}>Governance</h2>
      <p>
        The DAO uses a fork of Compound Governance. Each NFT represents a vote
        in the DAO. Ownership of the NFT gives you voting rights. Votes can be
        delegated.
      </p>
      <p>
        Treasury funds will be used to support Interstellar ecosystem
        activities, such as events, community courses, and grants.
      </p>
    </div>
  );
}

export default Docs;
