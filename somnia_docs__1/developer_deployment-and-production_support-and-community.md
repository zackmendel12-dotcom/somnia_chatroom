# General FAQs | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [DEPLOYMENT AND PRODUCTION](/developer/deployment-and-production)
  3. [SUPPORT AND COMMUNITY](/developer/deployment-and-production/support-and-community)



# General FAQs

This comprehensive FAQ covers everything you need to know about Somnia Network, from blockchain basics to advanced development topics. Whether you're new to blockchain or an experienced developer, you'll find answers to common questions about Somnia's high-performance Layer 1 blockchain.

* * *

## 

Beginner's Guide

#### 

What is Blockchain?

Q: What is a blockchain?

A: A blockchain is a distributed digital ledger that records transactions across multiple computers in a way that makes it nearly impossible to change, hack, or cheat the system. Each "block" contains a cryptographically secured list of transaction records, and these blocks are linked together in chronological order to form a "chain."

Q: How does Somnia Network work?

A: Somnia is a high-performance, cost-efficient EVM-compatible Layer 1 blockchain capable of processing over 1,000,000 transactions per second (TPS) with sub-second finality. It's designed for real-time mass-consumer applications like games, social applications, and metaverses, all running fully on-chain.

Q: What makes blockchain different from traditional databases?

A: Unlike traditional databases that are controlled by a central authority:

  * Decentralization: No single point of control or failure

  * Immutability: Once data is recorded, it cannot be easily altered

  * Transparency: All transactions are visible to network participants

  * Consensus: Network participants must agree on the validity of transactions

  * Cryptographic Security: Advanced encryption protects data integrity




Q: What is EVM compatibility?

A: EVM (Ethereum Virtual Machine) compatibility means that Somnia can run the same smart contracts and applications that work on Ethereum, making it easy for developers to migrate or deploy existing Ethereum applications on Somnia.

Q: What are the main benefits of using Somnia?

A:

  * High Performance: Over 1 million TPS with sub-second finality

  * Cost Efficiency: Lower transaction fees compared to other networks

  * Real-time Applications: Suitable for gaming, social apps, and metaverses

  * Developer Friendly: EVM compatibility for easy migration

  * Scalability: Built to serve millions of users simultaneously




* * *

## 

End-User Guide

#### 

Digital Wallets and Transactions

Q: What is a digital wallet?

A: A digital wallet is a software application that allows you to store, send, and receive cryptocurrencies. It contains your private keys (which prove ownership of your funds) and public addresses (which others can use to send you funds).

Q: How do I set up a wallet for Somnia?

A: Since Somnia is EVM-compatible, you can use popular Ethereum wallets like:

  * MetaMask (browser extension and mobile app)

  * Any EVM Compatible Wallet.



  * WalletConnect-compatible wallets




Simply add Somnia's network configuration to your existing wallet.

Q: What are transaction fees on Somnia?

A: Transaction fees (also called "gas fees") on Somnia are significantly lower than many other blockchains due to its high-performance architecture. Fees are paid in SOMI for mainnet and STT for testnet and vary based on transaction complexity.

Q: How long do transactions take?

A: Somnia offers sub-second finality, meaning most transactions are confirmed in less than one second, making it ideal for real-time applications.

Q: What can I do on Somnia Network?

A: You can:

  * Transfer tokens between wallets

  * Interact with decentralized applications (dApps)

  * Participate in gaming and social applications

  * Use DeFi (Decentralized Finance) protocols

  * Create and trade NFTs (Non-Fungible Tokens)

  * Participate in metaverse experiences

  * Build Real-Time Application




#### 

Security Best Practices

Q: How do I keep my wallet secure?

A:

  * Never share your private keys or seed phrase

  * Use hardware wallets for large amounts



  * Only use official wallet applications

  * Double-check addresses before sending transactions

  * Keep your wallet software updated




* * *

## 

Developer Guide

#### 

Smart Contracts and Development

Q: What programming languages can I use for smart contracts on Somnia?

A: Since Somnia is EVM-compatible, you can use:

  * Solidity: The most popular smart contract language




All existing Ethereum development tools work with Somnia.

Q: How do I set up a development environment for Somnia?

A: You can use standard Ethereum development tools. Use the stepper below to explore common tools and their roles.

Hardhat: Popular development framework for compiling, testing, and deploying smart contracts.

Truffle: Comprehensive development suite that includes testing, migrations, and contract management. Remix: Browser-based IDE ideal for quick prototyping and testing. Foundry: Fast, portable toolkit for building, testing, and fuzzing smart contracts.

Q: What are decentralized applications (dApps)?

A: dApps are applications that run on blockchain networks instead of centralized servers. They use smart contracts for backend logic and typically have frontend interfaces that users interact with through their wallets.

Q: How do I get test tokens for development?

A: To get Somnia Token (STT) for development on Somnia Testnet:

Join the Somnia Discord server, Go to the #dev-chat channel, Tag @emma_odia (Somnia DevRel) Request test tokens

Alternatively, You can request for test tokens [here](https://cloud.google.com/application/web3/faucet/somnia/shannon), limited to 1 STT per day.

Q: What development resources are available?

A:

  * Documentation: https://docs.somnia.network/

  * GitHub: Official repositories and examples

  * Discord: Community support and developer chat

  * APIs: Standard Ethereum JSON-RPC APIs




#### 

Deployment and Testing

Q: How do I deploy smart contracts to Somnia?

A: Use the same process as Ethereum deployment. Steps:

  * Compile your contracts.

  * Configure your deployment script with Somnia network details.

  * Deploy using your preferred tool (Hardhat, Truffle, etc.)

  * Verify contracts on Somnia's block explorer.




Q: Are there any differences in gas optimization for Somnia?

A: While gas optimization principles remain the same, Somnia's high performance and lower fees mean:

  * Less pressure for extreme gas optimization

  * More room for feature-rich applications

  * Better user experience with lower transaction costs




For more details on Somnia gas model, check [here](https://docs.somnia.network/developer/somnia-gas-differences-to-ethereum)

* * *

## 

Technical Reference

#### 

Infrastructure

Q: What APIs are available for developers?

A: Somnia supports standard Ethereum JSON-RPC APIs, including:

  * eth_* methods for blockchain interaction

  * net_* methods for network information

  * web3_* methods for client information

  * WebSocket support for real-time updates




Q: What consensus algorithm does Somnia use?

A: Somnia uses MultiStream Consensus, an advanced consensus mechanism optimized for high throughput and low latency. This consensus algorithm is specifically designed to achieve over 1 million TPS with sub-second finality.

Q: How does Somnia achieve such high performance?

A: Somnia's performance comes from:

  * Accelerated Sequential Execution - Through compiled EVM bytecode that achieves execution speeds close to hand-written C++ contracts.

  * IceDB - A custom database with 15-100 nanosecond read/write operations and built-in snapshotting.

  * MultiStream Consensus - A proof-of-stake BFT protocol inspired by Autobahn BFT that decouples data production from consensus.

  * Advanced Compression Techniques - Streaming compression and BLS signature aggregation for massive transaction throughput




#### 

Network Limits and Performance

Q: What are the transaction throughput limits on Somnia?

A: Somnia Network is designed to handle over 1,000,000 transactions per second (TPS) with sub-second finality. The network can process up to 1 million ERC-20 swaps per second.

Q: What are the gas limits and fees on Somnia?

A: Somnia uses a dynamic gas fee model with the following characteristics:

  * Minimum Gas: 21,000 gas for basic transactions (same as Ethereum)

  * Base Fee: Dynamically adjusted based on block execution time

  * Volume Discounts: Available for high-volume users

  * Validator Adjustable: Base fees can be adjusted by validators

  * Payment Token: Fees are paid in STT for testnet and SOMI for mainnet




For more details on Somnia gas model, check [here](https://docs.somnia.network/developer/somnia-gas-differences-to-ethereum)

Q: Are there any block size or transaction limits?

A: Somnia uses advanced compression techniques to optimize block space:

  * Transaction Compression: Advanced algorithms to reduce transaction data size



  * Efficient Processing: Optimized to handle millions of transactions without bottlenecks

  * No Artificial Limits: The network is built to scale with demand




Q: What are the validator requirements and limits?

A: To become a Somnia validator, you must meet these requirements:

  * Staking Requirement: 5,000,000 SOMI tokens minimum.



  * Slashing Risk: Validators are subject to slashing for malicious behavior.




Q: Are there API rate limits for developers?

A: While specific API rate limits aren't publicly documented, Somnia provides:

  * **Standard JSON-RPC APIs:** Following **Somnia compatibility standards**

  * WebSocket Support: For real-time data streaming.




Q: What are the theoretical performance limits?

  * **TPS Capacity** : Over 1,000,000 transactions per second.

  * **Finality Time** : Sub-second transaction finality.

  * **DPS Performance** : Capable of handling high-volume decentralized exchange operations.

  * **Scalability** : Built to serve millions of concurrent users.

  * **Compression Efficiency** : Advanced techniques to maximize throughput




**For More Details** : Check the complete performance analysis and comparisons with other blockchains [here](https://docs.somnia.network/litepaper/problem#the-current-state)

#### 

Security and Best Practices

Q: What security measures should developers implement?

A:

  * Smart Contract Audits: Have contracts reviewed by security experts

  * Testing: Comprehensive unit and integration testing

  * Access Controls: Implement proper permission systems

  * Upgrade Patterns: Use secure upgrade mechanisms

  * Input Validation: Validate all user inputs

  * Reentrancy Protection: Prevent reentrancy attacks




Q: How do I monitor my applications on Somnia?

A: Use:

  * [Block Explorers](https://explorer.somnia.network/): View transactions and contract interactions

  * Monitoring Tools: Set up alerts for important events

  * Logging: Implement comprehensive application logging

  * Analytics: Track usage patterns and performance metrics




Q: What are the network endpoints for Somnia?

A: Network configuration details including RPC endpoints, chain IDs, and other connection parameters can be found in the official documentation at <https://docs.somnia.network/get-started/connect-your-wallet-to-mainnet>[](https://docs.somnia.network/get-started/connect-your-wallet-to-mainnet)

Q: How do I contribute to the Somnia ecosystem?

A:

  * Build Applications: Create dApps that leverage Somnia's capabilities

  * Community Participation: Join Discord and contribute to discussions

  * Documentation: Help improve developer resources

  * Bug Reports: Report issues through official channels

  * Open Source: Contribute to open-source tools and libraries




This FAQ is regularly updated with the latest information about Somnia Network. For the most current technical details, always refer to the official Somnia documentation at https://docs.somnia.network/

Congratulations, you have successfully mastered the fundamentals of Somnia Network! 🎉

[PreviousAPIs](/developer/deployment-and-production/ecosystem/ecosystem-tools/apis)[NextDeveloper FAQs](/developer/deployment-and-production/support-and-community/developer-faqs)

Last updated 25 days ago
