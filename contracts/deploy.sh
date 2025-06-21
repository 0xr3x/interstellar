#!/bin/bash

set -e

echo "🚀 Starting full deployment..."

# 1. Lanza el watcher de scaffold en segundo plano
echo "🔧 Building and deploying with scaffold..."
pnpm stellar scaffold build --build-clients

# 2. Verifica que los contract IDs existan
echo "⏳ Waiting for contract IDs to be generated..."
while [ ! -f ".stellar/contract-ids/iss.json" ] || [ ! -f ".stellar/contract-ids/spaceman.json" ]; do
    sleep 1
done

# 3. Extrae los contract IDs
ISS_ID=$(cat .stellar/contract-ids/iss.json | jq -r .contractId)
SPACEMAN_ID=$(cat .stellar/contract-ids/spaceman.json | jq -r .contractId)

echo "✅ Contracts deployed:"
echo "   ISS:       $ISS_ID"
echo "   SPACEMAN:  $SPACEMAN_ID"

# 4. Invoca set_nft_contract desde iss
echo "🔗 Linking SPACEMAN to ISS using set_nft_contract..."
stellar contract invoke \
  --id "$ISS_ID" \
  --fn set_nft_contract \
  --arg address:"$SPACEMAN_ID" \
  --source me \
  --network standalone

echo "✅ Done: 'iss' now references 'spaceman' NFT contract."
