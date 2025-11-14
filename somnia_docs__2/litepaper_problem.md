# Problem | Somnia Docs

Copy

  1. [📜Litepaper](/litepaper)



# Problem

Web3 has created a new era of decentralised finance, democratising financial access. However, it has fallen short in generating mass consumer applications and remains largely centred around finance. We believe blockchain technology is a cornerstone for the future of new, open Internet applications.

Today, there are limits to what you can build on-chain. Many factors constrain this, from the cost of running applications to the fundamental performance limitations of existing blockchains. We believe that new technologies can unlock a new class of real-time applications that normally must be built on Web2 foundations. Enabling these systems to be built on-chain will allow the free movement of businesses and users between online platforms, creating what we call a true virtual society.

We are building Somnia, a fast and cost-effective EVM-based blockchain, to achieve this. Somnia is a layer-one blockchain with full EVM compatibility, capable of processing over 400,000 transactions per second with sub-second finality and low fees. This will unlock a new wave of on-chain applications. Initially, we are focusing on gaming, metaverse, and social experiences. The use cases will likely extend far beyond these sectors. We are not even 100% certain of what can be built with the technology we are creating.

## 

The Current State

Although many blockchains support the EVM bytecode standard, they all leave much to be desired from a throughput perspective. Below are transactions per second (TPS) figures for a typical UniswapV3 transaction (Dex swaps per second (DPS)), which is 130k gas. As you can see, most chains offer up to ~200 DPS, or ~20M DPS per day. These numbers were taken from [this article](https://medium.com/dragonfly-research/the-amm-test-a-no-bs-look-at-l1-performance-4c8c2129d581):

Average DPS

Max DPS

Finality

ETH

9.19 

18.38 

66s 

Polygon

47.67 

95.33 

Variable 

AVAX

31.65 

175.68 

3.7s 

BNB

194.6 

194.6 

75s 

These are somewhat similar to real world observed numbers ([taken from Chaininspect](https://chainspect.app/dashboard)). Note that Uniswaps are a more complex user interaction and are composed of many transactions. Thus these numbers will be higher than above.

Name

Max Recorded TPS

Block Time

Time to finality

Base

293

2s

16m

BNB Chain

1731

3s

7.5s

Polygon

429

2.22s

4m 16s

Arbitrum

944

0.25s

16m

Ethereum

62.34

12.08

16m

Optimism

67.41

2s

16m

Avalanche

92.74

2.03s

0s

More recent benchmarks look as gas per second.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Flh7-rt.googleusercontent.com%2Fdocsz%2FAD_4nXd4aIfcAxT5HfbxKL_DV2lm3p87K61jbnnU3WY1H47J0h1yyj8aUKiS-zDmk78hR-Z9KuqNAT4ziqTUa9Dybf3LXhTqVBl-J7pF_TPzWhBMGcEGUhoU86S1gsHWEatmoJemJCQjiJAamRlmcgo865Ubwruv%3Fkey%3DPd6FhcOWiUEbzWyN_-YJmg&width=768&dpr=4&quality=100&sign=2d3d762a&sv=2)

These numbers are taken from [this article](https://www.paradigm.xyz/2024/04/reth-perf). To translate this into DPS, it’s about 6.5 DPS for every 1mg/s. So even the fastest chain on this list has a theoretical limit of 650 DPS (about 3700 TPS).

If you go outside of the EVM ecosystem, you can do a lot better. Note that this TPS is not the same as above, as the tests differ.

TPS

Finality

Aptos

30,000 ([cite](https://aptoslabs.medium.com/previewnet-ensuring-scalability-and-reliability-of-the-aptos-network-48f0d210e8fe))

0.9s ([cite](https://twitter.com/Aptos/status/1632801717937922052))

SUI

11,000 – 297,000 ([cite](https://blog.sui.io/sui-performance-update/))

480m/s ([cite](https://blog.sui.io/sui-performance-update/))

Solana

1608 ([cite](https://chainspect.app/dashboard))

12.8s ([cite](https://chainspect.app/dashboard))

Aptos and SUI's real-world live tests have not hit these levels yet. These numbers are based on their benchmarks. The Solana numbers differ from those on the Solana webpage as we are using the real-world observed numbers. Using the same methodology as the article above, Solana’s numbers are significantly worse at 273.34 swaps per second.

Despite this performance increase, we believe the EVM is important. There is already a rich ecosystem of developers and content around the EVM. Not being able to access that ecosystem seems like a missed opportunity. These chains had to make that tradeoff to create the needed performance. But what if we could have similar performance on the EVM?

The bottlenecks we see today with approaches on blockchain implemented with the EVM today are:

  * **Execution speed** – The rate at which smart contract code can be executed, and block creation can occur.

  * **Storage** — Retrieval of storing historical data of a chain. Ethereum [EIP-4844](https://www.eip4844.com/) was a recent upgrade that significantly improved the cost of storage for ETH and other L2s. However, we still need improvements in reading and writing data to blockchains.

  * **Bandwidth** — The amount of bandwidth needed to send data between nodes on the network when running at high transaction levels. 




Last updated 1 year ago
