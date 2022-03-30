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
import { personAccSize } from './instancedata';


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
    const FIXED_ACC_SEED = 'A unique seed that would normally be securely generated';
    const personAccountKey = await PublicKey.createWithSeed(
        payer.publicKey,
        FIXED_ACC_SEED,
        programId,
    );

    // Minimum size per Solana docs https://docs.solana.com/developing/programming-model/accounts
    const PERSON_ACC_BYTES = 2 * personAccSize();
    console.log('BYTES', PERSON_ACC_BYTES)
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

/**
 * 
 * @param connection 
 * @param keypair Account to airdrop funds to
 * @param multipleOfMin 
 * @returns Account balance after airdrop
 */
export const airdropMin = async (connection: Connection, keypair: Keypair, multipleOfMin = 2): Promise<number> => {
    // Minimum size per Solana docs https://docs.solana.com/developing/programming-model/accounts
    const MIN_ACC_BYTES = 128;
    const MIN_EXEMPT_LAMPORTS = await connection.getMinimumBalanceForRentExemption(
        MIN_ACC_BYTES,
    );
    const AIRDROP_AMOUNT = multipleOfMin * MIN_EXEMPT_LAMPORTS;
    console.log('amount', AIRDROP_AMOUNT);
    const airdropTx = await connection.requestAirdrop(keypair.publicKey, AIRDROP_AMOUNT);
    await connection.confirmTransaction(airdropTx);

    const balance = await connection.getBalance(keypair.publicKey);
    return balance;
}