import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from '@solana/spl-token';
import wallet from "../turbin3-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        // Create a new token mint
        const mint = await createMint(
            connection,           // Connection to Solana devnet
            keypair,             // Payer
            keypair.publicKey,   // Mint authority
            null,                // Freeze authority (null = no freeze capability)
            6                    // Decimals
        );
        
        console.log(`✅ Token mint created successfully!`);
        console.log(`Mint address: ${mint.toBase58()}`);
        console.log(`View on Solana Explorer: https://explorer.solana.com/address/${mint.toBase58()}?cluster=devnet`);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()

/*
Output:
✅ Token mint created successfully!
Mint address: A4AFqpzoB1jKa7s5mKmgZRqhupptP8zomvuKNJDXfnc5
View on Solana Explorer: https://explorer.solana.com/address/A4AFqpzoB1jKa7s5mKmgZRqhupptP8zomvuKNJDXfnc5?cluster=devnet
*/