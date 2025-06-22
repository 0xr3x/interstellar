import React from "react";
import { imageUrls } from "../util/constants";

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
