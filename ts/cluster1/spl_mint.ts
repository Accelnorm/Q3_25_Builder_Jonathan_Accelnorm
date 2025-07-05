import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../turbin3-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address from the previous step
const mint = new PublicKey("A4AFqpzoB1jKa7s5mKmgZRqhupptP8zomvuKNJDXfnc5");

(async () => {
    try {
        // Create an ATA for my wallet
        const recipient = new PublicKey("CYsondJ7bQ4za6ztrUVcb1s4hjZap95QSReeAFDgBD9u");
        
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,              // Payer of the transaction
            mint,                 // Token mint address
            recipient             // Owner of the ATA
        );
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint tokens to the ATA
        const mintTx = await mintTo(
            connection,
            keypair,              // Payer of the transaction
            mint,                 // Token mint address
            ata.address,          // Destination token account
            keypair,              // Mint authority (from spl_init.ts)
            100n * token_decimals // Amount to mint (100 tokens)
        );
        console.log(`Your mint txid: ${mintTx}`);
        console.log(`View transaction: https://explorer.solana.com/tx/${mintTx}?cluster=devnet`);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()

/*
Output:
Your ata is: 8hA2m2fJRhhNqWxY6tCkDwPt4aCt6jfErnidHy86zbye
Your mint txid: 3egxnSmCT9t8ki8A4ufyoC7qZiUTTWFx1i3rqsetZMoBUXYtPBkLyTuKv92zN1puVZ3L32WQKqUSy99MjkhHHnR9
View transaction: https://explorer.solana.com/tx/3egxnSmCT9t8ki8A4ufyoC7qZiUTTWFx1i3rqsetZMoBUXYtPBkLyTuKv92zN1puVZ3L32WQKqUSy99MjkhHHnR9?cluster=devnet
*/