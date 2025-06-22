# 🪐 Interstellar 

Welcome to **Interstellar**, an app showcasing a limited-edition NFT collection deployed on Soroban (Wasm-based blockchain) and presented through a modern React + TypeScript frontend.
---

## ✨ Highlights

- **Built with OpenZeppelin's ERC-721 for Soroban**  
  We're using the new **ERC-721 implementation adapted for Soroban smart contracts** by OpenZeppelin—pushing forward NFT standards in the Wasm/WebAssembly ecosystem.
- **Inspired by Nouns DAO**  
  The Spacemen concept draws inspiration from [Nouns](https://nouns.wtf), embracing on-chain creativity and public goods through generative art.
- IPFS-hosted NFT metadata, mintable directly by collectors.
- Smart contract compiled to `.wasm` and integrated via Stellar RPC.
- Fully responsive UI built with React + Stellar Design System.

---

## Tech Stack

| Layer          | Tech |
|----------------|------|
| Smart Contract | Rust (Wasm) + OpenZeppelin's Soroban ERC-721 |
| Blockchain     | Stellar Soroban Network (Futurenet/Local) |
| Frontend       | React + TypeScript |
| Styling        | LESS + Stellar Design System + Shrikhand (Google Font) |
| Web3 Wallet    | `@stellar/freighter-api`, Stellar Wallet Kit |
| NFT Storage    | IPFS via Pinata |
| Tooling        | ESLint, Husky, Prettier, Docker |

---

Getting Started

### 1. Clone & Install

git clone https://github.com/your-org/interstellar.git
cd interstellar
npm install

### 2. Compile the contract

docker build -t spaceman-builder .
docker run --rm -v $(pwd):/code spaceman-builder

### 3. Start front end

Access the app at: http://localhost:3000

This project uses Husky for pre-commit checks and ESLint rules for strict typing and promise handling.







