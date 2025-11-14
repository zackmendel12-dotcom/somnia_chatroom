# Getting Started for Mainnet | Somnia Docs

Copy

  1. [🔥Get Started](/get-started)



# Getting Started for Mainnet

## 

GET SOMI TOKENS

Developers and Non-Developers can purchase SOMI Tokens for interacting on Mainnet from the list of exchanges below:

CEX

DEX

[Binance](https://www.binance.com/en/trade/SOMI_USDT)

Quickswap

[Gate.io](https://www.gate.com/price/somnia-somi)

[Bitget](https://www.bitgetapp.com/price/somnia)

## 

BRIDGE TO SOMNIA

Developers and Non-Developers can also Bridge their Stablecoins from other Networks to Somnia using LayerZero's STARGATE: <https://stargate.finance/bridge>[](https://stargate.finance/bridge) Welcome to Somnia Mainnet. Below is a checklist for you to confirm the Migration from Testnet to Mainnet.

## 

For Non-Developers

  * Ensure that you have added the Somnia Mainnet Network to your Wallet. You can use [ChainList](https://chainlist.org/?search=somnia).

  * Get SOMI Tokens from a list of Exchanges.




## 

For Developers

Conduct the same checks as non-developers, and in addition, the following.

  * Add Somnia to the list of Networks in your configuration files for your Smart Contracts

  * Using Hardhat:




Copy
    
    
    module.exports = {
      // ...
      networks: {
        somnia: {
          url: "https://api.infra.mainnet.somnia.network",
          accounts: ["0xPRIVATE_KEY"], // put dev menomonic or PK here,
        },
       },
      // ...
    };

  * Using Forge Deployment:




Copy
    
    
    forge create --rpc-url https://api.infra.mainnet.somnia.network --private-key PRIVATE_KEY src/Example.sol:Example

  * See the Page for the list of infrastructure and Dev Tooling available to you on Somnia.




[PreviousIntroduction](/)[NextConnect Your Wallet To Mainnet](/get-started/connect-your-wallet-to-mainnet)

Last updated 2 months ago
