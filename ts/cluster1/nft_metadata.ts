import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import fs from "fs"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader({address: "https://devnet.irys.xyz/",}));
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Load and upload the image
        const imageBuffer = fs.readFileSync("generug.png");
        const image = createGenericFile(imageBuffer, "generug.png", {
            contentType: "image/png"
        });
        
        const [imageUri] = await umi.uploader.upload([image]);
        console.log("Image uploaded to:", imageUri);

        const metadata = {
            name: "One More Rug",
            symbol: "OMR",
            description: "One More Rug for Turbin3 Rug Day.",
            image: imageUri,
            attributes: [
                {trait_type: 'Quality', value: 'A'},
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: imageUri
                    },
                ]
            }
        };
        // creators removed as deprecated per https://developers.metaplex.com/token-metadata/token-standard
        
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
