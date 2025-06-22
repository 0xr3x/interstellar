import React from "react";

const imageUrls = [
  "https://crimson-peaceful-impala-136.mypinata.cloud/ipfs/bafybeic7krn45dxjy4pusdwznkm6xo4madluwbz7ep7gun6wzjhdhperle",
  "https://crimson-peaceful-impala-136.mypinata.cloud/ipfs/bafybeihh5do3sqgukeo3cjge46phryqqrh4dd5t43bs2uuqmdahikccn5y",
  "https://crimson-peaceful-impala-136.mypinata.cloud/ipfs/bafybeibypknhnao637iwt63c2w7qv6gaz4b57igt3tc3p3nmzu6bedjcya",
  "https://crimson-peaceful-impala-136.mypinata.cloud/ipfs/bafybeiaxbvl7t7mvv77pkq7jh5xr2yg3yhq3smeaubmja3xglgdrp76aoy",
  "https://crimson-peaceful-impala-136.mypinata.cloud/ipfs/bafybeidtkgestuvpft52q3pr5xpepcwhbaeukeu7iy33qdkqqd67y35uhq",
  "https://crimson-peaceful-impala-136.mypinata.cloud/ipfs/bafybeiggkhjcsl7gigshkokplvjpjplcwtlbmx6be2sn2fdvjxgmc4cqdq",
  "https://crimson-peaceful-impala-136.mypinata.cloud/ipfs/bafybeiaow6al4bb6fjtoudqrrx3mnzwythzwzroeldjlodjk7kprri42zu",
];

const SpacemenGallery: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{ fontSize: "3.5rem", marginBottom: "2rem", color: "#FFFF00" }}
      >
        THE SPACEMEN GALLERY
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "2rem",
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        {imageUrls.map((url, index) => (
          <div
            key={url}
            style={{
              border: "1px solid #ddd",
              borderRadius: "16px",
              backgroundColor: "#f8f8f8",
              width: "220px",
              padding: "1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={url}
              alt={`Spaceman #${index + 1}`}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "12px",
                marginBottom: "0.75rem",
              }}
            />
            <p style={{ color: "#333", fontWeight: "500" }}>
              Spaceman #{index + 1}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpacemenGallery;
