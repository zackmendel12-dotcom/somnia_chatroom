# Gas Fees | Concepts | Somnia Docs

Copy

  1. [Tokenomics](/concepts/tokenomics)



# Gas Fees

Somnia's gas pricing model is designed to balance affordability, predictability, security and sustainability, ensuring an optimal experience for users and developers. Gas fees help prevent network congestion and malicious attacks, compensate validators, efficiently allocate resources and incentivise developers to build within the ecosystem. Users pay fees in SOMI tokens, aligning with network economics and long-term viability.

Somnia's model was built based on Ethereum. Most Operation Codes remain the same, however, some required adjustment for two key reasons. First, storage-related opcodes needed to be right-sized since Somnia’s unit gas fees are significantly lower than Ethereum’s, preventing disproportionately cheap storage costs. Second, certain opcodes had gas prices misaligned with the actual compute resources required to execute them, requiring recalibration to maintain a balanced and secure execution environment.

## 

**Pricing Model**

Somnia’s model follows Ethereum’s structure: Total Fee = Gas Usage x Gas Unit Price

Gas Usage

Total gas units consumed by a transaction, determined by the following formula:

Gas Usage = Base Gas + Transaction Data + Opcodes

  1. Base Gas: All EOA transactions will be subject to a base gas fee of 21,000. This is denoted as a Gtransaction and is, in practice, the cheapest possible transaction cost on the Somnia Network.

  2. Transaction Data: Any additional data that is included in a transaction apart from the recipient address, value to be sent and gas parameters is included in this field. Similar to ETH, data is stored in blocks of 32 bytes. Zero-byte and non-zero-byte data costs 160 gas.

  3. Opcodes: Operations that can be executed on Smart Contracts. The full Opcodes table can be found [here](https://docs.google.com/spreadsheets/d/1D0AfQD5zxmDtrWshnHOEdRwVpjR-09tGToReYXOLV3Q/edit?usp=sharing).

  4. Gas Unit Price: The price per gas unit, dynamically adjusted based on account consumption.

     1. Somnia applies a dynamic discount curve for applications that achieve higher transaction volumes. As transaction throughput increases, the effective cost per gas unit decreases, incentivizing developers to scale their applications within the ecosystem.




### 

**Dynamic Pricing & Discounts**

This feature of the gas model will be rolled out later this year

Somnia’s compute gas pricing scales with transaction volume:

  * Base Price: $0.00000000616 per gas unit.

  * Min gas price: $0.000000000616 per gas unit (at 400 TPS).

  * Volume Discounts: Gas unit price decreases up to 90% for high-TPS applications.

    * Step function, decreasing at 0.1, 1, 10, 100 and 400 TPS

    * Sustained low price from 400 TPS

  * Measurement timeframe: average TPS in 1 hour.




![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Flh7-rt.googleusercontent.com%2Fdocsz%2FAD_4nXdOxpw44V-VjgJZw6SVjpy9qhRfXNGJ5mrJxgBdqUGllHbcbFYYlEvx0epGEF9I2LRrJU-Knd_cRObhvhYndD2QG8ExF2Ba9jCkXDvQxMg-363zLdsT21ELnctmgVyYedXjB0pV3w%3Fkey%3DowVrc_cdirLGFLQJaBvCiw&width=768&dpr=4&quality=100&sign=37c97dc6&sv=2)

P(T) = price per transaction after discount

P0 = initial (base) price per transaction

T = account cumulative transactions in 1 hour

### 

**Storage Fees (Single STORE - 32 Bytes)**

This feature of the gas model will be rolled out later this year

Somnia introduces the concept of transient state. This means that a developer can choose not to store data permanently on Somnia. This was explicitly introduced for entertainment products which have a lot of transient states, for instance, the position of a player in a video game.

  * Transient & Permanent Storage: Users choose between temporary and permanent storage.

  * Tiered Pricing: Costs scale with duration (e.g., 90% discount for 1-hour storage, no discount for indefinite storage).




Create SSTORE (32 bytes)

Gas Amount

1 hour

20,000

1 day

40,000

1 month

60,000

1 year

80,000

Indefinite

200,000

TPS Level

Gas Price ($)

Cost Min Ops (21k)

Discount vs Base (%)

0.0

$5.49E-09

$0.00012

0%

0.1

$4.39E-09

$0.00009

20%

1.0

$3.29E-09

$0.00007

40%

10.0

$2.20E-09

$0.00005

60%

100.0

$1.10E-09

$0.00002

80%

400.0

$5.49E-10

$0.00001

90%

### 

**Price Increase Function**

To ensure smooth network operation, validators can adjust the base fee price through voting, based on block execution time. This dynamically links gas prices to real network utilisation, increasing the base fee as the network gets congested.

If a block takes longer than 95ms to execute, validators can vote to double the base fee. If execution is faster than 95ms, they can vote to halve it. However, the base fee cannot fall below the minimum of 21,000 gas. Voting cycles occur every second (10 blocks). Here are the key implementation details:

  * Price Adjustment Threshold: 95ms.

  * Price Increase / Decrease: 2x increase, 50% decrease

  * Minimum Base Fee: 21k

  * Voting Cycle: 1 sec / 10 blocks




### 

**Gas fee distribution**

Gas fees spent to use the network are partially distributed to the validators and partially burnt. 

50% of all fees are distributed to all validators. This is distributed based on the amount of tokens a validator has staked. It is distributed if the validator was in the working set for the whole epoch.

50% of all fees are burnt. This means the Somnia token is deflationary, as the network is used more, the total supply will decrease.

### 

**Additional Features**

  * Tipping: Not included initially due to high network efficiency; may be introduced later.




[PreviousToken Staking and Delegation](/concepts/tokenomics/token-staking-and-delegation)[NextAllocation and unlocks](/concepts/tokenomics/allocation-and-unlocks)

Last updated 2 months ago
