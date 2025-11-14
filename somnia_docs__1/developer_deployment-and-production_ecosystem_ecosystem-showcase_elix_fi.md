# Elix.fi | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [DEPLOYMENT AND PRODUCTION](/developer/deployment-and-production)
  3. [ecosystem](/developer/deployment-and-production/ecosystem)
  4. [Ecosystem Showcase](/developer/deployment-and-production/ecosystem/ecosystem-showcase)



# Elix.fi

## 

1\. For Users

Elix is a CLOB (Central Limit Order Book) / AMM hybrid decentralized exchange (DEX) built on the Somnia Network, designed to bring the performance and trading experience of a centralized exchange (CEX) fully on-chain.

### 

How to Trade on Elix?

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F1861192046-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FFxD3cqyyFDzHJ0nfCPfy%252Fuploads%252FLnbfsJrRMIK5k3lCSXwl%252FEkran%2520Resmi%25202025-10-22%252018.52.12.png%3Falt%3Dmedia%26token%3D8a7d0e56-31ff-4ef2-af67-ef1e25b260e2&width=768&dpr=4&quality=100&sign=1a934cbf&sv=2)

  1. **Go to the** [**Elix App**](https://app.elix.fi/trade)**:** Connect your wallet to the Elix trading platform.

  2. **Select Market:** Choose the trading pair you are interested in, for example, WETH/USDC.

  3. **Choose Order Type:** You can place a **Market Order** to trade at the current best price, or a **Limit Order** to specify the exact price at which you want to buy or sell.

  4. **Enter Details:** For a limit order, enter the price and the amount you wish to trade. The interface will show you the total cost and fees.

  5. **Place Order:** Submit your order. Limit orders will sit on the order book until the market price reaches your specified price, at which point they will be automatically executed.




### 

How to Earn Yield on Elix?

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F1861192046-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FFxD3cqyyFDzHJ0nfCPfy%252Fuploads%252F6UUO431ge80AMAXKD9A4%252FEkran%2520Resmi%25202025-10-22%252019.02.08.png%3Falt%3Dmedia%26token%3Dca710905-367c-4149-97f7-573896d1f14a&width=768&dpr=4&quality=100&sign=fa51ea20&sv=2)

Elix offers innovative yield opportunities for liquidity providers through its "Earn" page.

  1. **Navigate to Earn Page:** Find the "Earn" section in the Elix app.

  2. **Explore Vaults:** Browse the available vaults. Each vault has a different strategy and risk profile, targeting specific token pairs.

  3. **Deposit Liquidity:** Choose a vault that fits your strategy and deposit your assets. By depositing, you become a liquidity provider and start earning fees from trades, and potentially other rewards.




![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F1861192046-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FFxD3cqyyFDzHJ0nfCPfy%252Fuploads%252FozLkUsj8Ydl2iSn4ScdQ%252FEkran%2520Resmi%25202025-10-22%252019.01.54.png%3Falt%3Dmedia%26token%3D051a949e-23b8-422c-a3b0-b1ccaf944bd0&width=768&dpr=4&quality=100&sign=94c4ea2f&sv=2)

## 

2\. For Developers

Elix's revolutionary feature is that liquidity is not locked. Liquidity providers can use their funds in other protocols until their orders are matched. This opens up immense possibilities for "composable" DeFi strategies.

**Core Concepts for Integration**

  * **Capital Efficiency & Composability:** Elix’s core innovation is that liquidity is not locked in the order book. As a developer, this means your users can use assets **such as aTokens supplied to** [**Tokos**](https://app.tokos.fi/) as collateral to provide liquidity on Elix. Users can earn both lending interest from [Tokos](https://app.tokos.fi/) and a share of trading fees from Elix simultaneously.

  * **Smart Hooks (Programmable Orders):** Elix allows liquidity providers to post arbitrary Smart Contracts (_Hooks_) as offers. These programmable orders can execute custom logic directly on-chain. This unlocks new opportunities for automated trading, dynamic pricing, and cross-protocol yield strategies.

  * **Off-Chain Order Posting, On-Chain Settlement:** To achieve CEX-level performance, Elix can utilize off-chain services for order matching while ensuring that all settlements and fund transfers are executed transparently and securely on the Somnia blockchain. Developers can build bots and strategies that interact with this high-frequency matching engine.




For more information, please check [Elix.fi Docs](https://docs.elix.fi/).

[PreviousEcosystem Showcase](/developer/deployment-and-production/ecosystem/ecosystem-showcase)[NextMeme Coins](/developer/deployment-and-production/ecosystem/ecosystem-showcase/meme-coins)

Last updated 13 days ago
