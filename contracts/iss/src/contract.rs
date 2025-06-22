// use core::ops::Add;

// SPDX-License-Identifier: MIT
use soroban_sdk::{contract, contractimpl, Address, Env, Symbol, symbol_short, IntoVal, token::TokenClient};

const START: Symbol = symbol_short!("START");
const TOKEN_ID: Symbol = symbol_short!("TID");
const HIGHEST_BID: Symbol = symbol_short!("HIGH");
const HIGHEST_BIDDER: Symbol = symbol_short!("WINNER");
const SPACEMAN: Symbol = symbol_short!("SPACEMAN");
const OWNER: Symbol = symbol_short!("OWNER");
const BID_TOKEN: Symbol = symbol_short!("BID_TOKEN");

#[contract]
pub struct ISS;

#[contractimpl]
impl ISS {

    // constructor
    pub fn __constructor(e: &Env, owner: Address, token: Address) {
        e.storage().instance().set(&OWNER, &owner);
        e.storage().instance().set(&BID_TOKEN, &token)
    }

    // read functions

    pub fn get_current_token_id(e: &Env) -> u32 {
        e.storage().instance().get(&TOKEN_ID).unwrap()
    }

    pub fn get_current_highest_bid(e: &Env) -> i128 {
        let token_id: u32 = e.storage().instance().get(&TOKEN_ID).unwrap();
        e.storage().persistent().get(&(&HIGHEST_BID, token_id)).unwrap_or(0)
    }

    pub fn get_current_highest_bidder(e: &Env) -> Option<Address> {
        let token_id: u32 = e.storage().instance().get(&TOKEN_ID).unwrap();
        e.storage().persistent().get(&(&HIGHEST_BIDDER, token_id))
    }

    pub fn get_nft_contract(e: &Env) -> Address {
        e.storage()
            .instance()
            .get(&SPACEMAN)
            .expect("SpaceMan contract not set")
    }

    pub fn get_bid_token(e: &Env) -> Address {
        e.storage()
            .instance()
            .get(&BID_TOKEN)
            .expect("Bid token not set")
    }

    // set functions

    // the space dao should be given access to this contract in future (not an eoa)
    pub fn set_owner(e: &Env, new_owner: Address) {
        let current_owner: Address = e.storage().instance().get(&OWNER).expect("OWNER not set");
        current_owner.require_auth();
    
        e.storage().instance().set(&OWNER, &new_owner);
    }
    
    // this should be called only on first initialization
    pub fn set_nft_contract(e: &Env, nft_contract: Address) {
        let owner: Address = e.storage().instance().get(&OWNER).expect("OWNER not set");
        owner.require_auth();

        e.storage().instance().set(&SPACEMAN, &nft_contract);
    }

    // set the token used for bidding
    pub fn set_bid_token(e: &Env, token_contract: Address) {
        let owner: Address = e.storage().instance().get(&OWNER).expect("OWNER not set");
        owner.require_auth();

        e.storage().instance().set(&BID_TOKEN, &token_contract);
    }

    // this function starts the very first auction
    pub fn start_auction(e: &Env) {
        let token_id: u32 = e.storage().instance().get(&TOKEN_ID).unwrap();
        let now = e.ledger().timestamp();
        e.storage().persistent().set(&(&START, token_id), &now);
    }

    // active function when the auction is underway
    pub fn bid(e: &Env, bidder: Address, amount: i128) {
        bidder.require_auth();

        let token_id: u32 = e.storage().instance().get(&TOKEN_ID).unwrap();
        let start_time: u64 = e
            .storage()
            .persistent()
            .get(&(&START, token_id))
            .expect("Auction not started");

        let now = e.ledger().timestamp();

        let current_high: i128 = e
            .storage()
            .persistent()
            .get(&(&HIGHEST_BID, token_id))
            .unwrap_or(0);
              
        assert!(now - start_time < 300, "Auction ended");
        assert!(amount > 0, "Zero payment");    
        assert!(amount > current_high, "Bid too low");

        // Get the bid token contract
        let bid_token = TokenClient::new(e, &Self::get_bid_token(e));

        // Transfer tokens from bidder to contract
        bid_token.transfer(&bidder, &e.current_contract_address(), &amount);

        // refund previous bidder if there was one
        if let Some(prev_bidder) =
            e.storage().persistent().get::<_, Address>(&(&HIGHEST_BIDDER, token_id))
        {
            if current_high > 0 {
                // Transfer tokens back to previous bidder
                bid_token.transfer(&e.current_contract_address(), &prev_bidder, &current_high);
            }
        }

        // save new highest bid
        e.storage()
            .persistent()
            .set(&(&HIGHEST_BID, token_id), &amount);
        e.storage()
            .persistent()
            .set(&(&HIGHEST_BIDDER, token_id), &bidder);
    }
    // this function settles the existing round and starts the next one
    pub fn start_next_round(e: &Env) {
        let token_id: u32 = e.storage().instance().get(&TOKEN_ID).unwrap();
    
        // check auction ended
        let start_time: u64 = e
            .storage()
            .persistent()
            .get(&(START, token_id))
            .expect("Auction not started");
        assert!(
            e.ledger().timestamp() >= start_time + 300,
            "Auction still active"
        );
    
        // get winner
        let winner: Address = e
            .storage()
            .persistent()
            .get(&(&HIGHEST_BIDDER, token_id))
            .expect("No winner");
    
        // mint NFT to winner
        let nft_contract: Address = e.storage().instance().get(&SPACEMAN).unwrap();
        e.invoke_contract::<()>(
            &nft_contract,
            &symbol_short!("mint"),
            (winner.clone(), token_id).into_val(e),
        );

        // advance token id
        let next_token = token_id + 1;
        e.storage().instance().set(&TOKEN_ID, &next_token);
    
        // reset state of auction
        e.storage().persistent().remove(&(&HIGHEST_BID, token_id));
        e.storage().persistent().remove(&(&HIGHEST_BIDDER, token_id));
    
        // start new round
        let now = e.ledger().timestamp();
        e.storage().persistent().set(&(&START, next_token), &now);
    }
    
    // function to withdraw the total previous auction winnings to the dao
    pub fn withdraw(e: &Env, to: Address) {
        let owner: Address = e.storage().instance().get(&OWNER).expect("OWNER not set");
        owner.require_auth();
    
        let bid_token = TokenClient::new(e, &Self::get_bid_token(e));
        let contract_balance = bid_token.balance(&e.current_contract_address());
    
        if contract_balance > 0 {
            // Transfer all tokens to the owner
            bid_token.transfer(&e.current_contract_address(), &to, &contract_balance);
        }
    }
}