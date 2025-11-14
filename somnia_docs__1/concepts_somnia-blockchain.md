# Overview | Concepts | Somnia Docs

Copy

  1. [⛓️Somnia Blockchain](/concepts/somnia-blockchain)



# Overview

The Somnia blockchain has many innovations that enable it to increase performance by several orders of magnitude compared to other EVM chains:

  * [MultiStream consensus](/concepts/somnia-blockchain/multistream-consensus) \- a proof-of-stake, partially synchronous BFT protocol inspired by [Autobahn BFT](https://arxiv.org/pdf/2401.10369).

    * Independent Data Chains - Each validator operates its own blockchain, or “data chain,” which allows for independent block production. This unique approach eliminates the need for a consensus mechanism within individual data chains, streamlining the data processing workflow.

    * Consensus Chain - A separate blockchain aggregates the heads of all data chains, employing a modified PBFT algorithm for proof of stake consensus. This structure decouples data production from the consensus process, significantly enhancing overall efficiency.

  * [Compiled Bytecode](/concepts/somnia-blockchain/accelerated-sequential-execution) \- By translating EVM bytecode to highly optimised native code, Somnia achieves execution speeds close to hand-written C++ contracts, facilitating the execution of millions of transactions per second on a single core.

  * [Faster and predictable database performance](/concepts/somnia-blockchain/somnias-icedb) \- Somnia has a custom database called IceDB. It employs performance reports for predictable read and write performance as well as a custom database architecture that enables average read/write operations 15-100 nanoseconds with built in snapshotting.

  * [Advanced Compression Techniques](/concepts/somnia-blockchain/advanced-compression-techniques) \- The Somnia data chain architecture is designed to enable streaming compression in order to maximise data throughput. Somnia combines this with [BLS signature](https://www.ietf.org/archive/id/draft-irtf-cfrg-bls-signature-05.html) aggregation in order to achieve extremely high compression ratios, allowing for massive transaction data throughput. This allows theoretical performance above other preported [“limits due to bandwidth”](https://revelointel.com/lightspeed-how-monad-is-superscaling-the-evm-with-keone-and-kevin-g/).




[PreviousProblem](/concepts/litepaper/problem)[NextMultiStream Consensus](/concepts/somnia-blockchain/multistream-consensus)
