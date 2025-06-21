#![cfg(test)]

extern crate std;

use soroban_sdk::{ testutils::Address as _, Address, Env, String };

use crate::contract::{ SpaceMan, SpaceManClient };

#[test]
fn initial_state() {
    let env = Env::default();

    let contract_addr = env.register(SpaceMan, (Address::generate(&env),));
    let client = SpaceManClient::new(&env, &contract_addr);

    assert_eq!(client.name(), String::from_str(&env, "SpaceMan"));
}

// Add more tests bellow
