# Bridging Info | Somnia Docs

Copy

  1. [🔥Get Started](/get-started)



# Bridging Info

Somnia supports cross-chain asset transfers through two official bridge partners: Relay and Stargate Finance. These bridges enable you to move tokens between Somnia and other blockchain networks while maintaining security and minimizing fees. Whether you're bridging stablecoins, ETH, or other supported assets, this guide will walk you through the complete process.

## 

Prerequisites

  * **Wallet Setup** : MetaMask, WalletConnect-compatible wallet, or hardware wallet

  * **Network Configuration** : Somnia network added to your wallet

  * **Funded Wallet** : Source chain tokens to cover bridge fees and gas costs

  * **Basic Understanding** : Familiarity with blockchain transactions and gas fees




## 

Supported Bridges

### 

Relay Bridge

Relay is a multichain payments network that has served 5M+ users and processed $5B+ in volume across 85+ networks. It offers instant cross-chain transactions with 99.9% uptime and payments-grade reliability.

**Key Features** :

  * Instant Execution: Cross-chain transfers in 1-10 seconds

  * 75+ Networks: Extensive blockchain support including Somnia

  * Predictable Fees: Transparent fee structure with no hidden costs

  * Enterprise Grade: 99.9% uptime with automatic redundancy systems




**Supported Assets** : ETH, USDC, USDT, and other major tokens **Website** : [relay.link/bridge](https://relay.link/bridge)

### 

Stargate Finance

Stargate is a fully composable cross-chain bridge built on LayerZero that connects 50+ blockchains. It's the first bridge to solve the "bridging trilemma" by providing instant guaranteed finality, native assets, and unified liquidity.

**Key Features** :

  * Native Assets: Transfer native tokens without wrapped intermediates

  * Instant Finality: Guaranteed transaction completion

  * Unified Liquidity: Shared liquidity pools across all chains

  * LayerZero Powered: Built on robust omnichain infrastructure




**Supported Assets** : USDC, USDT, ETH, BTC, and LayerZero OFTs **Website** : [stargate.finance](https://stargate.finance/)

## 

Using Relay Bridge

1

#### 

Access Relay Bridge

Navigate to [relay.link/bridge](https://relay.link/bridge) in your web browser.

2

#### 

Connect Your Wallet

Click "Connect Wallet" and select your preferred wallet provider. Approve the connection when prompted.

3

#### 

Configure Bridge Transaction

  * Source Chain: Select the blockchain you're bridging FROM

  * Destination Chain: Select Somnia (or your target chain)

  * Token: Choose the asset you want to bridge

  * Amount: Enter the amount to transfer\




![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F427512505-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F44oX5XEgjsIITRWz2fbP%252Fuploads%252FyIjtTD8dvQhEhYEbFPqp%252Fimage.png%3Falt%3Dmedia%26token%3Df2c31757-9ecf-459f-a371-6b063fbbc3b3&width=768&dpr=4&quality=100&sign=29620b1&sv=2)

4

#### 

Review Transaction Details

Carefully review:

  * Bridge Fee: Relay's service fee

  * Gas Fee: Network transaction cost

  * Estimated Time: Usually 1-10 seconds

  * Recipient Address: Verify destination address(Your address or if you want to bridge to a different wallet.




![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F427512505-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F44oX5XEgjsIITRWz2fbP%252Fuploads%252FEfq6xft1t9ubbmoPPLuJ%252Fimage.png%3Falt%3Dmedia%26token%3Daa572d53-89ff-4d29-8343-0f316d5d1527&width=768&dpr=4&quality=100&sign=af01c547&sv=2)

5

#### 

Execute Bridge Transaction

Click "Bridge" and confirm the transaction in your wallet. The process typically involves:

  * Approval Transaction: Authorize Relay to spend your tokens (if required)

  * Bridge Transaction: Execute the cross-chain transfer

  * Confirmation: Receive tokens on destination chain




6

#### 

Verify Completion

Check your wallet balance on the destination chain. Relay provides real-time status updates during the bridging process.

## 

Using Stargate Finance

1

#### 

Access Stargate Bridge

Visit [stargate.finance](https://stargate.finance/) and click "Bridge" or "Transfer".

2

#### 

Connect Wallet & Select Networks

Connect your wallet and configure:

  * From: Source blockchain

  * To: Somnia (or destination chain)

  * Asset: Select supported token (USDC, USDT, ETH, etc.) ![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F427512505-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F44oX5XEgjsIITRWz2fbP%252Fuploads%252FKvmRGu0fGzpMlWzyPlGN%252Fimage.png%3Falt%3Dmedia%26token%3D66a534cd-1453-4b19-ac43-5076c86b1ec9&width=300&dpr=4&quality=100&sign=a3d31089&sv=2)




3

#### 

Enter Transfer Details

  * Amount: Specify transfer amount

  * Recipient: Destination wallet address (defaults to your connected wallet)




Only applicable if you are bridging to another wallet address.\

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F427512505-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F44oX5XEgjsIITRWz2fbP%252Fuploads%252FIYzm4EewTNtH3zUaNNOp%252Fimage.png%3Falt%3Dmedia%26token%3D625f507b-5583-4a90-bc24-2382ec10c39e&width=768&dpr=4&quality=100&sign=1bdd2730&sv=2)

  * Slippage: Set acceptable slippage tolerance (usually 0.1-0.5%)




4

#### 

Review Pool Information

Stargate displays:

  * Available Liquidity: Pool depth on destination chain

  * Bridge Fee: Protocol fee structure

  * Gas Estimate: Transaction costs

  * Route: Cross-chain path details




5

#### 

Execute Transfer

Confirm transaction details and sign with your wallet. 3 Stargate's ΔBridge technology ensures native asset delivery without wrapped tokens.

6

#### 

Monitor Transaction

Track your transfer through:

  * Stargate Interface: Real-time status updates

  * LayerZero Scan: Cross-chain transaction [explorer](https://layerzeroscan.com/)

  * Destination Explorer: Confirm arrival on target chain




## 

Troubleshooting Common Issues

#### 

Transaction Stuck or Pending

**Symptoms** : Bridge transaction shows "pending" for extended period

1

Check Network Status: Verify source and destination chain health

2

Gas Price Issues: Increase gas price if transaction is stuck

3

Bridge Congestion: Wait for network congestion to clear

4

Contact Support: Reach out to bridge support with transaction hash

#### 

Insufficient Liquidity

**Symptoms** : Bridge shows "insufficient liquidity" error

1

Reduce Amount: Try bridging smaller amounts

2

Wait for Rebalancing: Liquidity pools rebalance automatically

3

Alternative Routes: Use different bridge or route

4

Split Transactions: Break large transfers into smaller ones

#### 

Wrong Network or Address

**Symptoms** : Tokens didn't arrive at expected destination

1

Verify Network: Ensure correct destination network selected

2

Check Address: Confirm recipient address accuracy

3

Network Switch: Switch wallet to destination network

4

Recovery Process: Contact bridge support for recovery options

#### 

High Fees or Slippage

**Symptoms** : Unexpected high costs or poor exchange rates

1

Timing: Bridge during low network congestion periods

2

Route Optimization: Compare different bridge options

3

Amount Adjustment: Larger amounts often have better rates

4

Alternative Bridges: Consider other bridge providers

## 

Verification And Testing

#### 

Test Bridge Functionality

1

Connect wallet to both source and destination networks

2

Bridge small test amount (e.g., $10-50)

3

Verify tokens arrive within expected timeframe

4

Check token balances on both chains

5

Test bridge interface responsiveness

#### 

Confirm Successful Bridge

1

Source Chain: Confirm tokens debited from source wallet

2

Bridge Status: Check bridge interface for completion status

3

Destination Chain: Verify tokens credited to destination wallet

4

Balance Check: Ensure correct amounts received

You've successfully learned how to bridge assets to and from Somnia using both Relay and Stargate Finance. These official bridge partners provide secure, fast, and reliable cross-chain transfers with different strengths:

  * **Relay** : Best for fast payments and swaps across 75+ networks

  * **Stargate** : Ideal for DeFi composability with native asset transfers




Both bridges support Somnia's high-performance infrastructure, enabling seamless integration with the broader multi-chain ecosystem.

_For technical support, contact the respective bridge providers or Somnia community channels._

[ PreviousConnect Your Wallet To Mainnet](/get-started/connect-your-wallet-to-mainnet)[NextTestnet STT Tokens](/get-started/testnet-stt-tokens)

Last updated 21 days ago
