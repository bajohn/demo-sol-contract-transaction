import {
    airdropMin,
    createPersonAccount,
    establishConnection,
    getProgramKeypair,
    storeRandomKeypair,
} from "./lib";
const assert = require('assert');



const main = async () => {

    const programPath = '../dist/program/soldemocontract-keypair.json';
    const userPath = 'keys/userkeypair.json';
    // 1. (TS) Create useraccount
    // 2. (TS) Get pubkey from useraccount
    // await createUserKey(userPath);
    const userKeyPair = await storeRandomKeypair(userPath);

    const connection = await establishConnection();
    const balance = await airdropMin(connection, userKeyPair.publicKey);
    console.log('final bal', balance);


    // 3. (TS) Create account owned by program that  
    // holds the useraccount pubkey and a Person struct
    const programKeypair = await getProgramKeypair(connection, programPath);
    createPersonAccount(connection, userKeyPair, programKeypair.publicKey)

};






main();