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
pub struct SampleStruct {
    pub basic: String,
}



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
    instruction_data: &[u8],
) -> ProgramResult {
    sol_log_compute_units();
    msg!("Program entry");

    let accounts_iter = &mut accounts.iter();
    let sender_account = next_account_info(accounts_iter)?;
    let person_account = next_account_info(accounts_iter)?;

    let person_res = PersonStruct::try_from_slice(instruction_data);
    let mut person_acc = match person_res {
        Ok(T) => {
            msg!("Deserialized program input successfully");
            // let togo = PersonStruct {
            //     person_id: String::from("hi"),
            //     first_name: String::from("randy"),
            //     last_name: String::from("johnson"),
            //     purchases: vec![],
            // };
            // msg!(&togo.person_id);

            let togo = SampleStruct {
                basic: String::from("hii"),
            };
            msg!(&togo.basic);

            

            // let mut cur = person_account.data.borrow_mut();

            //person_account.data.try_borrow_mut_data() = *instruction_data;
            // msg!(&cur.len().to_string());
            // for i in instruction_data {
            //     cur[*i as usize] = instruction_data[*i as usize];
            // }

            togo.serialize(&mut &mut person_account.data.borrow_mut()[..])?;
        }
        Err(E) => {
            msg!("Failed to deserialize program input");
        }
    };

    let stored_person_res = PersonStruct::try_from_slice(&person_account.data.borrow());
    let stored_person = match stored_person_res {
        Ok(T) => {
            msg!("Deserialized stored person successfully");
            msg!(&T.person_id);
        }
        Err(E) => {
            msg!("Failed to deserialize stored person");
        }
    };

    Ok(())
}
