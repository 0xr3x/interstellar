// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Stellar Soroban Contracts ^0.2.0
#![no_std]

use soroban_sdk::{Address, contract, contractimpl, Env, String, Symbol, symbol_short};
use stellar_non_fungible::{Base, NonFungibleToken};

const OWNER: Symbol = symbol_short!("OWNER");

#[contract]
pub struct SpaceMan;

#[contractimpl]
impl SpaceMan {
    pub fn __constructor(e: &Env, owner: Address) {
        Base::set_metadata(e, String::from_str(e, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVcCgCm4-rhwsEoWf6tjvfRjGXhvHuA2BpwQ&s"), String::from_str(e, "SpaceMan"), String::from_str(e, "SPACE"));
        e.storage().instance().set(&OWNER, &owner);
    }

    pub fn mint(e: &Env, to: Address, token_id: u32) {
        let owner: Address = e.storage().instance().get(&OWNER).expect("owner should be set");
        owner.require_auth();
        Base::mint(e, &to, token_id);
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

    fn balance(e: &Env, owner: Address) -> u32 {
        Self::ContractType::balance(e, &owner)
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

    fn approve_for_all(e: &Env, owner: Address, operator: Address, live_until_ledger: u32) {
        Self::ContractType::approve_for_all(e, &owner, &operator, live_until_ledger);
    }

    fn get_approved(e: &Env, token_id: u32) -> Option<Address> {
        Self::ContractType::get_approved(e, token_id)
    }

    fn is_approved_for_all(e: &Env, owner: Address, operator: Address) -> bool {
        Self::ContractType::is_approved_for_all(e, &owner, &operator)
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
