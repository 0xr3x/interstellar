#!/bin/bash

echo "build contracts"
stellar contract build

# echo "fund your wallet if you dont have money"
# stellar keys fund me --network testnet

# initialize setup
stellar contract deploy --network testnet --source me --wasm target/wasm32v1-none/release/iss.wasm --alias iss-testnet -- --owner me
stellar contract deploy --network testnet --source me --wasm target/wasm32v1-none/release/spaceman.wasm --alias spaceman-testnet -- --iss iss-testnet

stellar contract invoke --network testnet --id iss-testnet --source-account me -- set_nft_contract --nft_contract spaceman-testnet