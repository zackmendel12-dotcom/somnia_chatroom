# Security | Concepts | Somnia Docs

Copy

  1. [⛓️Somnia Blockchain](/concepts/somnia-blockchain)



# Security

## 

**Decentralisation**

Somnia philosophically believes in having sufficiently decentralised services, not maximally decentralised. What this means is that you have enough decentralisation of infrastructure to enable the good properties of decentralisation (increased security, censorship resistance, no single owner/counterparty) whilst not trading off to degrade performance significantly (all decentralisation will inherently decrease performance [see blockchain trilema](https://ieeexplore.ieee.org/abstract/document/10549891)).

For Somnia, the main validators of the network will be targeting hardware specs between a Solana and Aptos node. This will allow a large group of participants to join the network but not have sub-par hardware and connectivity. This will ensure the high level of performance needed for real-time mass-consumer applications. There will initially be 100 globally distributed validator nodes. We expect this to grow as the network matures. We also incentivize decentralisation and global footprint for the chain through our tokenomics.

## 

Cuthbert

Cuthbert is a separate implementation of Somnia's execution and database, using third party libraries wherever possible, and without any optimisations. Somnia validators automatically run every transaction through both Somnia and Cuthbert, and they will stop voting or executing if they ever detect a divergence between the two. This means that if the Somnia client has a bug or an issue in its execution or database, that bug would also have to be present in the separate Cuthbert implementation if this bug were to go undetected. Cuthbert will eventually be phased out of Somnia as the system becomes more mature.

## 

**Securing The Network**

As stated in the introduction the network is secured by validators staking tokens to participate in the network. This is a PoS network similar to other major blockchain networks (e.g. ETH). Node providers are subject to slashing if they act maliciously against the network. This will be further explored in our tokenomics.

[PreviousAdvanced Compression Techniques](/concepts/somnia-blockchain/advanced-compression-techniques)[NextUse Cases](/concepts/somnia-blockchain/use-cases)

Last updated 3 months ago
