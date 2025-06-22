#!/bin/bash

echo "build contracts"
stellar contract build

# echo "fund your wallet if you dont have money"
# stellar keys fund me --network testnet

# Use USDC testnet token
echo "Using USDC testnet token for bidding..."
BID_TOKEN_ADDRESS="CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"

# Deploy the main contracts
echo "Deploying ISS contract..."
stellar contract deploy --network testnet --source me --wasm target/wasm32v1-none/release/iss.wasm --alias iss-testnet -- --owner me --token $BID_TOKEN_ADDRESS

echo "Deploying SpaceMan NFT contract..."
stellar contract deploy --network testnet --source me --wasm target/wasm32v1-none/release/spaceman.wasm --alias spaceman-testnet -- --iss iss-testnet

# Set up the contracts
echo "Setting up contracts..."
stellar contract invoke --network testnet --id iss-testnet --source-account me -- set_nft_contract --nft_contract spaceman-testnet

# Get USDC testnet tokens
echo ""
echo "=== TO GET USDC TESTNET TOKENS ==="
echo "1. Set Trustline for USDC:"
echo "   - Asset: USDC"
echo "   - Issuer: GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
echo ""
echo "2. Visit Circle USDC Faucet (RECOMMENDED):"
echo "   - Go to: https://usdcfaucet.com/"
echo "   - Select 'Stellar' from dropdown"
echo "   - Paste your testnet address"
echo "   - Click 'Get Tokens' (automatically sets trustline)"
echo ""
echo "3. Or use Stellar Laboratory:"
echo "   - Go to: https://laboratory.stellar.org/#account-creator?network=testnet"
echo "   - Create account (gets XLM automatically)"
echo "   - Go to 'Manage Account' → 'Trustlines'"
echo "   - Add USDC with issuer: GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"

echo "Deployment complete!"
echo "ISS Contract: iss-testnet"
echo "SpaceMan NFT: spaceman-testnet" 
echo "Bid Token (USDC): $BID_TOKEN_ADDRESS"
echo ""
echo "=== TESTING COMMANDS ==="
echo ""
echo "1. Start an auction:"
echo "   stellar contract invoke --network testnet --id iss-testnet --source-account me -- start_auction"
echo ""
echo "2. Place a bid:"
echo "   stellar contract invoke --network testnet --id iss-testnet --source-account me -- bid --bidder me --amount 1000000"
echo "4. Complete a round (after 5 minutes):"
echo "   stellar contract invoke --network testnet --id iss-testnet --source-account me -- start_next_round"
echo ""
echo "5. Withdraw funds:"
echo "   stellar contract invoke --network testnet --id iss-testnet --source-account me -- withdraw --to me"
echo ""
echo "=== EVENT TOPICS TO WATCH ==="
echo "- auction_started: When a new auction begins"
echo "- bid: When someone places a bid"
echo "- refund: When a previous bidder gets refunded"
echo "- round_completed: When an auction ends and NFT is minted"
echo "- withdraw: When funds are withdrawn"