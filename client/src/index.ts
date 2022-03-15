import {
    createPersonAccount,
    createUserKey,
    establishConnection,
    getProgramKeypair,
    getWalletKeyPair
} from "./lib";



const main = async () => {

    const programPath = '../dist/program/soldemocontract-keypair.json';
    const userPath = 'keys/userkeypair.json';
    // TODO: run-once logic here, otherwise user account is unfunded.
    // 1. (TS) Create useraccount
    // await createUserKey(userPath);

    // 2. (TS) Get pubkey from useraccount
    const userKeyPair = await getWalletKeyPair(userPath);
    const connection = await establishConnection();
    const resp = await connection.getBalance(userKeyPair.publicKey);
    console.log(resp);
    return 0;

    // 3. (TS) Create account owned by program that  
    // holds the useraccount pubkey and a Person struct

    const programKeypair = await getProgramKeypair(connection, programPath);
    createPersonAccount(connection, userKeyPair, programKeypair.publicKey)

};






main();