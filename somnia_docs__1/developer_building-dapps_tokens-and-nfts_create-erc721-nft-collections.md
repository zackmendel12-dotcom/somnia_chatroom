# Create ERC721 NFT Collections | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Building DApps](/developer/building-dapps)
  3. [Tokens and NFTs](/developer/building-dapps/tokens-and-nfts)



# Create ERC721 NFT Collections

ERC721 is the EVM compatible standard for Non Fungible Tokens, NFTs. NFTS are digital assets where each token is unique. Unlike ERC20 (fungible) tokens that are interchangeable, ERC721 tokens represent distinct items such as game assets, collectibles, tickets, certificates, or onchain identities. 

Somnia, being EVM-compatible, supports the ERC721 standard natively. ERC721 has the following functionalities:

  * Every token has a distinct `tokenId` and (optionally) distinct metadata, making it unique.

  * Wallets can own, transfer, and approve NFTs using a common interface.

  * NFTs are composable; therefore, Wallets, marketplaces, and dApps understand ERC-721 uniformly, enabling easy listing, trading, and display.

  * ERC721 has a clean base that can be extended with metadata, enumeration, royalties (ERC-2981), permit (EIP-4494), etc. 




This guide will teach you how to connect to and deploy your ERC20 Smart Contract to the Somia Network using Hardhat.

## 

Pre-requisite

  * This guide is not an introduction to Solidity Programming; you are expected to have a basic understanding of Solidity Programming.

  * To complete this guide, you will need MetaMask installed and the Somnia Network added to the list of Networks. If you have yet to install MetaMask, please follow this guide to [Connect Your Wallet](/get-started/connect-your-wallet-to-mainnet). 




The Smart Contract is minimal, production-friendly ERC-721 without royalties (no ERC-2981). Per-token tokenURI set during mint (works great with IPFS). It also demonstrates how to deploy, mint, and verify on Somnia networks.

## 

ERC721 Smart Contract 

`NFTTest.sol`

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
            return "https://ipfs.io";
        }
    
        function safeMint(address to, string memory uri)
            public
            onlyOwner
            returns (uint256)
        {
            uint256 tokenId = _nextTokenId++;
            _safeMint(to, tokenId);
            _setTokenURI(tokenId, uri);
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

Code Breakdown

Below is a breakdown explanation of the code:

### 

Imports

Copy
    
    
    import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
    import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

`ERC721` is the Core NFT standard that has all the methods that control `ownership`, `transfers`, `approvals`, and `metadata` hook.

`ERC721URIStorage` adds per-token URI storage via `_setTokenURI` and overrides `tokenURI`. ERC721URIStorage extends ERC721 to store URIs per token (costs storage gas, but very flexible).

`Ownable` is a simple access control library that enables the Smart Contract owner to set one account as the “owner”. 

### 

Contract Declaration

Copy
    
    
    contract NFTTest is ERC721, ERC721URIStorage, Ownable {
        uint256 private _nextTokenId;
        ...
    }

`_nextTokenId` is an Internal counter for new token IDs. Starts at `0` by default (since not set), so your first mint is `tokenId = 0`.

### 

Constructor

Copy
    
    
    constructor(address initialOwner)
        ERC721("NFTTest", "NFTT")
        Ownable(initialOwner)
    {}

Calls `ERC721` constructor with collection name "NFTTest" and symbol "NFTT". Initializes Ownable with `initialOwner` the address allowed to mint tokens. In this instance, the body is empty because all setup is done via parent constructors.

This ERC-721 contract follows a straightforward ownership and metadata model designed for simplicity and marketplace compatibility. The contract owner is the sole minter, and each mint assigns the next sequential identifier—beginning at 0—to the specified recipient. This ensures that token IDs remain predictable (0, 1, 2, …) and facilitates aligning your metadata files with minted tokens.

### 

Base URI

Copy
    
    
    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io";
    }

Returns a prefix used by `ERC721.tokenURI` when a token’s stored URI is relative (e.g., "/ipfs/<CID>/1.json").

In this contract you set full URIs at mint (commonly ipfs://...), which are returned as-is by `ERC721URIStorage`. So this Base URI only matters if you mint with relative paths. An example Base URI when using IPFS is then `https://ipfs.io/`

### 

Minting

Copy
    
    
    function safeMint(address to, string memory uri)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

In this contract, minting is restricted by `onlyOwner`, ensuring that only the contract owner can create new tokens. Token IDs are assigned sequentially using `_nextTokenId++`, starting from 0 and incrementing by one with each mint. The `_safeMint` function adds an extra layer of safety by checking if the recipient is a contract and, if so, requiring it to implement `IERC721Receiver` to prevent tokens from being locked. For metadata, `_setTokenURI` stores the exact URI string for each token, such as `ipfs://<CID>/1.json`, making it easy to reference unique files. The function also emits and returns the new `tokenId` upon minting. However, it’s worth noting that storing a full string per token consumes more gas; for larger drops with sequential files, a cheaper alternative is to use a base URI combined with the token ID rather than storing individual URIs.

### 

Required overrides

Copy
    
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

Because both ERC721 and ERC721URIStorage define tokenURI, Solidity requires you to pick which implementation to use. `super.tokenURI(tokenId)` resolves to ERC721URIStorage’s version, which:

  * Returns the stored URI if present.

  * Otherwise falls back to ERC721’s baseURI and tokenId behavior.




Copy
    
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

Also resolves multiple inheritance for supportsInterface (ERC165) and ensures the contract correctly reports ERC721 and metadata support.

Transfers and approvals behave exactly as the ERC721 standard specifies. Use `safeTransferFrom` by default, so the contract checks that recipients can handle NFTs, which prevents tokens from being sent to incompatible contracts. `transferFrom` is available when you are certain the recipient can accept NFTs without the receiver check, and approvals can be granted either per token with approve or globally with `setApprovalForAll`. Interface support is advertised through supportsInterface, allowing wallets, marketplaces, and indexers to recognize ERC721 core and metadata compatibility automatically.

A few best practices will keep deployments robust. Favor the `ipfs://` scheme for `metadata` and media to avoid locking yourself to a single HTTP gateway. If you expect very large drops, remember that `ERC721URIStorage` stores a full string per token, which is convenient but more expensive at scale; collections with sequential filenames can reduce costs by adopting a `baseURI` and `tokenId` pattern instead of per token URI storage.

## 

Initialize Hardhat

Copy
    
    
    mkdir somnia-nft && cd somnia-nft
    npm init -y
    npm install --save-dev hardhat typescript ts-node @types/node
    npx hardhat                              
    npm install @openzeppelin/contracts      
    npm install --save-dev @nomicfoundation/hardhat-verify @nomicfoundation/hardhat-ignition @nomicfoundation/hardhat-ignition-ethers

Create `.env`:

Copy
    
    
    PRIVATE_KEY=0xYourPrivateKey
    SOMNIA_RPC_HTTPS=https://dream-rpc.somnia.network

`hardhat.config.ts`

Copy
    
    
    import "dotenv/config";
    import "@nomicfoundation/hardhat-verify";
    import "@nomicfoundation/hardhat-ignition-ethers";
    import { HardhatUserConfig } from "hardhat/config";
    
    const config: HardhatUserConfig = {
      solidity: "0.8.28",
      networks: {
        somnia: {
          url: process.env.SOMNIA_RPC_HTTPS!,
          accounts: [process.env.PRIVATE_KEY!],
        },
      },
      sourcify: { enabled: false },
      etherscan: {
        apiKey: { somnia: process.env.SOMNIA_EXPLORER_API_KEY || "" },
        customChains: [
          {
            network: "somnia",
            chainId: 50312,
            urls: {
              apiURL: "https://shannon-explorer.somnia.network/api",
              browserURL: "https://shannon-explorer.somnia.network",
            },
          },
        ],
      },
    };
    
    export default config;
    

Add the `Smart Contract` to the Contract directory

## 

Deploy with Ignition

Create `ignition/modules/NFTTest.ts`:

Copy
    
    
    import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
    
    const NFTTestModule = buildModule("NFTTestModule", (m) => {
      const initialOwner = m.getParameter("initialOwner", "0xYourOwnerAddress");
    
      const nft = m.contract("NFTTest", [initialOwner]);
    
      return { nft };
    });
    
    export default NFTTestModule;

Deploy:

Copy
    
    
    npx hardhat ignition deploy ignition/modules/NFTTest.ts --network somnia

Copy the **deployed address** from the output.

* * *

## 

Verify Smart Contract

Copy
    
    
    npx hardhat verify --network somnia <DEPLOYED_ADDRESS> 0xYourOwnerAddress

> Ensure compiler version, optimizer, and constructor args match.

* * *

### 

Mint your collection

We’ll mint by calling `safeMint(to, uri)` **10 times** , matching your uploaded metadata files.

`scripts/mint.ts`

Copy
    
    
    import { ethers } from "hardhat";
    
    async function main() {
      const contractAddr = "<DEPLOYED_ADDRESS>";
      const nft = await ethers.getContractAt("NFTTest", contractAddr);
    
      const owner = (await ethers.getSigners())[0];
    
      // Example: 10 tokens at /ipfs/<CID>/{0..9}.json
      const CID = "<YOUR_METADATA_CID>";
      for (let i = 0; i < 10; i++) {
        const uri = `/ipfs/${CID}/${i}.json`;
        const tx = await nft.safeMint(owner.address, uri);
        console.log(`Mint tx ${i}:`, tx.hash);
        await tx.wait();
      }
    
      const lastId = await nft.callStatic.safeMint(owner.address, `/ipfs/${CID}/999.json`).catch(()=>null);
      console.log("Minted 10 tokens. Next simulated ID (no state change):", lastId ?? "N/A");
    }
    
    main().catch((e) => {
      console.error(e);
      process.exit(1);
    });

Run the project:

Copy
    
    
    npx hardhat run scripts/mint.ts --network somnia

* * *

## 

Inspect Token metadata

Read a token’s URI (e.g., tokenId `0`) and open it in your browser.

`scripts/read-uri.ts`:

Copy
    
    
    import { ethers } from "hardhat";
    
    async function main() {
      const contractAddr = "<DEPLOYED_ADDRESS>";
      const nft = await ethers.getContractAt("NFTTest", contractAddr);
      const uri = await nft.tokenURI(0);
      console.log("tokenURI(0):", uri);
    }
    
    main().catch(console.error);

Copy
    
    
    npx hardhat run scripts/read-uri.ts --network somnia

Open the printed URL (it should be `https://ipfs.io/ipfs/<CID>/0.json`) in your browser to confirm JSON and `image` render correctly.

Congratulations. 🎉 You have deployed your first ERC721 Smart Contract to the Somnia Network. 🎉

[PreviousCreate ERC20 Tokens](/developer/building-dapps/tokens-and-nfts/create-erc20-tokens)[NextManaging NFT Metadata with IPFS](/developer/building-dapps/tokens-and-nfts/managing-nft-metadata-with-ipfs)

Last updated 1 month ago
