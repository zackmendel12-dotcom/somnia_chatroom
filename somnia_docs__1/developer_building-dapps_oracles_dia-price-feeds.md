# DIA Price Feeds | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Building DApps](/developer/building-dapps)
  3. [Oracles](/developer/building-dapps/oracles)



# DIA Price Feeds

## 

**Overview**

[DIA](https://docs.diadata.org/) Oracles provide **secure, customizable, and decentralized price feeds** that can be integrated into **smart contracts on the Somnia Testnet**. This guide will walk you through how to access **on-chain price data** , understand the oracle’s functionality, and integrate it into your **Solidity Smart Contracts**.

## 

**Oracle Details**

### 

**Contracts on Somnia**

Network

Contract Address

Mainnet

[0xbA0E0750A56e995506CA458b2BdD752754CF39C4](https://explorer.somnia.network/address/0xbA0E0750A56e995506CA458b2BdD752754CF39C4)

Testnet

[0x9206296Ea3aEE3E6bdC07F7AaeF14DfCf33d865D](https://shannon-explorer.somnia.network/address/0x9206296Ea3aEE3E6bdC07F7AaeF14DfCf33d865D)

### 

Gas Wallets

The gas wallet is used for pushing data to your contracts. To ensure uninterrupted Oracle operation, please maintain sufficient funds in the gas wallet. You can monitor the wallets below to ensure they remain adequately funded at all times.

Mainnet

[0x3073d2E61ecb6E4BF4273Af83d53eDAE099ea04a](https://explorer.somnia.network/address/0x3073d2E61ecb6E4BF4273Af83d53eDAE099ea04a)

Testnet

[0x24384e1c60547b0d5403b21ed9b6fb9457fb573f](https://shannon-explorer.somnia.network/address/0x24384e1c60547b0D5403B21eD9B6FB9457Fb573F)

### 

**Oracle Configuration**

  * **Pricing Methodology:** MAIR

  * **Deviation Threshold:** 0.5% (Triggers price update if exceeded)

  * **Refresh Frequency:** Every 120 seconds

  * **Heartbeat:** Forced price update every 24 hours




## 

**Supported Asset Feeds**

### 

**Mainnet**

Asset Ticker

Adapter Address

Asset Markets Overview

USDT

[0x936C4F07fD4d01485849ee0EE2Cdcea2373ba267](https://explorer.somnia.network/address/0x936C4F07fD4d01485849ee0EE2Cdcea2373ba267)

[USDT markets](https://www.diadata.org/app/price/asset/Ethereum/0xdAC17F958D2ee523a2206206994597C13D831ec7/)

USDC

[0x5D4266f4DD721c1cD8367FEb23E4940d17C83C93](https://explorer.somnia.network/address/0x5D4266f4DD721c1cD8367FEb23E4940d17C83C93)

[USDC markets](https://www.diadata.org/app/price/asset/Ethereum/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/)

BTC

[0xb12e1d47b0022fA577c455E7df2Ca9943D0152bE](https://explorer.somnia.network/address/0xb12e1d47b0022fA577c455E7df2Ca9943D0152bE)

[BTC markets](https://www.diadata.org/app/price/asset/Bitcoin/0x0000000000000000000000000000000000000000/)

ARB

[0x6a96a0232402c2BC027a12C73f763b604c9F77a6](https://explorer.somnia.network/address/0x6a96a0232402c2BC027a12C73f763b604c9F77a6)

[ARB markets](https://www.diadata.org/app/price/asset/Arbitrum/0x912CE59144191C1204E64559FE8253a0e49E6548/)

SOL

[0xa4a3a8B729939E2a79dCd9079cee7d84b0d96234](https://explorer.somnia.network/address/0xa4a3a8B729939E2a79dCd9079cee7d84b0d96234)

[SOL markets](https://www.diadata.org/app/price/asset/Solana/0x0000000000000000000000000000000000000000/)

WETH

[0x4E5A9Ebc4D48d7dB65bCde4Ab9CBBE89Da2Add52](https://explorer.somnia.network/address/0x4E5A9Ebc4D48d7dB65bCde4Ab9CBBE89Da2Add52)

[WETH markets](https://www.diadata.org/app/price/asset/Ethereum/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/)

SOMI

[0x1f5f46B0DABEf8806a1f33772522ED683Ba64E27](https://explorer.somnia.network/address/0x1f5f46B0DABEf8806a1f33772522ED683Ba64E27)

[SOMI markets](https://www.diadata.org/app/price/asset/Somnia/0x0000000000000000000000000000000000000000/)

### 

**Testnet**

USDT

[0x67d2C2a87A17b7267a6DBb1A59575C0E9A1D1c3e](https://shannon-explorer.somnia.network/address/0x67d2C2a87A17b7267a6DBb1A59575C0E9A1D1c3e)

[USDT markets](https://www.diadata.org/app/price/asset/Ethereum/0xdAC17F958D2ee523a2206206994597C13D831ec7/)

USDC

[0x235266D5ca6f19F134421C49834C108b32C2124e](https://shannon-explorer.somnia.network/address/0x235266D5ca6f19F134421C49834C108b32C2124e)

[USDC markets](https://www.diadata.org/app/price/asset/Ethereum/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/)

BTC

[0x4803db1ca3A1DA49c3DB991e1c390321c20e1f21](https://shannon-explorer.somnia.network/address/0x4803db1ca3A1DA49c3DB991e1c390321c20e1f21)

[BTC markets](https://www.diadata.org/app/price/asset/Bitcoin/0x0000000000000000000000000000000000000000/)

ARB

[0x74952812B6a9e4f826b2969C6D189c4425CBc19B](https://shannon-explorer.somnia.network/address/0x74952812B6a9e4f826b2969C6D189c4425CBc19B)

[ARB markets](https://www.diadata.org/app/price/asset/Arbitrum/0x912CE59144191C1204E64559FE8253a0e49E6548/)

SOL

[0xD5Ea6C434582F827303423dA21729bEa4F87D519](https://shannon-explorer.somnia.network/address/0xD5Ea6C434582F827303423dA21729bEa4F87D519)

[SOL markets](https://www.diadata.org/app/price/asset/Solana/0x0000000000000000000000000000000000000000/)

WETH

[0x786c7893F8c26b80d42088749562eDb50Ba9601E](https://shannon-explorer.somnia.network/address/0x786c7893F8c26b80d42088749562eDb50Ba9601E)

[WETH markets](https://www.diadata.org/app/price/asset/Ethereum/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/)

SOMI

[0xaEAa92c38939775d3be39fFA832A92611f7D6aDe](https://shannon-explorer.somnia.network/address/0xaEAa92c38939775d3be39fFA832A92611f7D6aDe)

[SOMI markets](https://www.diadata.org/app/price/asset/Somnia/0x0000000000000000000000000000000000000000/)

## 

**How the Oracle Works**

DIA oracles continuously fetch and push asset prices **on-chain** using an **oracleUpdater** , which operates within the `DIAOracleV2` contract. The oracle uses **predefined update intervals** and **deviation thresholds** to determine when price updates are necessary.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Flh7-rt.googleusercontent.com%2Fdocsz%2FAD_4nXelAe-nl93fR4uUB8OHaecQRpe5DuDvy7k-1aMyk_8B1DHX2OzmpuZ00anBlexvcuGcg7oilXmYzTBxTDAeGwdytZmbZicu9yKYhz9rgYPh8SCbuEzia98yvw8F77FUVGWdr7vMJg%3Fkey%3DlW9QgbGCuFAGhXIdiB9dWgLT&width=768&dpr=4&quality=100&sign=5dd89325&sv=2)

Each asset price feed has an adapter contract, allowing access through the AggregatorV3Interface. You can use the methods `getRoundData` and `latestRoundData` to fetch pricing information. Learn more [here](https://nexus.diadata.org/how-to-guides/migrate-to-dia).

## 

**Using the Solidity Library**

DIA has a dedicated Solidity library to facilitate the integration of DIA oracles in your own contracts. The library consists of two functions, `getPrice` and `getPriceIfNotOlderThan`.

### 

Access the library

Copy
    
    
    import { DIAOracleLib } from "./libraries/DIAOracleLib.sol";

### 

`getPrice`

Copy
    
    
    function getPrice(
            address oracle,
            string memory key
            )
            public
            view
            returns (uint128 latestPrice, uint128 timestampOflatestPrice);

**Returns the price of a specified asset along with the update timestamp**.

### 

`**getPriceIfNotOlderThan**`

Copy
    
    
    function getPriceIfNotOlderThan(
            address oracle,
            string memory key,
            uint128 maxTimePassed
            )
            public
            view
            returns (uint128 price, bool inTime)
        {

**Checks if the Oracle price is older than**`**maxTimePassed**`

## 

Using DIAOracleV2 Interface

The following contract provides an integration example of retrieving prices and verifying price age.

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.13;
    
    interface IDIAOracleV2 {
        function getValue(string memory) external view returns (uint128, 
                 uint128);
    }
    
    contract DIAOracleSample {
    
        address diaOracle;
    
        constructor(address _oracle) {
            diaOracle = _oracle;
        }
    
        function getPrice(string memory key) 
        external 
        view
        returns (
            uint128 latestPrice, 
            uint128 timestampOflatestPrice
        ) {
            (latestPrice, timestampOflatestPrice) =   
                     IDIAOracleV2(diaOracle).getValue(key); 
        }
    }

[**Full Example on DIA Docs**](https://www.diadata.org/docs/nexus/how-to-guides/fetch-price-data/solidity)

## 

Adapter contracts

To consume price data from DIA Oracle, you can use the adapter Smart Contract located at the [adapter address](https://docs.google.com/document/d/1tqK1Va0dOrgZcOjqwLg2fh7hDOK6pQWDfF3ZrljDN-w/edit?tab=t.0#heading=h.iyqc22917lsc) for each asset. This will allow you to access the same methods on the `AggregatorV3Interface` such as `getRoundData` & `latestRoundData`. You can learn more [here](https://www.diadata.org/docs/nexus/how-to-guides/migrate-to-dia).

## 

**Glossary**

Term

Definition

**Deviation**

Percentage threshold that triggers a price update when exceeded.

**Refresh Frequency**

Time interval for checking and updating prices if conditions are met.

**Trade Window**

Time interval used to aggregate trades for price calculation.

**Heartbeat**

Forced price update at a fixed interval.

## 

**Support**

If you need further assistance integrating DIA Oracles, reach out through DIA’s[ official documentation](https://docs.diadata.org/) and ask your questions in the #dev-support channel on [Discord](https://discord.com/invite/somnia).

Developers can build secure, real-time, and on-chain financial applications with reliable pricing data by integrating DIA Oracles on Somnia.

[PreviousOracles](/developer/building-dapps/oracles)[NextProtofire Price Feeds](/developer/building-dapps/oracles/protofire-price-feeds)

Last updated 1 month ago
