import { createPersonAccount, createUserKey, getWalletKeyPair } from "./lib";



const main = async () => {

    const programPath = '../dist/program/soldemocontract-keypair.json';
    const userPath = 'keys/userkeypair.json';

    // 1. (TS) Create useraccount
    await createUserKey(userPath);

    // 2. (TS) Get pubkey from useraccount
    const userKeyPair = await getWalletKeyPair(userPath);

    // 3. (TS) Create account owned by program that has 
    // holds the useraccount pubkey and a Person struct
    createPersonAccount()

};




main();