# Somnia Gas Differences To Ethereum | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [DEPLOYMENT AND PRODUCTION](/developer/deployment-and-production)



# Somnia Gas Differences To Ethereum

EVM gas units are designed to approximate the load placed onto the blockchain. They are used to charge users relative to the amount of blockspace / load that they consume on the system. Their absolute value does not ultimately matter - it is the relative difference between each operation's gas units which matter. In other words, if you doubled the gas units for all operations, and halved the fee per unit of gas, there would be no change to your system

Somnia's architecture and implementation has drastically reduced the real-world performance cost of most EVM operations, but not all. A few operations, such as third-party library precompiles are just as performant on Somnia than Ethereum (as they use the same libraries). This relative difference requires us to adjust the relative gas units of these operations. We could either reduce the gas units of all operations Somnia has improved, or increase the gas units of all operations Somnia has not improved - the result is equivalent. Somnia does the latter, as it fits better into the Ethereum developer ecosystem.

Further, Ethereum and many other EVM chains charge a flat gas unit amount to read any existing value from storage for the first time in a transaction. This ends up hitting a database whose latency for this read can vary by multiple orders of magnitude. This gas unit inaccuracy is a big problem when scaling these blockchains, as it requires them to leave massive amounts of unused buffer in their execution budget to account for these unpredictable latencies. Somnia has built a new database, IceDb, that is designed to fix this problem. Only the (rare) reads which actually take a long time to read will have a high gas fee to read, and reads to more recent state will be far cheaper.

These two reasons require Somnia to have different gas semantics than Ethereum. These differences are detailed in this document.

## 

Precompiles

These precompiles have a flat multiple applied to [the same gas calculation that Ethereum uses](https://www.evm.codes/precompiled).

  * `ecRecover (0x01)` costs **150000** gas instead of 3000 gas.

  * `SHA2-256 (0x02) `costs **50** times the Ethereum calculated gas usage.

  * `RIPEMD-160 (0x03)` costs **10** times the Ethereum calculated gas usage.

  * `modexp (0x05)` costs **10** times the Ethereum calculated gas usage. 

  * `ecAdd (0x06)` costs **50** times the Ethereum calculated gas usage.

  * `ecMul (0x07)` costs**10** times the Ethereum calculated gas usage.

  * `ecPairing (0x08)` costs **250** times the Ethereum calculated gas usage. 

  * `blake2f (0x09)` costs **10** times the Ethereum calculated gas usage.

  * `point evaluation (0x0a) `costs **50** times the Ethereum calculated gas usage.




## 

Non-storage EVM operations

  * `SELFBALANCE` costs **305** gas instead of 5 gas.

  * `KECCAK256` costs `1250 + 300 * minimum_word_size instead of 30 + 6 * minimum_word_size gas`.

  * `ADDMOD` costs **358** gas instead of 8 gas.

  * `MULMOD` costs **358** gas instead of 8 gas.




## 

Storage EVM operations

Ethereum uses an [access list based gas model](https://www.evm.codes/about#access_list) for all storage operations, to charge extra gas depending on if the value being accessed has already been accessed in the same transaction, and if it is creating or deleting that state.

As discussed above, Somnia instead charges extra gas based on a more accurate model of the real world latency it takes to read or write the value in question:

`SLOAD`

  * If the storage slot key is in the set of most recently accessed **128 million** contract slot keys, **no extra gas is charged** (on top of the static op gas fee, which is 100 gas).

  * If the key does not exist, the access requires **over 1 million gas remaining** , but that gas is **not charged,** so there is no extra cost.

  * Otherwise, the read costs an additional**1 million gas**.




`SSTORE`

  * If the storage slot key is in the set of most recently accessed **128 million** contract slot keys, no **extra gas** is charged (on top of the static op gas fee, which is 100 gas).

  * If the key does not exist and is being written to zero, the access **requires over 1 million gas remaining** , but that gas is **not charged** , so there is no extra cost. 

  * If the key does not exist and is being written to a non-zero value, the access **requires over 1 million** gas remaining, but the caller is charged **200k gas.**

  * Otherwise, the write costs an additional **1 million gas.**




## 

Account operations

The following EVM operations access account state:

  * `BALANCE`

  * `EXTCODESIZE EXTCODECOPY EXTCODEHASH`

  * `CALL`

  * `CALLCODE`

  * `DELEGATECALL`

  * `STATICCALL`

  * `CREATE`

  * `CREATE2`

  * `SELFDESTRUCT`




These have an additional storage gas fee (in place of Ethereum's dynamic access list gas fee) of:

  * If the account is in the set of most recently accessed **32 million** accounts, **no extra gas is charged.**

  * If the account does not exist and is being read, the access **requires over 1 million gas remaining** , but that gas is **not charged** , so there is no extra cost.

  * If the account does not exist and is being created, the access **requires over 1 million gas** remaining, but the caller is charged **400k gas** for the new account. 

  * Otherwise, the access costs **1 million gas**.




## 

EVM Logs

Somnia charges an increased amount of gas for EVM logs due to the historical storage requirements. Ethereum charges: `375 + 375 * topic_count + 8 * size + memory_expansion_cost` Somnia charges: `3200 + 5120 * topic_count + 160 * size + memory_expansion_cost` To illustrate these changes with the five different EVM log operations:

EVM Op

Ethereum gas

Somnia gas

LOG0 with 32 bytes of data

631

8320

LOG1 with 32 bytes of data

1006

13440

LOG2 with 32 bytes of data

1381

18560

LOG3 with 32 bytes of data

1756

23680

LOG4 with 32 bytes of data

2131

28800

## 

Contract bytecode deployment cost

Ethereum charges 200 gas per byte of deployed bytecode. Somnia charges **3125** gas per byte of deployed bytecode.

[PreviousExplorer API Health and Monitoring](/developer/deployment-and-production/explorer-api-health-and-monitoring)[NextEcosystem Showcase](/developer/deployment-and-production/ecosystem/ecosystem-showcase)

Last updated 2 months ago
