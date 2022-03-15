import {
    createPersonAccount,
    createProgramAccount,
    createUserKey,
    establishConnection,
    getProgramKeypair,
    getWalletKeyPair
} from "./lib";



const main = async () => {

    const programPath = '../dist/program/soldemocontract-keypair.json';
    const userPath = 'keys/userkeypair.json';

    // 1. (TS) Create useraccount
    await createUserKey(userPath);

    // 2. (TS) Get pubkey from useraccount
    const userKeyPair = await getWalletKeyPair(userPath);


    // 3. (TS) Create account owned by program that  
    // holds the useraccount pubkey and a Person struct
    const connection = await establishConnection();
    const programKeypair = await getProgramKeypair(connection, programPath);
    createPersonAccount(connection, userKeyPair, programKeypair.publicKey)

};






main();