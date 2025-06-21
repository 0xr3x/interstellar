// SPDX-License-Identifier: MIT
#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env, Symbol, symbol_short, Vec, Map, String, BytesN, Val, IntoVal};

const START: Symbol = symbol_short!("START");
const TOKEN_ID: Symbol = symbol_short!("TID");
const HIGHEST_BID: Symbol = symbol_short!("HIGH");
const HIGHEST_BIDDER: Symbol = symbol_short!("WINNER");
const NFT_CONTRACT: Symbol = symbol_short!("NFT");

#[contract]
pub struct ISS;

#[contractimpl]
impl ISS {

    // constructor
    pub fn __constructor(e: &Env, owner: Address) {
        e.storage().instance().set(&OWNER, &owner);
    }

    // read functions

    pub fn get_current_token_id(e: &Env) -> u32 {
        e.storage().instance().get(&TOKEN_ID).unwrap()
    }

    pub fn get_current_highest_bid(e: &Env) -> i128 {
        let token_id: u32 = e.storage().instance().get(&TOKEN_ID).unwrap();
        e.storage().persistent().get((&HIGHEST_BID, token_id)).unwrap_or(0)
    }

    pub fn get_current_highest_bidder(e: &Env) -> Option<Address> {
        let token_id: u32 = e.storage().instance().get(&TOKEN_ID).unwrap();
        e.storage().persistent().get((&HIGHEST_BIDDER, token_id))
    }

    pub fn get_nft_contract(e: &Env) -> Address {
        e.storage()
            .instance()
            .get(&SPACEMAN)
            .expect("SpaceMan contract not set")
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

    // this function starts the very first auction
    pub fn start_auction(e: &Env) {
        let token_id: u32 = e.storage().instance().get(&TOKEN_ID).unwrap();
        let now = e.ledger().timestamp();
        e.storage().persistent().set((&START, token_id), &now);
    }

    // active function when the auction is underway
    pub fn bid(e: &Env, bidder: Address) {
        bidder.require_auth();

        let token_id: u32 = e.storage().instance().get(&TOKEN_ID).unwrap();
        let start_time: u64 = e
            .storage()
            .persistent()
            .get((&START, token_id))
            .expect("Auction not started");

        let now = e.ledger().timestamp();
        assert!(now - start_time < 300, "Auction ended");

        let payment: i128 = e.auths().get(0).unwrap().1; // XLM sent
        assert!(payment > 0, "Zero payment");

        let current_high: i128 = e
            .storage()
            .persistent()
            .get((&HIGHEST_BID, token_id))
            .unwrap_or(0);

        assert!(payment > current_high, "Bid too low");

        // refund previous bidder
        if let Some(prev_bidder) =
            e.storage().persistent().get::<_, Address>((&HIGHEST_BIDDER, token_id))
        {
            if current_high > 0 {
                e.pay(&e.current_contract_address(), &prev_bidder, current_high);
            }
        }

        // save new highest bid
        e.storage()
            .persistent()
            .set((&HIGHEST_BID, token_id), &payment);
        e.storage()
            .persistent()
            .set((&HIGHEST_BIDDER, token_id), &bidder);
    }

    // this function settles the existing round and starts the next one
    pub fn start_next_round(e: &Env) {
        let token_id: u32 = e.storage().instance().get(&TOKEN_ID).unwrap();
    
        // check auction ended
        let start_time: u64 = e
            .storage()
            .persistent()
            .get((&START, token_id))
            .expect("Auction not started");
        assert!(
            e.ledger().timestamp() >= start_time + 300,
            "Auction still active"
        );
    
        // get winner
        let winner: Address = e
            .storage()
            .persistent()
            .get((&HIGHEST_BIDDER, token_id))
            .expect("No winner");
    
        // mint NFT to winner
        let nft_contract: Address = e.storage().instance().get(&NFT_CONTRACT).unwrap();
        e.invoke_contract::<()>(
            &nft_contract,
            &symbol_short!("mint"),
            (winner.clone(), token_id).into_val(e),
        );
    
        // advance token id
        let next_token = token_id + 1;
        e.storage().instance().set(&TOKEN_ID, &next_token);
    
        // reset state of auction
        e.storage().persistent().remove((&HIGHEST_BID, token_id));
        e.storage().persistent().remove((&HIGHEST_BIDDER, token_id));
    
        // start new round
        let now = e.ledger().timestamp();
        e.storage().persistent().set((&START, next_token), &now);
    }
    
    // function to withdraw the total previous auction winnings to the dao
    pub fn withdraw(e: &Env, to: Address) {
        let owner: Address = e.storage().instance().get(&OWNER).expect("OWNER not set");
        owner.require_auth();
    
        let contract_address = e.current_contract_address();
        let balance = e.account_balance(&contract_address);
    
        // get current token ID
        let token_id: u32 = e.storage().instance().get(&TOKEN_ID).unwrap_or(0);
        let reserved: i128 = e
            .storage()
            .persistent()
            .get((&HIGHEST_BID, token_id))
            .unwrap_or(0);
    
        // prevent stealing the current top bid
        let withdrawable = balance - reserved;
        assert!(withdrawable > 0, "Nothing to withdraw");
    
        // pay in native XLM
        e.pay(&contract_address, &to, &withdrawable);
    }
    // pub fn mint_nft(e: &Env, to: Address, token_id: u32) {
    //     let nft_contract = Self::get_nft_contract(e);

    //     let mut args = Vec::new(e);
    //     args.push_back(to.into_val(e));
    //     args.push_back(token_id.into_val(e));

    //     e.invoke_contract::<()>(
    //         &nft_contract,
    //         &symbol_short!("mint"),
    //         args,
    //     );
    // }
}