use soroban_sdk::{contract, contractimpl, Env, Address, Symbol, symbol_short, Vec, Val, IntoVal, String};

const OWNER: Symbol = symbol_short!("OWNER");
const SPACEMAN: Symbol = symbol_short!("SpaceMan");

#[contract]
pub struct ISS;

#[contractimpl]
impl ISS {
    pub fn __constructor(e: &Env, owner: Address) {
        e.storage().instance().set(&OWNER, &owner);
    }

    pub fn set_nft_contract(e: &Env, nft_contract: Address) {
        let owner: Address = e.storage().instance().get(&OWNER).expect("OWNER not set");
        owner.require_auth();

        e.storage().instance().set(&SPACEMAN, &nft_contract);
    }

    pub fn get_nft_contract(e: &Env) -> Address {
        e.storage()
            .instance()
            .get(&SPACEMAN)
            .expect("SpaceMan contract not set")
    }

    pub fn mint_nft(e: &Env, to: Address, token_id: u32) {
        let nft_contract = Self::get_nft_contract(e);

        let mut args = Vec::new(e);
        args.push_back(to.into_val(e));
        args.push_back(token_id.into_val(e));

        e.invoke_contract::<()>(
            &nft_contract,
            &symbol_short!("mint"),
            args,
        );
    }

    pub fn get_address(e: &Env) -> Address {
        e.current_contract_address()
    }
}