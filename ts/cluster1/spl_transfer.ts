import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../turbin3-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address from previous steps
const mint = new PublicKey("A4AFqpzoB1jKa7s5mKmgZRqhupptP8zomvuKNJDXfnc5");

// Recipient address
const to = new PublicKey("6BP1Gbj69ouYeg7T9pgznifqgDseHtegiPciucXBeXUp");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        );

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
        );

        // Transfer the new token to the "toTokenAccount" we just created
        const tx = await transfer(
            connection,
            keypair,
            fromTokenAccount.address,
            toTokenAccount.address,
            keypair.publicKey,
            50 * Math.pow(10, 6) // Transfer 50 tokens (accounting for 6 decimals)
        );

        console.log(`✅ Transfer completed successfully!`);
        console.log(`From ATA: ${fromTokenAccount.address.toBase58()}`);
        console.log(`To ATA: ${toTokenAccount.address.toBase58()}`);
        console.log(`Transaction signature: ${tx}`);
        console.log(`View transaction: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
        
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();

/*
Output:
Transfer completed successfully!
From ATA: 8hA2m2fJRhhNqWxY6tCkDwPt4aCt6jfErnidHy86zbye
To ATA: GAG9PA1S1WW66CPMvtkuc1MPfkptV51NuRJYMP6EQzmP
Transaction signature: 3uyDKAkWhCfT7UcP2NdGczTrMBrz1J6kiAwy7YXjYnhqTcTqNMfcjRoYmAaDJ2T1xQqMBz2EMT7D7QoHfteLRecG
View transaction: https://explorer.solana.com/tx/3uyDKAkWhCfT7UcP2NdGczTrMBrz1J6kiAwy7YXjYnhqTcTqNMfcjRoYmAaDJ2T1xQqMBz2EMT7D7QoHfteLRecG?cluster=devnet
*/