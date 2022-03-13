use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    log::sol_log_compute_units,
    msg,
    pubkey::Pubkey,
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct PurchaseStruct {
    pub purchase_id: String,
    pub name: String,
    pub price: u32,
    pub date: String,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct PersonStruct {
    pub person_id: String,
    pub first_name: String,
    pub last_name: String,
    pub purchases: Vec<PurchaseStruct>,
}



entrypoint!(process_instruction);
pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    sol_log_compute_units();
    msg!("Program entry");

    Ok(())
}
