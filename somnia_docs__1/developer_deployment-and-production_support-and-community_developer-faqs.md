# Developer FAQs | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [DEPLOYMENT AND PRODUCTION](/developer/deployment-and-production)
  3. [SUPPORT AND COMMUNITY](/developer/deployment-and-production/support-and-community)



# Developer FAQs

Welcome to the **Somnia Network Developer FAQ**! This guide is designed for developers building on Somnia's high-performance EVM-compatible blockchain. It covers environment setup, smart contract development, network configuration, APIs, optimization, testing, advanced features, troubleshooting, and resources.

* * *

## 

Development Environment Setup

#### 

Getting Started

**Q: What development tools are compatible with Somnia?**

A: Somnia is fully EVM-compatible, so you can use all standard EVM development tools:

  * **Hardhat** : Most popular framework for smart contract development

  * **Foundry** : Fast, portable toolkit written in Rust

  * **Remix IDE** : Browser-based development environment

  * **Truffle** : Comprehensive development suite

  * **Brownie** : Python-based development framework




Simply configure these tools to connect to Somnia's network endpoints.

**Q: How do I configure my development environment for Somnia?**

A: Add Somnia network configuration to your project.

For Hardhat ([hardhat.config.js](https://docs.somnia.network/developer/how-to-guides/basics/deploy-and-verify-a-smart-contract-on-somnia-using-hardhat)):

For Foundry ([foundry.toml](https://docs.somnia.network/developer/how-to-guides/basics/deploy-a-smart-contract-on-somnia-testnet-using-foundry)):

1

#### 

How do I get test tokens for development?

To obtain **Somnia Test Tokens (STT)** for development:

  1. Discord Method:

     * Join the Somnia Discord server

     * Go to the #dev-chat channel

     * Tag @emma_odia (Somnia DevRel)

     * Request test tokens with your wallet address

  2. Email Method:

     * Email [[email protected]](/cdn-cgi/l/email-protection)

     * Include your project description and GitHub profile

     * Provide your testnet wallet address\

  3. Google cloud web3 faucet [here](https://cloud.google.com/application/web3/faucet/somnia/shannon)




**Q: What are the network parameters for Somnia?**

A: Key network information:

Testnet:

  * **Chain ID** : 50312

  * **RPC URL** : <https://dream-rpc.somnia.network>[](https://dream-rpc.somnia.network)

  * **Block Explorer** : <https://shannon-explorer.somnia.network/>[](https://shannon-explorer.somnia.network/)

  * **Currency** : STT (Somnia Test Token)




Mainnet:

  * **Chain ID** : 5031

  * **RPC URL** : <https://api.infra.mainnet.somnia.network>[](https://api.infra.mainnet.somnia.network)

  * **Block Explorer** : <https://explorer.somnia.network/>[](https://explorer.somnia.network/)

  * **Currency** : SOMI (Somnia Token)




Alternatively you can check out <https://chainlist.org/>[](https://chainlist.org/) for other RPC options.

* * *

## 

Smart Contract Development

#### 

Contract Deployment

**Q: How do I deploy smart contracts to Somnia?**

A: Deployment process is identical to EVM, you can deploy with:

  * Hardhat

  * Foundry

  * Remix




**Q: Are there any differences in smart contract development for Somnia?**

A: Somnia is fully EVM-compatible, so:

  * All Solidity features work identically

  * Same gas mechanics and opcodes

  * Compatible with OpenZeppelin libraries

  * Standard deployment tools work

  * Bonus: Much lower gas costs and faster execution




**Q: How do I verify contracts on Somnia?**

A: Contract verification process:

  1. Via Block Explorer: Use the verification tab on Somnia Explorer

  2. Via API Verification [here](https://thecrossangle.notion.site/Somnia-Explorer-Smart-Contract-Verification-2622a5298c5f80f79611db3071989e19)




#### 

Gas Optimization

**Q: How do gas fees work on Somnia?**

A: Somnia uses a dynamic gas fee model:

  * Payment Token: Fees are paid in **SOMI** tokens on Mainnet and STT on Testnet

  * Base Fee: Dynamically adjusted based on block execution time

  * Minimum Gas: 21,000 gas for basic transactions

  * Validator Rewards: 50% of gas fees go to validators

  * Volume Discounts: Available for high-volume applications




Tip: Gas costs are significantly lower than Ethereum mainnet due to Somnia's optimized architecture, you can check out more on somnia gas model[ here](https://docs.somnia.network/developer/somnia-gas-differences-to-ethereum).

**Q: Should I optimize for gas on Somnia?**

A: While gas optimization is still good practice:

  * Less Critical: Lower fees mean less pressure for extreme optimization

  * Focus on Features: More room for feature-rich applications

  * User Experience: Better UX with lower transaction costs

  * Standard Practices: Still follow Solidity best practices




* * *

## 

Network Configuration

#### 

RPC Providers

**Q: What RPC providers are available for Somnia?**

A: Multiple RPC providers support Somnia:

Primary Providers:

  * **Ankr** : Enterprise-grade RPC infrastructure



  * **Stakely** : High-performance RPC services

  * **Official** : Somnia's native RPC endpoints




Configuration example:

Copy
    
    
    // Multiple RPC endpoints for redundancy
    const rpcUrls = [
      "https://somnia-json-rpc.stakely.io",
      "https://api.infra.mainnet.somnia.network",
      "https://somnia-rpc.publicnode.com"
    ];

Check out [chainlist](https://chainlist.org/) for more RPC Endpoints

**Q: How do I configure MetaMask for Somnia?**

  * This guide helps configure metamask for [Somnia Netwrok](https://docs.somnia.network/get-started/connect-your-wallet-to-mainnet)




* * *

## 

APIs and Integration

#### 

JSON-RPC APIs

**Q: What APIs does Somnia support?**

A: Somnia supports standard EVM JSON-RPC APIs:

Core Methods:

  * **eth_** * methods: Used for blockchain-related operations, such as querying data, sending transactions, or interacting with smart contracts.

  * **net_** * methods: Provide information about the network, such as its status or connected peers.

  * **web3_** * methods: Offer details about the client, such as version or configuration.

  * **debug_** * methods: Enable debugging features on supported nodes, often used for troubleshooting or advanced analysis.




**Q: Are there any API rate limits?**

  * High Performance: Designed for enterprise-level usage

  * Standard Limits: Follow typical JSON-RPC conventions




**Q: How do I integrate Somnia with my existing dApp?**

A: Integration is straightforward due to EVM compatibility.

Follow the viem setup on the [`docs`](https://docs.somnia.network/developer/how-to-guides/intermediate/how-to-connect-to-somnia-network-via-viem-library#how-to-use-viem)

* * *

## 

Performance and Optimization

#### 

Somnia's Architecture

**Q: What makes Somnia so fast?**

A: Somnia achieves 1M+ TPS through four key innovations:

  1. Accelerated Sequential Execution: Compiled EVM bytecode translates to highly optimized native code.

  2. IceDB: Ultra-fast database with 15-100 nanosecond read/write operations and built-in snapshotting.

  3. MultiStream Consensus: Proof-of-stake BFT protocol that decouples data production from consensus, enabling parallel processing.

  4. Advanced Compression: Streaming compression and BLS signature aggregation for high compression ratios.




Learn more [here.](https://docs.somnia.network/concepts/somnia-blockchain/overview)

**Q: What are the performance details I should be aware of?**

  * TPS Capacity: 1,000,000+ transactions per second

  * Finality Time: Sub-second transaction finality

  * DEX Performance: 1 million swaps per second

  * Concurrent Users: Designed for millions of users

  * Block Time: Optimized for real-time applications




* * *

## 

Testing and Deployment

#### 

Testing Strategies

**Q: How do I test my contracts on Somnia?**

A: Use standard testing frameworks with Somnia configuration.

Hardhat Testing:

Copy
    
    
    // test/Contract.test.js
    const { expect } = require("chai");
    const { ethers } = require("hardhat");
    
    describe("Contract", function () {
      let contract;
      
      beforeEach(async function () {
        const Contract = await ethers.getContractFactory("YourContract");
        contract = await Contract.deploy();
        await contract.deployed();
      });
      
      it("Should work on Somnia", async function () {
        // Test your contract logic
        expect(await contract.someFunction()).to.equal(expectedValue);
      });
    });

Foundry Testing:

Copy
    
    
    // test/Contract.t.sol
    pragma solidity ^0.8.0;
    
    import "forge-std/Test.sol";
    import "../src/Contract.sol";
    
    contract ContractTest is Test {
        Contract public contractInstance;
        
        function setUp() public {
            contractInstance = new Contract();
        }
        
        function testSomniaCompatibility() public {
            // Test contract functionality
            assertEq(contractInstance.getValue(), expectedValue);
        }
    }

**Q: What should I test specifically for Somnia?**

A: Focus on these areas:

  * Gas Usage: Verify lower gas consumption

  * Performance: Test high-frequency operations

  * Real-time Features: Validate sub-second finality

  * Batch Operations: Test transaction batching

  * Event Emission: Verify real-time event handling




#### 

Common Error Messages

**Q: What do common error messages mean?**

Common errors and solutions:

Insufficient funds for gas

  * Solution: Add SOMI tokens to your wallet

  * Check: Verify gas price and limit settings




Execution reverted

  * Solution: Check contract conditions and requirements

  * Debug: Use transaction simulation tools




Network error

  * Solution: Verify RPC endpoint and internet connection

  * Fallback: Try alternative RPC providers




* * *

## 

Resources and Support

#### 

Documentation and Guides

**Q: Where can I find comprehensive documentation?**

A: Official resources:

  * Main Documentation[ here](https://docs.somnia.network/)

  * GitHub: Official repositories and code examples




**Q: How do I get developer support?**

A: Multiple support channels:

Discord Community:

  * Join the official Somnia [Discord](https://discord.com/invite/somnia)

  * #dev-chat channel for technical discussions

  * Real-time support from community and team




Email Support:

  * [[email protected]](/cdn-cgi/l/email-protection)

  * Include project details and specific questions

  * Response within 24-48 hours




GitHub Issues:

  * Report bugs and feature requests

  * Contribute to open-source tools

  * Community-driven solutions




#### 

Learning Resources

**Q: What learning resources are available for Somnia development?**

A: Educational materials:

Tutorials:

  * Smart contract deployment [guides](https://docs.somnia.network/developer/how-to-guides)

  * dApp integration examples

  * Performance optimization tutorials

  * Real-time application development




Code Examples:

  * GitHub repositories with sample projects

  * Integration templates for popular frameworks

  * Best practice implementations




Community Content:

  * Developer blog posts

  * Video tutorials

  * Workshop recordings

  * Conference presentations




#### 

Contributing to the Ecosystem

**Q: How can I contribute to Somnia's developer ecosystem?**

A: Ways to contribute:

Build Applications:

  * Create innovative dApps leveraging Somnia's performance

  * Open-source your projects for community benefit

  * Share integration patterns and best practices




Community Participation:

  * Answer questions in Discord

  * Write tutorials and guides

  * Speak at developer events

  * Mentor new developers




Technical Contributions:

  * Contribute to open-source tools

  * Report and fix bugs

  * Improve documentation

  * Create developer tooling




Feedback and Testing:

  * Test new features and provide feedback

  * Report performance issues

  * Suggest improvements

  * Participate in beta programs




* * *

### 

Congratulations! You now have comprehensive knowledge for developing on Somnia Network. This FAQ covered environment setup, contract development and verification, API integration, optimization, testing, advanced features, troubleshooting, and resources.

* * *

[PreviousGeneral FAQs](/developer/deployment-and-production/support-and-community/general-faqs)

Last updated 21 days ago
