# Gasless Transactions with Thirdw | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Building DApps](/developer/building-dapps)
  3. [Account Abstraction](/developer/building-dapps/account-abstraction)



# Gasless Transactions with Thirdw

This tutorial demonstrates how to build a gasless NFT minting application on Somnia using Thirdweb's Account Abstraction infrastructure. Users can mint NFTs without holding STT tokens by using **Smart Accounts** with **sponsored transactions**.

## 

Prerequisites

  * Basic knowledge of React and Next.js

  * A Thirdweb account and API key

  * A deployed ERC721 NFT Smart Contract on Somnia




### 

What You'll Build

A web application where users can:

  * Connect using email or social accounts (via in-app wallets)

  * Mint NFTs without paying gas fees

  * View their NFT balance

  * Experience seamless Web3 interactions




## 

Create a Next.js Project

Copy
    
    
    npx create-next-app@latest somnia-gasless-nft --typescript --tailwind --app
    cd somnia-gasless-nft

## 

Install Thirdweb SDK

Copy
    
    
    npm install thirdweb

## 

Set Up Environment Variables

Create a .env.local file in your project root:

Copy
    
    
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here

Get your Client ID from the[ Thirdweb Dashboard](https://thirdweb.com/dashboard/settings).

## 

Deploy a Simple NFT Contract

If you haven't already, deploy this simple ERC721 contract on Somnia.

SimpleNFT.sol

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.20;
    
    import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    
    contract SimpleNFT is ERC721 {
        uint256 private _tokenIdCounter;
        
        constructor() ERC721("SimpleNFT", "SNFT") {}
        
        function mint(address to) public {
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++;
            _safeMint(to, tokenId);
        }
        
        function totalSupply() public view returns (uint256) {
            return _tokenIdCounter;
        }
    }

## 

Create Constants Configuration

Now we need to set up our configuration file that will handle all the blockchain connections and smart account setup. This file will:

  * Initialize the Thirdweb client with your API key

  * Set up both traditional wallet and in-app wallet options

  * Define the smart account infrastructure




Create a new folder called constants in your project root, then create `constants/index.ts.`

constants

Copy
    
    
    import { createThirdwebClient, getContract } from 'thirdweb';
    import { SmartWalletOptions, inAppWallet } from 'thirdweb/wallets';
    import { somniaTestnet } from 'thirdweb/chains';
    
    // Validate environment variables
    const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
    
    if (!clientId) {
      throw new Error('No client ID provided');
    }
    
    // Initialize Thirdweb client
    export const client = createThirdwebClient({
      clientId: clientId,
    });
    
    // Use Somnia testnet
    export const chain = somniaTestnet;
    
    // Your deployed NFT contract address
    export const nftContractAddress = '0x...'; // UPDATE with your contract address
    
    // Get contract instance
    export const nftContract = getContract({
      address: nftContractAddress,
      chain,
      client,
    });
    
    // Account Abstraction configuration for standard wallet connection
    export const accountAbstraction: SmartWalletOptions = {
      chain,
      sponsorGas: true, // Enable gasless transactions
    };
    
    // Smart Account infrastructure addresses
    const FACTORY_ADDRESS = '0x4be0ddfebca9a5a4a617dee4dece99e7c862dceb'; // Thirdweb Account Factory
    
    // In-app wallet configuration with smart accounts
    export const wallets = [
      inAppWallet({
        smartAccount: {
          chain: somniaTestnet,
          sponsorGas: true,
          factoryAddress: FACTORY_ADDRESS,
        },
      }),
    ];

## 

Create the Main Minting Page

This is the main component where users will interact with your NFT minting application. We'll break this into three parts: imports and setup, the component logic, and the UI rendering.

### 

Imports and Component Setup

First, let's set up our imports and initialize the component. Create `app/page.tsx`.

page.tsx

Copy
    
    
    'use client';
    import { useState } from 'react';
    import { balanceOf, totalSupply } from 'thirdweb/extensions/erc721';
    import {
      ConnectButton,
      TransactionButton,
      useActiveAccount,
      useReadContract,
    } from 'thirdweb/react';
    import { prepareContractCall } from 'thirdweb';
    import {
      accountAbstraction,
      client,
      nftContract,
      wallets,
    } from '../constants';
    import Link from 'next/link';

These imports provide:

  * `ERC721 Extensions`: Functions to read NFT data (balance and total supply)

  * `React Components`: Pre-built UI components for wallet connection and transactions

  * `Hooks`: To access the connected account and read blockchain data

  * All our constants from the previous step




### 

Component Logic and Data Fetching

Now let's add the component logic that handles wallet connections and reads blockchain data:

page.tsx

Copy
    
    
    export default function Home() {
      // Get the currently connected account (either smart account or regular wallet)
      const account = useActiveAccount();
      
      // State for showing transaction progress
      const [txStatus, setTxStatus] = useState<string>('');
    
      // Read the total number of NFTs minted from the contract
      const { data: totalMinted } = useReadContract(totalSupply, {
        contract: nftContract,
      });
    
      // Read how many NFTs the connected user owns
      const { data: userBalance } = useReadContract(balanceOf, {
        contract: nftContract,
        owner: account?.address!,
        queryOptions: { enabled: !!account }, // Only fetch when account is connected
      });

  * `useActiveAccount()`: Gets the connected wallet/smart account

  * `useState`: Manages transaction status messages

  * `useReadContract`: Automatically fetches and updates blockchain data




The queries will re-fetch automatically when accounts change or transactions complete

## 

User Interface

Now let's build the complete UI that users will interact with

page.tsx

Copy
    
    
    'use client';
    import { useState } from 'react';
    import { balanceOf, totalSupply } from 'thirdweb/extensions/erc721';
    import {
      ConnectButton,
      TransactionButton,
      useActiveAccount,
      useReadContract,
    } from 'thirdweb/react';
    import { prepareContractCall } from 'thirdweb';
    import {
      accountAbstraction,
      client,
      nftContract,
      wallets,
    } from '../../constants';
    import Link from 'next/link';
    
    const GaslessHome: React.FC = () => {
      const account = useActiveAccount();
      const [txStatus, setTxStatus] = useState<string>('');
    
      // Get total supply
      const { data: totalMinted } = useReadContract(totalSupply, {
        contract: nftContract,
      });
    
      // Get user's balance
      const { data: userBalance } = useReadContract(balanceOf, {
        contract: nftContract,
        owner: account?.address!,
        queryOptions: { enabled: !!account },
      });
    
      return (
        <div className='flex flex-col items-center min-h-screen p-8'>
          {/* Main Title */}
          <h1 className='text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-12 text-zinc-100'>
            Gasless NFT Minting on Somnia
          </h1>
    
          {/* Wallet Connection Button */}
          <ConnectButton
            client={client}
            wallets={wallets}                    // Enables in-app wallet options
            accountAbstraction={accountAbstraction} // Enables smart accounts for regular wallets
            connectModal={{
              size: 'wide',
              title: 'Choose Your Login Method',
              welcomeScreen: {
                title: 'Gasless NFT Minting',
                subtitle: 'Sign in to mint NFTs without gas fees',
              },
            }}
            appMetadata={{
              name: 'Somnia NFT Minter',
              url: 'https://somnia.network',
            }}
          />
    
          {/* NFT Display and Minting Section */}
          <div className='flex flex-col mt-8 items-center'>
            {/* Stats Card */}
            <div className='mb-8 p-8 bg-zinc-900 rounded-2xl shadow-xl'>
              <div className='text-center mb-6'>
                <p className='text-3xl font-bold text-white mb-2'>
                  {totalMinted?.toString() || '0'}
                </p>
                <p className='text-sm text-zinc-400'>Total NFTs Minted</p>
              </div>
    
              {/* NFT Visual Representation */}
              <div className='flex items-center justify-center'>
                <div className='w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg'>
                  <div className='text-white text-center'>
                    <p className='text-6xl font-bold mb-2'>NFT</p>
                    <p className='text-sm opacity-80'>SimpleNFT on Somnia</p>
                  </div>
                </div>
              </div>
            </div>
    
            {/* Conditional Rendering: Connected vs Not Connected */}
            {account ? (
              <div className='flex flex-col items-center gap-4'>
                {/* User Stats */}
                <div className='text-center'>
                  <p className='font-semibold text-lg'>
                    You own{' '}
                    <span className='text-green-400'>
                      {userBalance?.toString() || '0'}
                    </span>{' '}
                    NFTs
                  </p>
                  <p className='text-sm text-zinc-400 mt-1'>
                    Wallet: {account.address.slice(0, 6)}...{account.address.slice(-4)}
                  </p>
                </div>
    
                {/* Transaction Status */}
                {txStatus && (
                  <p className='text-sm text-yellow-400 mb-2'>{txStatus}</p>
                )}
    
                {/* Mint Button */}
                <TransactionButton
                  transaction={() =>
                    prepareContractCall({
                      contract: nftContract,
                      method: 'function mint(address to)',
                      params: [account.address],
                    })
                  }
                  onError={(error) => {
                    console.error('Transaction error:', error);
                    setTxStatus('');
                    
                    // User-friendly error messages
                    let errorMessage = 'Transaction failed';
                    
                    if (error.message?.includes('insufficient funds')) {
                      errorMessage = 'Insufficient funds for gas';
                    } else if (error.message?.includes('rejected')) {
                      errorMessage = 'Transaction rejected by user';
                    } else if (error.message?.includes('500')) {
                      errorMessage = 'Service temporarily unavailable';
                    }
                    
                    alert(`Error: ${errorMessage}`);
                  }}
                  onTransactionSent={(result) => {
                    console.log('Transaction sent:', result.transactionHash);
                    setTxStatus('Transaction submitted! Waiting for confirmation...');
                  }}
                  onTransactionConfirmed={async (receipt) => {
                    console.log('Transaction confirmed:', receipt);
                    setTxStatus('');
                    alert('NFT minted successfully!');
                  }}
                  className='px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg'
                >
                  Mint NFT (Gasless)
                </TransactionButton>
              </div>
            ) : (
              {/* Not Connected State */}
              <p className='text-center w-full mt-10 text-zinc-400'>
                Connect your wallet to mint NFTs without gas fees!
              </p>
            )}
          </div>
    
          {/* Navigation - Removed since this is now the home page */}
        </div>
      );
    };

### 

Understanding the UI Components

`ConnectButton`: This component handles both connection methods:

  * `In-App Wallets`: Users can sign in with email, Google, Apple, etc.

  * `Traditional Wallets`: Users can connect MetaMask, WalletConnect, etc.




Both methods automatically create smart accounts for gasless transactions

`TransactionButton`: This component prepares and sends the transaction automatically. Handling all wallet interactions and confirmations, and provides callbacks for different transaction states. It also shows loading states automatically

Error Handling: The component provides user-friendly error messages instead of technical blockchain errors, improving the user experience.

## 

Update the Layout

The layout file wraps your entire application and is where we set up the Thirdweb provider. This provider is essential as it:

  * Manages wallet connections across your app

  * Handles blockchain interactions

  * Provides React hooks for reading blockchain data

  * Manages transaction states




Update `app/layout.tsx`:

layout.tsx

Copy
    
    
    import type { Metadata } from "next";
    import { Inter } from "next/font/google";
    import "./globals.css";
    import { ThirdwebProvider } from "thirdweb/react";
    
    const inter = Inter({ subsets: ["latin"] });
    
    export const metadata: Metadata = {
      title: "Gasless NFT Minting on Somnia",
      description: "Mint NFTs without gas fees using Account Abstraction",
    };
    
    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <html lang="en">
          <body className={inter.className}>
            <ThirdwebProvider>
              <main className="min-h-screen bg-zinc-950 text-white">
                {children}
              </main>
            </ThirdwebProvider>
          </body>
        </html>
      );
    }

## 

Conclusion

You've successfully built a gasless NFT minting application on Somnia! This implementation leverages Thirdweb's Account Abstraction to provide a seamless Web3 experience where users can interact with blockchain without holding native tokens.

For more advanced features and updates on Somnia support, check:

  * [Thirdweb Account Abstraction Guide](https://portal.thirdweb.com/connect/account-abstraction)




### 

Resources

  * [Live Demo](https://nextjs-thirdweb-somnia.vercel.app/)




[PreviousAccount Abstraction](/developer/building-dapps/account-abstraction)[NextSmart Wallet App with Thirdweb](/developer/building-dapps/account-abstraction/smart-wallet-app-with-thirdweb)

Last updated 4 months ago
