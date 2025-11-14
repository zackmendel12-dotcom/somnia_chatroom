# MultiStream Consensus | Concepts | Somnia Docs

Copy

  1. [⛓️Somnia Blockchain](/concepts/somnia-blockchain)



# MultiStream Consensus

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Flh7-rt.googleusercontent.com%2Fdocsz%2FAD_4nXe7Wf4hn7ozZg4s3oMjgJp-CTVgxPCrlCwcnvYhOX9o4yn89hhsPOBrGFqrTj7IN8jtcknxsqDmvFnkylytq9UfICLGSU5ZH1DPZyL9WcX0HDFtUUXGtrvd4N39NKUCTgLR2zBh_Vda4N_nUBF9fqC2cTzL%3Fkey%3DkDSKjjghsV5HdVIUV1RbMw&width=768&dpr=4&quality=100&sign=55b6c150&sv=2)

Image showing conesus algorithm

In Somnia, every validator publishes their own blockchain, their data chain. This innovation was inspired by the 2024 whitepaper “[Autobahn: Seamless high speed BFT](https://arxiv.org/pdf/2401.10369)”. Every data chain is completely independent, and each block in a data chain contains a blob of bytes. Only the owning validator ever adds blocks to their data chain, and there are no safety mechanisms in place to avoid them forking their data chain or proposing invalid blocks. In other words, the data chains have no consensus mechanism at all.

Somnia then includes a **consensus chain** , with each consensus block including the current head of every data chain. This chain uses a modified PBFT consensus algorithm and is a typical proof of stake consensus setup. The consensus chain, including the tip of each data chain, provides full security against validators forking their own data chain. Each consensus block then semantically includes all of the transactions in all of the data chains whose tip it advanced. A deterministic pseudorandom ordering of these data chains then provides a single globally ordered stream of bytes to be executed across all data chains.

This setup completely decouples the production and distribution of new data (advancements of the data chains) with the consensus algorithm. It has a number of crucial benefits described below in the Advanced Compression Techniques section (e.g. streaming compression), which let this data frontend reach almost a gigabit per second of published transaction data. 

[PreviousOverview](/concepts/somnia-blockchain/overview)[NextAccelerated Sequential Execution](/concepts/somnia-blockchain/accelerated-sequential-execution)
