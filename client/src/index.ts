import os from 'os';
import fs from 'mz/fs';

import {
    Keypair,
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction,
    TransferParams,
    ParsedAccountData,
} from '@solana/web3.js';
import * as borsh from 'borsh';
import * as crypto from 'crypto';



const main = async () => {

    const programPath = '../dist/program/soldemocontract-keypair.json';
    const userPath = 'keys/userkeypair.json';

    await createUserKey(userPath);
};


const createUserKey = async (filePath: string): Promise<string> => {
    const newPair = Keypair.generate();
    console.log(`New key stored at ${filePath}, public key ${newPair.publicKey}`);
    fs.writeFile(filePath, `[${newPair.secretKey.toString()}]`, { encoding: 'utf8' });
    return filePath;
};

main();