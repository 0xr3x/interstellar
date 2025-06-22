#![cfg(test)]

extern crate std;

use soroban_sdk::{ testutils::Address as _, Address, Env, String };

use crate::contract::{ SpaceStation, SpaceStationClient };

#[test]
fn initial_state() {
    let env = Env::default();

    let contract_addr = env.register(SpaceStation, (Address::generate(&env),));
    let client = SpaceStationClient::new(&env, &contract_addr);

    assert_eq!(client.name(), String::from_str(&env, "SpaceStation"));
}

// Add more tests bellow
