// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Stellar Soroban Contracts ^0.2.0
#![no_std]

use soroban_sdk::{Address, contract, contractimpl, Env, String, Symbol, symbol_short};
use stellar_non_fungible::{Base, NonFungibleToken};

const ISS: Symbol = symbol_short!("ISS");

#[contract]
pub struct SpaceMan;

#[contractimpl]
impl SpaceMan {
    pub fn __constructor(e: &Env, iss: Address) {
        Base::set_metadata(e, String::from_str(e, "https://ipfs.io/ipfs/bafybeidtkgestuvpft52q3pr5xpepcwhbaeukeu7iy33qdkqqd67y35uhq"), String::from_str(e, "SpaceMan"), String::from_str(e, "SPACE"));
        e.storage().instance().set(&ISS, &iss);
    }

    pub fn mint(e: &Env, to: Address, token_id: u32) {
        let iss: Address = e.storage().instance().get(&ISS).expect("iss should be set");
        iss.require_auth();
    
        let uri = match token_id % 5 {
            0 => "https://ipfs.io/ipfs/bafybeic7krn45dxjy4pusdwznkm6xo4madluwbz7ep7gun6wzjhdhperle",
            1 => "https://ipfs.io/ipfs/bafybeihh5do3sqgukeo3cjge46phryqqrh4dd5t43bs2uuqmdahikccn5y",
            2 => "https://ipfs.io/ipfs/bafybeibypknhnao637iwt63c2w7qv6gaz4b57igt3tc3p3nmzu6bedjcya",
            3 => "https://ipfs.io/ipfs/bafybeiaxbvl7t7mvv77pkq7jh5xr2yg3yhq3smeaubmja3xglgdrp76aoy",
            _ => "https://ipfs.io/ipfs/bafybeidtkgestuvpft52q3pr5xpepcwhbaeukeu7iy33qdkqqd67y35uhq",
        };
    
        // mint the token
        Base::mint(e, &to, token_id);
    
        // set the metadata given by the token_id
        Base::set_token_metadata(e, token_id, String::from_str(e, uri), String::from_str(e, "SpaceMan"), String::from_str(e, "SPACE"));
    }
    
}

#[contractimpl]
impl NonFungibleToken for SpaceMan {
    type ContractType = Base;

    fn owner_of(e: &Env, token_id: u32) -> Address {
        Self::ContractType::owner_of(e, token_id)
    }

    fn transfer(e: &Env, from: Address, to: Address, token_id: u32) {
        Self::ContractType::transfer(e, &from, &to, token_id);
    }

    fn transfer_from(e: &Env, spender: Address, from: Address, to: Address, token_id: u32) {
        Self::ContractType::transfer_from(e, &spender, &from, &to, token_id);
    }

    fn balance(e: &Env, iss: Address) -> u32 {
        Self::ContractType::balance(e, &iss)
    }

    fn approve(
        e: &Env,
        approver: Address,
        approved: Address,
        token_id: u32,
        live_until_ledger: u32,
    ) {
        Self::ContractType::approve(e, &approver, &approved, token_id, live_until_ledger);
    }

    fn approve_for_all(e: &Env, iss: Address, operator: Address, live_until_ledger: u32) {
        Self::ContractType::approve_for_all(e, &iss, &operator, live_until_ledger);
    }

    fn get_approved(e: &Env, token_id: u32) -> Option<Address> {
        Self::ContractType::get_approved(e, token_id)
    }

    fn is_approved_for_all(e: &Env, iss: Address, operator: Address) -> bool {
        Self::ContractType::is_approved_for_all(e, &iss, &operator)
    }

    fn name(e: &Env) -> String {
        Self::ContractType::name(e)
    }

    fn symbol(e: &Env) -> String {
        Self::ContractType::symbol(e)
    }

    fn token_uri(e: &Env, token_id: u32) -> String {
        Self::ContractType::token_uri(e, token_id)
    }
}
