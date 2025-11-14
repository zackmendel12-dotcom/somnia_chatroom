# Advanced Compression Techniques | Concepts | Somnia Docs

Copy

  1. [⛓️Somnia Blockchain](/concepts/somnia-blockchain)



# Advanced Compression Techniques

When you have a lot of transactions, a lot of data needs to go between nodes

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Flh7-rt.googleusercontent.com%2Fdocsz%2FAD_4nXc-j1fYvX9rhOUfFhGdomgdhKQyv_X0sWX8hBeOQIWo3HNMGEqBQF6B0TkR33gRYdLvSpsd5iJxeNGazVXtnCW_BQuzlPud6Gf8tgM_UZTU-Cldil3P0G89Ed0rtRj1xm0PV0gUXSAlmOyLvboAziklpmqz%3Fkey%3DkDSKjjghsV5HdVIUV1RbMw&width=768&dpr=4&quality=100&sign=a2d6288c&sv=2)

Once you are getting to the world of 100,000’s or even millions of transactions per second you start creating a lot of data.

A standard ERC-20 transfer is about 200 bytes when you consider all its parts. Now, imagine we are doing 1 million ERC-20 swaps per second. That’s 190 MBytes/s or 1.5 GBits/s. It's not going to pass over the public Internet, so you are either going to have a very centralised chain or limit your transaction rate.

## 

**Power law distribution**

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Flh7-rt.googleusercontent.com%2Fdocsz%2FAD_4nXeRqry-9IPGzaY3Ujfo612zu6AwYh3DaUWCrT0-DesSsxOUkHmEiNaA4UKnvzDJfVL_sewKnZXy0xrSMd-RCAF_O9PZAfP3dTYMIFDs0oHrnCI4ZD0zb-jii9vonf8vBb-su2W7WopjgbnI2M71l3UyO8k%3Fkey%3DkDSKjjghsV5HdVIUV1RbMw&width=768&dpr=4&quality=100&sign=9c034bfb&sv=2)

Image showing distribution of the power law

However, there is a lot of redundant information in those bytes. The number of bits theoretically required to send a piece of information is the logarithm of its probability of occuring. In practice, the probability distribution of which account is making a transaction, or which contract is being executed, or the arguments to the method being called, is very sharp (often a power law). This means that a minority of those accounts or contracts are highly likely to occur in the data to be sent. For example, if a particular contract was being called by 10% of transactions, its address can be encoded in 3.3 bits. That is a 48x compression ratio on the uncompressed 20 byte address.

## 

**Streaming Compression**

This leads to the question of how we can effectively compress the transaction data moving between nodes. There are broadly two forms of compression: 

  * Block compression 

  * Streaming compression 




Block compression is given a single block of data, and compresses in a way where the receiver only needs that block of data to decompress it. This is the typical form of compression, such as zip or tar files. It is very convenient because the compressor doesn't need to make assumptions about what other information the client has, or the order that information was sent. 

Streaming compression is able to assume that the sender and receiver both share an identical history of the data that was compressed and decompressed, and it uses this assumption to build a large amount of internal implicit information which never needs to be sent over the wire. It can say, "Use the address from 3.456 megabytes ago". For this reason, it achieves much better compression ratios than block compression. The downside, though, is that the sender and receiver must share an identical stream of data, and the 'implicit' data cannot be moved across machines or processes without using a lot of bandwidth, meaning the same process must compress the full stream of data (there are ways around this depending on the compression algorithm but it often requires a large amount of CPU time).

This poses a problem for a blockchain, which typically has each block proposed by a different machine. It forces blockchains to use block-based compression, if anything, significantly impacting the compression ratios they can achieve.

Somnia has a consensus and data availability algorithm designed to support streaming-based compression. Each validator is responsible for publishing their own stream of data to their own blockchain. These are the data chains introduced earlier in this section. The fact that data chains use the same process for publishing this stream unlocks the ability for streaming compression.

## 

**Hashes and Signatures**

A lot of data in Ethereum transactions have a tight power law distribution, making them very compressible. There are, however two important exceptions: hashes and signatures. By definition, these completely change with a uniform distribution if any bit in the transaction is different, making them completely uncompressable (no two executed Ethereum transactions are identical due to nonces, which avoid replay attacks).

Transaction hashes are easy: they are, again by definition, reproducible based on the transaction data itself, so they can simply not be sent (a receiving client is required to recalculate them anyway).

Signatures are more challenging. They are required to be sent alongside each transaction. Due to them being uncompressable, this would heavily limit the compression ratios we are able to achieve on transaction data. 

However, we can aggregate signatures if we use the BLS signature scheme. BLS signatures can aggregate any number of BLS signatures into a single signature, effectively achieving a constant size for any number of transaction signatures.

Somnia uses BLS signature aggregation for signature verification speed and, crucially, because it enables a far better compression ratio.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Flh7-rt.googleusercontent.com%2Fdocsz%2FAD_4nXfEjCRky-SOm2RJWhdrOKh0Z1cqWrOFAfSLFNSdGn7oDsKHWrPpPIMjcyOmzQXycGwKgiPO7dXESdwDO6eYh7q1zh-0CSFsoLCQsZgHV8IJJ5B-HBDW70_brLGApwNJsHFTZwGBf1n0qnK6YHCwQ9VKbpvv%3Fkey%3DPd6FhcOWiUEbzWyN_-YJmg&width=768&dpr=4&quality=100&sign=f2faca69&sv=2)

Image explaining BLS signature scheme

This aggregate cryptography is an optional mechanism to submit batches of transactions, where the cost to verify the signatures of all transactions in the batch is similar to the cost of verifying just one transaction. Using large batches this reduces the cost of signature verification by many orders of magnitude.

## 

**Bandwidth Symmetry**

In a typical blockchain, one validator is responsible for proposing each block and therefore, publishing the transaction data for that 'slot' of time to all of its peers. If the blockchain throughput is X bytes per second, and there are B blocks per second and N peers, the leader must send N * X / B bytes in 1 / B seconds, requiring an upload speed of N * X bytes per second (some blockchains will fan out in a tree architecture, which still requires the branching factor multiplied by X ).

In comparison, due to Somnia having all peers publish their own shard of data, each peer is responsible for publishing X / (N * B) bytes in 1 / B seconds, requiring an upload speed of X bytes per second. They also need to download everybody else's data for each block, requiring a download of N * (X / N) bytes per second, which is just X.

Note that no less data is being sent overall, but the bandwidth profile has been amortised to be symmetrical across all peers at all times. No peer ever needs to upload at a faster rate than the bandwidth of the blockchain itself, but they need to do this constantly instead of only when they propose a block. This enables the overall blockchain throughput to reach much closer to the bandwidth of the peers themselves. 

[PreviousSomnia's IceDB](/concepts/somnia-blockchain/somnias-icedb)[NextSecurity](/concepts/somnia-blockchain/security)
