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
import { personAccSize, personInstance } from './instancedata';
import { PersonSchema, PersonStruct } from './schemata';


export const storeRandomKeypair = async (filePath: string, overwrite = false): Promise<Keypair> => {
    const fileExists = await fs.exists(filePath)
    if (!fileExists) {
        const newPair = Keypair.generate();
        await fs.writeFile(filePath, `[${newPair.secretKey.toString()}]`, { encoding: 'utf8' });
    }
    const secretKeyString = await fs.readFile(filePath, { encoding: 'utf8' });
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const ret = Keypair.fromSecretKey(secretKey);
    console.log(`Key stored at ${filePath}, public key ${ret.publicKey}`);
    return ret;

};


export const createPersonAccount = async (connection: Connection, payer: Keypair, programId: PublicKey) => {
    const FIXED_ACC_SEED = 'A unique trdetrseed thdwadawdated';
    const personAccountKey = await PublicKey.createWithSeed(
        payer.publicKey,
        FIXED_ACC_SEED,
        programId,
    );

    // Minimum size per Solana docs https://docs.solana.com/developing/programming-model/accounts
    const PERSON_ACC_BYTES = 20 * personAccSize();
    // Fund the account for rent
    await airdropMin(connection, personAccountKey, PERSON_ACC_BYTES);
    // Check if the person account has already been created
    const personAccount = await connection.getAccountInfo(personAccountKey);
    if (personAccount === null) {
        console.log(
            'Creating account', personAccountKey.toBase58(),
        );
        const lamports = await connection.getMinimumBalanceForRentExemption(
            PERSON_ACC_BYTES,
        );
        const transaction = new Transaction().add(
            SystemProgram.createAccountWithSeed({
                fromPubkey: payer.publicKey,
                basePubkey: payer.publicKey,
                seed: FIXED_ACC_SEED,
                newAccountPubkey: personAccountKey,
                lamports,
                space: PERSON_ACC_BYTES,
                programId,
            }),
        );
        await sendAndConfirmTransaction(connection, transaction, [payer]);
    } else {
        console.log(
            'Account exists', personAccountKey.toBase58(),
        );
    }
    return personAccountKey;
};

export const establishConnection = async () => {
    const rpcUrl = 'http://127.0.0.1:8899';
    const connection = new Connection(rpcUrl, 'confirmed');
    const version = await connection.getVersion();
    console.log('Connection to cluster established:', rpcUrl);
    return connection;
};

export const getProgramKeypair = async (connection: Connection, programPath: string) => {
    const secretKeyString = await fs.readFile(programPath, { encoding: 'utf8' });
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const programKeyPair = Keypair.fromSecretKey(secretKey)
    console.log(`Program ID ${programKeyPair.publicKey.toString()}`);
    return programKeyPair;
};

export const runContract = async (
    connection: Connection,
    programId: PublicKey,
    contractStorage: PublicKey,
    senderKeypair: Keypair
) => {

    const uArr = borsh.serialize(
        PersonSchema,
        personInstance());

    const instruction = new TransactionInstruction({
        keys: [
            {
                pubkey: senderKeypair.publicKey,
                isSigner: true,
                isWritable: true
            },
            {
                pubkey: contractStorage,
                isSigner: false,
                isWritable: true
            },
        ],
        programId,
        data: Buffer.from(uArr)
    });
    await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [senderKeypair],
    );
};

/**
 * 
 * @param connection 
 * @param keypair Account to airdrop funds to
 * @param multipleOfMin 
 * @returns Account balance after airdrop
 */
export const airdropMin = async (connection: Connection, publicKey: PublicKey, accBytes = 128): Promise<number> => {
    // Minimum size per Solana docs https://docs.solana.com/developing/programming-model/accounts
    Math.max(128, accBytes);
    const MIN_ACC_BYTES = 128;
    const MIN_EXEMPT_LAMPORTS = await connection.getMinimumBalanceForRentExemption(
        MIN_ACC_BYTES,
    );
    const AIRDROP_AMOUNT = 2 * MIN_EXEMPT_LAMPORTS;
    const airdropTx = await connection.requestAirdrop(publicKey, AIRDROP_AMOUNT);
    await connection.confirmTransaction(airdropTx);

    const balance = await connection.getBalance(publicKey);
    return balance;
}

export const checkAccount = async (connection: Connection, accountKey: PublicKey) => {
    // Check that the contract stored the person struct that it was sent 
    const resp = await connection.getParsedAccountInfo(accountKey);
    console.log('Check hashmap account', accountKey.toBase58())
    const parsedData = resp.value.data as ParsedAccountData;
    console.log(parsedData.parsed);
    // const programData = parsedData.parsed.info.programData as string;
    // console.log(programData);
    // var binary_string = Buffer.from(programData, 'base64');
    // const deserialized = borsh.deserialize(
    //     PersonSchema,
    //     PersonStruct,
    //     binary_string
    // );
    // console.log(deserialized);
}