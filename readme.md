
From root dir:

Background:

https://github.com/solana-labs/example-helloworld/blob/master/README.md

Start local testnet via
```
solana-test-validator
```

Build contract via:
```
cargo build-bpf --manifest-path=./sol-demo-contract/Cargo.toml --bpf-out-dir=dist/program
```


Then deploy contract via
```
solana program deploy ./dist/program/soldemocontract.so
```






Then run local client via
```
cd cw-client
npm run dev
```

Log program output with 
```
solana logs
```


Fund a wallet using 
```
solana transfer {wallet public key} 1 --allow-unfunded-recipient
solana transfer Gh3EmjisqQZLEyW6fjW1VWg82b3jmomwqr2G7285m1US 1 --allow-unfunded-recipient
```



Process to build:


1. (TS) Create useraccount
2. (TS) Get pubkey from useraccount
3. (TS) Create account owned by program that has holds the useraccount pubkey and a Person struct
4. (TS, RS) Now, have the useraccount send a transaction with a PurchaseStruct
5. (RS) Have the contract check the signed pubkey on the transaction to confirm it's from the right useraccount
6. (RS) If so, then add the purchased item to the struct
7. (TS) Verify the transaction by printing the program account

From TS side, create an account owned by the contract that has a person's pubkey