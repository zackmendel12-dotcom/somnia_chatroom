# Managing NFT Metadata with IPFS | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Building DApps](/developer/building-dapps)
  3. [Tokens and NFTs](/developer/building-dapps/tokens-and-nfts)



# Managing NFT Metadata with IPFS

In this guide, you will rely on an IPFS workflow for ERC721 collections on Somnia. 

This guide will walk you through how \- You will prepare and upload artwork to IPFS via Pinata. \- Generate clean, wallet/marketplace-friendly metadata JSON \- Upload the metadata to IPFS via Pinata Cloud \- Deploy a Solidity contract that stores the metadata URIs onchain (for each token) \- Mint your NFTs.

All metadata resides on IPFS, while only the URIs (pointers) are stored onchain.

Please note that this guide provides a Smart Contract option for fully onchain metadata.

## 

Concepts You Should Know

  * [IPFS](https://ipfs.tech/) (InterPlanetary File System) is a “Content Addressed Storage Network”. Files are addressed by their CID (content identifier). If any bit changes, the CID changes, and it is great for integrity and verifiability.

  * [Pinata](https://pinata.cloud/): Pinata pins your files to IPFS and keeps them available. You’ll get CIDs (content identifiers) that never change for the same content.

  * TokenURI: an ERC721 method that returns a URL (often an ipfs:// URI) pointing to a JSON file describing the NFT token (name, description, image, attributes, etc.).

  * Per token URI vs `baseURI`:

    * Per token URI (this guide): store the full JSON URI onchain for each token with ERC721URIStorage. Easiest and most flexible.

    * `baseURI` pattern: compute tokenURI = baseURI + tokenId (no per token storage). Cheaper for large drops, but requires sequential naming.




## 

Prerequisites

  * MetaMask is configured for a Somnia RPC and has sufficient funds for gas.

  * Node.js ≥ 18 (only if you’ll run the helper scripts below).

  * Pinata account and a JWT (recommended): Get your JWT on Pinata

    * `Pinata Dashboard → API Keys → New Key → choose Admin/Scoped as needed → copy JWT`.




## 

Prepare Images

If your art varies wildly in size or format, normalize once for a consistent user experience. Create an `assets` directory for your images. Run the node script below, targeting the `assets` directory to give uniformity to your images.

Install the dependencies:

Copy
    
    
    npm i sharp fast-glob

Run the script:

Copy
    
    
    // scripts/resize.js
    import fg from "fast-glob";
    import sharp from "sharp";
    import { mkdirSync } from "fs";
    import path from "path";
    
    const INPUT = "assets/raw-images"; // put your original images here
    const OUTPUT = "assets/images";
    
    mkdirSync(OUTPUT, { recursive: true });
    
    const files = (await fg(`${INPUT}/*.{png,jpg,jpeg,webp}`)).sort();
    for (let i = 0; i < files.length; i++) {
      const out = path.join(OUTPUT, `${i}.png`);
      await sharp(files[i]).resize(1024, 1024, { fit: "cover" }).toFile(out);
    }
    console.log("Normalized images written to", OUTPUT);

## 

Recommended Folder Structure

Copy
    
    
    project/
      assets/
        images/
          0.png
          1.png
          2.png
          ...
        metadata/
          0.json
          1.json
          2.json
          ...
      scripts/
        resize.js              
        pinata.ts              (Pinata SDK init)
        upload-images.ts       (pin images folder → IMAGES_CID)
        make-metadata.ts       (generate JSON → uses IMAGES_CID)
        upload-metadata.ts     (pin metadata folder → METADATA_CID)

  * `images/` contain consistent dimensions and formats (e.g., 1024×1024 PNG).

  * `metadata/` contain one JSON per token ID, matching the filename (e.g., 7.json for tokenId 7).




## 

Upload Images to IPFS via Pinata

Install Pinata SDK:

Copy
    
    
    npm i pinata dotenv

Initialise Pinata using your JWT credentials:

Copy
    
    
    // pinata.ts
    import 'dotenv/config'
    import { PinataSDK } from 'pinata'
    
    
    export const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT!,               // from Pinata “API Keys”
      pinataGateway: process.env.PINATA_GATEWAY!,       // e.g. myxyz.mypinata.cloud
    })

Create a `.env` file in your project root:

Copy
    
    
    PINATA_JWT=eyJhbGciOi...        # your Pinata JWT (keep secret)
    PINATA_GATEWAY=myxyz.mypinata.cloud
    IMAGES_CID=                     # leave blank until you upload images

Upload the images directory and get the root CID:

Copy
    
    
    // scripts/upload-images.ts
    import 'dotenv/config'
    import { pinata } from './pinata'
    import fs from 'node:fs/promises'
    import path from 'node:path'
    import { File } from 'node:buffer'
    
    const DIR = 'assets/images'
    
    async function main() {
      const names = (await fs.readdir(DIR))
        .filter(n => n.match(/\.(png|jpg|jpeg|webp)$/i))
        .sort((a, b) => Number(a.split('.')[0]) - Number(b.split('.')[0]))
        
      const files: File[] = []
      
      for (const name of names) {
        const bytes = await fs.readFile(path.join(DIR, name))
        files.push(new File([bytes], name)) // uploaded as a single folder
      }
      
      const res = await pinata.upload.public.fileArray(files)
      // res.cid is the directory root CID
      console.log('Images CID:', res.cid)
    }
    
    main().catch(console.error)

Run the following command to upload the images:

Copy
    
    
    node dist/scripts/upload-images.js
    # => Images CID: bafybe...

Copy the CID into `.env` as `IMAGES_CID=....`

## 

Generate Metadata JSON

Each *.json should follow the de facto standards:

Copy
    
    
    {
      "name": "NFTTest #0",
      "description": "A clean ERC-721 on Somnia with per-token metadata.",
      "image": "ipfs://IMAGES_CID/0.png",
      "external_url": "https://your-site.example",
      "attributes": [
        { "trait_type": "Edition", "value": 0 }
      ]
    }
    

Install `fast-glob` library:

Copy
    
    
    npm i fs-extra fast-glob

Run the script below to generate a file per image:

Copy
    
    
    / scripts/make-metadata.js
    import fg from "fast-glob";
    import { writeJSON, mkdirs } from "fs-extra";
    import path from "path";
    
    
    const IMAGES_CID = process.env.IMAGES_CID || "bafy..."; // paste from Step 2
    const OUT_DIR = "assets/metadata";
    
    
    sync function main() {
      await mkdirs(OUT_DIR)
      const imgs = (await fg('assets/images/*.{png,jpg,jpeg,webp}')).sort((a, b) =>
        Number(path.basename(a).split('.')[0]) - Number(path.basename(b).split('.')[0])
      )
    
    
      for (const p of imgs) {
        const id = Number(path.basename(p).split('.')[0])
        const json = {
          name: `NFTTest #${id}`,
          description: 'ERC-721 on Somnia with Pinata-hosted IPFS metadata.',
          image: `ipfs://${IMAGES_CID}/${id}.png`,
          attributes: [{ trait_type: 'Edition', value: id }]
        }
        await writeJSON(path.join(OUT_DIR, `${id}.json`), json, { spaces: 2 })
      }
      console.log('Metadata written to', OUT_DIR)
    }
    main().catch(console.error)
    

To create the metadata files, run the command:

Copy
    
    
    node dist/scripts/make-metadata.js

## 

Upload Metadata to IPFS

Upload the metadata folder to generate the `METADATA_CID`

Copy
    
    
    // scripts/upload-metadata.ts
    import { pinata } from './pinata'
    import fs from 'node:fs/promises'
    import path from 'node:path'
    import { File } from 'node:buffer'
    
    const DIR = 'assets/metadata'
    async function main() {
      const names = (await fs.readdir(DIR))
        .filter(n => n.endsWith('.json'))
        .sort((a, b) => Number(a.split('.')[0]) - Number(b.split('.')[0]))
      const files: File[] = []
      for (const name of names) {
        const bytes = await fs.readFile(path.join(DIR, name))
        files.push(new File([bytes], name, { type: 'application/json' }))
      }
      const res = await pinata.upload.public.fileArray(files)
      console.log('Metadata CID:', res.cid)
    }
    main().catch(console.error)

Run the command:

Copy
    
    
    node dist/scripts/upload-metadata.js
    # => Metadata CID: bafybe...

Your tokenURI format is now: `ipfs://<METADATA_CID>/<tokenId>.json `Make sure the script uploads `assets/metadata` and records the printed Metadata CID; you’ll mint with: `ipfs://<METADATA_CID>/<tokenId>.json`

## 

NFT Smart Contract

We’ll use `ERC721URIStorage` Smart Contract and mint with full URIs. Paste this into Remix as `NFTTest.sol`

NFTTest.sol

Copy
    
    
    // SPDX-License-Identifier: MIT
    // Compatible with OpenZeppelin Contracts ^5.4.0
    pragma solidity ^0.8.27;
    
    
    import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
    import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
    
    contract NFTTest is ERC721, ERC721URIStorage, Ownable {
        uint256 private _nextTokenId;
    
        constructor(address initialOwner)
            ERC721("NFTTest", "NFTT")
            Ownable(initialOwner)
        {}
    
        function _baseURI() internal pure override returns (string memory) {
            return "https://ipfs.io"; // only affects relative paths
        }
    
        function safeMint(address to, string memory uri)
            public
            onlyOwner
            returns (uint256)
        {
            uint256 tokenId = _nextTokenId++;
            _safeMint(to, tokenId);
            _setTokenURI(tokenId, uri); // store full URI (e.g., ipfs://CID/0.json)
            return tokenId;
        }
    
        function tokenURI(uint256 tokenId)
            public
            view
            override(ERC721, ERC721URIStorage)
            returns (string memory)
        {
            return super.tokenURI(tokenId);
        }
    
    
        function supportsInterface(bytes4 interfaceId)
            public
            view
            override(ERC721, ERC721URIStorage)
            returns (bool)
        {
            return super.supportsInterface(interfaceId);
        }
    }

## 

Contract Walkthrough

### 

Imports 

  * `ERC721` is the core NFT logic (ownership, transfers, approvals).

  * `ERC721URIStorage` adds per-token storage for URIs via `_setTokenURI`.

  * `Ownable` simple admin model; exposes onlyOwner for minting control.




`ERC721URIStorage` is the most straightforward way to store a token’s exact URI. For large drops, consider using a baseURI pattern to save storage gas; otherwise, this is perfect for flexible, explicit URIs.

State (_nextTokenId) is the sequential ID counter starting at 0. First mint → tokenId = 0, then 1, 2, … etc

### 

Constructor

Initializes collection name/symbol and sets the owner to `initialOwner` (the only account allowed to mint).

### 

_baseURI()

Returns https://ipfs.io. This is only used if you mint with relative paths (e.g., /ipfs/CID/7.json). If you mint with absolute ipfs://… URIs (recommended), this value is ignored.

### 

safeMint(to, uri):

Owner-only mint. Creates a new token ID, mints safely (checking receiver contracts implement IERC721Receiver), and stores the exact uri string for that token via _setTokenURI.

### 

Compile and Deploy using Remix. Follow this [guide](/developer/building-dapps/tokens-and-nfts/create-erc20-tokens)

Copy the deployed contract address. 

## 

How To Mint NFTs (Per Token URIs)

n Remix (Deployed Contracts):

  * Call `safeMint(to, uri)` where:

    * `to` is the recipient address (can be yours).

    * `uri` is `ipfs://<METADATA_CID>/<id>.json` (e.g., `ipfs://bafy.../0.json`).




Then call `tokenURI(0)` to confirm the stored URI. 

If you prefer scripts for multiple mints, you can write a script to Batch Mint using Hardhat, for example:

Copy
    
    
    scripts/mint.ts (Hardhat)
    import { ethers } from "hardhat";
    
    
    const CONTRACT = "0xYourDeployedAddress";
    const RECEIVER = "0xReceiver";
    const METADATA_CID = "bafy...";
    
    
    async function main() {
      const nft = await ethers.getContractAt("NFTTest", CONTRACT);
      for (let id = 0; id < 10; id++) {
        const uri = `ipfs://${METADATA_CID}/${id}.json`;
        const tx = await nft.safeMint(RECEIVER, uri);
        await tx.wait();
        console.log(`Minted #${id} → ${uri}`);
      }
    }
    main().catch(console.error);
    

## 

Validation

To validate everything end to end, first do quick gateway smoke tests by opening `https://ipfs.io/ipfs/<IMAGES_CID>/0.png` and `https://ipfs.io/ipfs/<METADATA_CID>/0.json` in a browser to confirm the image and JSON are reachable. Next, call `tokenURI(0)` on your contract and verify it returns `ipfs://<METADATA_CID>/0.json`. Finally, check in a wallet or marketplace UI that the NFT renders correctly using the `ipfs://` image URI embedded in the JSON. 

## 

MetadataOptional Fully Onchain Metadata

Smart Contract

If your art is small (SVG) or you only need text metadata, you can **encode metadata JSON on-chain** :

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.27;
    
    import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
    import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
    import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
    
    contract OnchainMeta is ERC721, Ownable {
        using Strings for uint256;
        uint256 private _id;
    
        constructor(address owner_) ERC721("Onchain", "ONC") Ownable(owner_) {}
    
        function mint(address to) external onlyOwner returns (uint256) {
            uint256 tokenId = _id++;
            _safeMint(to, tokenId);
            return tokenId;
        }
    
        function tokenURI(uint256 tokenId) public view override returns (string memory) {
            _requireOwned(tokenId);
            // Example: trivial, static image via SVG data URI
            string memory image = string(
                abi.encodePacked(
                    "data:image/svg+xml;base64,",
                    Base64.encode(
                        bytes(
                            string(
                                abi.encodePacked(
                                    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>",
                                    "<rect width='512' height='512' fill='black'/>",
                                    "<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='48'>#",
                                    tokenId.toString(),
                                    "</text></svg>"
                                )
                            )
                        )
                    )
                )
            );
    
            bytes memory json = abi.encodePacked(
                '{"name":"Onchain #', tokenId.toString(),
                '","description":"Fully on-chain metadata","image":"', image, '"}'
            );
    
            return string(abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(json)
            ));
        }
    }

**Trade-offs**

  * No external dependencies; URIs are immutable, always available.

  * Higher gas (long strings), limited to compact media (SVG/text). For large images, prefer IPFS.




[PreviousCreate ERC721 NFT Collections](/developer/building-dapps/tokens-and-nfts/create-erc721-nft-collections)[NextUsing Native SOMI/STT](/developer/building-dapps/tokens-and-nfts/using-native-somi-stt)

Last updated 1 month ago
