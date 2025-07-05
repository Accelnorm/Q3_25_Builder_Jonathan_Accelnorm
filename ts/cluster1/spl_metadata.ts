import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args,
    findMetadataPda
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address from the previous step
const mint = publicKey("A4AFqpzoB1jKa7s5mKmgZRqhupptP8zomvuKNJDXfnc5")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Define the accounts needed for metadata creation
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            metadata: findMetadataPda(umi, { mint })[0],
            mint: mint,
            mintAuthority: signer,
            payer: signer,
            updateAuthority: signer,
        }

        // Define the metadata content
        let data: DataV2Args = {
            name: "OPOS",
            symbol: "OPOS",
            uri: "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json",
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null
        }

        // Define the instruction arguments
        let args: CreateMetadataAccountV3InstructionArgs = {
            data: data,
            isMutable: true,
            collectionDetails: null
        }

        // Create the metadata account transaction
        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        // Send and confirm the transaction
        let result = await tx.sendAndConfirm(umi);
        
        console.log("✅ Metadata created successfully!");
        console.log("Transaction signature:", bs58.encode(result.signature));
        console.log(`View transaction: https://explorer.solana.com/tx/${bs58.encode(result.signature)}?cluster=devnet`);
        console.log(`View token mint: https://explorer.solana.com/address/${mint}?cluster=devnet`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();

/*
Output:
Metadata created successfully!
Transaction signature: qEFXUYarixeLk1gDFjtb8TMJCHqyJGEazJBW2JEPuJ3vVWoBh8CYVUzQEuKMGh1rp6iSNqqFLCapTSiL9cUWxpE
View transaction: https://explorer.solana.com/tx/qEFXUYarixeLk1gDFjtb8TMJCHqyJGEazJBW2JEPuJ3vVWoBh8CYVUzQEuKMGh1rp6iSNqqFLCapTSiL9cUWxpE?cluster=devnet
View token mint: https://explorer.solana.com/address/A4AFqpzoB1jKa7s5mKmgZRqhupptP8zomvuKNJDXfnc5?cluster=devnet
*/