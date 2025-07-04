import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json";

const SYSTEM_PROGRAM_ID = new PublicKey("11111111111111111111111111111111");
const MPL_CORE_PROGRAM_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const mintCollection = new PublicKey("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2");
// create the mint Account for the new asset
const mintTs = Keypair.generate();

// We're going to get our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a Solana devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {commitment: "confirmed"});

// Create our program
const program: Program<Turbin3Prereq> = new Program(IDL, provider);

// Create the PDA for our enrollment account
const account_seeds = [
    Buffer.from("prereqs"),
    keypair.publicKey.toBuffer(),
];
const [account_key, _account_bump] = PublicKey.findProgramAddressSync(account_seeds, program.programId);

// Create the PDA for the collection authority
const collection_seeds = [
    Buffer.from("collection"),
    mintCollection.toBuffer(),
];
const [collection_authority, _collection_bump] = PublicKey.findProgramAddressSync(collection_seeds, program.programId);

// Execute both transactions
(async () => {
    try {
        // Execute the initialize transaction
        const initTxhash = await program.methods
            .initialize("Accelnorm")
            .accountsPartial({
                user: keypair.publicKey,
                account: account_key,
                systemProgram: SYSTEM_PROGRAM_ID,
            })
            .signers([keypair])
            .rpc();
        console.log(`Initialize Success! Check out your TX here:
https://explorer.solana.com/tx/${initTxhash}?cluster=devnet`);

        // Execute the submitTs transaction
        const submitTxhash = await program.methods
            .submitTs()
            .accountsPartial({
                user: keypair.publicKey,
                account: account_key,
                mint: mintTs.publicKey,
                collection: mintCollection,
                authority: collection_authority,
                mplCoreProgram: MPL_CORE_PROGRAM_ID,
                systemProgram: SYSTEM_PROGRAM_ID,
            })
            .signers([keypair, mintTs])
            .rpc();
        console.log(`Submit Success! Check out your TX here:
https://explorer.solana.com/tx/${submitTxhash}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();