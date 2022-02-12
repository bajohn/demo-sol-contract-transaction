
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



