# Accelerated Sequential Execution | Concepts | Somnia Docs

Copy

  1. [⛓️Somnia Blockchain](/concepts/somnia-blockchain)



# Accelerated Sequential Execution

## 

**The Problem With Parallel Execution**

A large number of modern blockchains have attempted to scale their execution using parallelism. This means they execute transactions which are unrelated, on different cores. This can work well when the transactions in a block are unrelated, but breaks down when those transactions modify the same state. 

The reality, however, is that load spikes mostly happen when there is some event which has caused the spike. This implies a massive correlation between the transactions, which is not normally there in day to day execution. 

For example:

One of Ethereum's biggest load spikes was the Otherside Otherdeed mint. When this happened, the vast majority of all transactions in each block were all modifying the same state ([as they were minting Otherdeeds](https://decrypt.co/99219/otherside-nft-mint-burned-more-157m-ethereum)). Parallel execution would not have worked here.

A DEX will contain trading on many unrelated asset pairs throughout each day, but their real load spikes will come from volatility on a specific asset pair. These trades will all modify the same state, meaning parallel execution would not have helped.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Flh7-rt.googleusercontent.com%2Fdocsz%2FAD_4nXdrbW10aNo4JpAuSDrJdce6xQInL1bEASAzpBr-ZOtxCVxjJyEWKZHJPciH1mpjbq5t5yBMD9tTUO_1pUlEUQQvRhhzdiWjO2Oxwhe8zJJT36uz2Q8uQaqLRg99kCafYu25X1qcpAgFUyVDpygGIIRsahNV%3Fkey%3DkDSKjjghsV5HdVIUV1RbMw&width=768&dpr=4&quality=100&sign=2f130325&sv=2)

Parallel works well for many individual apps or accounts, swapping tokens

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Flh7-rt.googleusercontent.com%2Fdocsz%2FAD_4nXcfVU2BkXvoO29xCqKfv4eZ4u0NrpRs4xM0aAdbco6EtwuQFgUtyUdnNA4WJ_5cY2hYogEzejCNJmq4lLTO09vDOh4rL5vwkuIWguVCBycnbwOCC9au0l7NMAae0FE6-5ki5c_tj2C0uqFAmIJPm5l9bML4%3Fkey%3DkDSKjjghsV5HdVIUV1RbMw&width=768&dpr=4&quality=100&sign=632be666&sv=2)

When you have a hot path with many threads touching the same state parallel breaks down

In other words, **parallel execution breaks down exactly when you need it.**

This observation is why Somnia has opted to make a single core go extremely fast**instead of relying on parallel execution.**

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Flh7-rt.googleusercontent.com%2Fdocsz%2FAD_4nXewGQiGKlqSgXIyXd4c7zX2F_2_PQDqjF6yF9mlPM3fp0NYLhidvVutP-qK7zgoielDph3jClhmbwy8cHk8Cus3TX555vzowXs-gQqbXSu868WWL29qyHWBZmyQTcBD_90SYZ8KCaDzXuL0_91hXwzwWSgp%3Fkey%3DkDSKjjghsV5HdVIUV1RbMw&width=768&dpr=4&quality=100&sign=e0b49d9a&sv=2)

So, how does Somnia make a single core go this fast? 

## 

**EVM Compilation**

Somnia executes EVM transactions. It scales by reaching a very high single-core speed instead of attempting to parallelise over multiple cores.

The EVM is a relatively simple stack-based architecture. Due to the implicit stack, stack-based bytecodes are often naturally smaller in size than register-based bytecodes, but they contain many redundant operations.

There are broadly two ways to execute a VM's bytecode, interpreted or native (which itself can be split into JIT or AOT compilation). The former effectively simulates the VM itself in software, while the latter translates the bytecode to native instructions, which your CPU then executes directly.

Ethereum and most EVM blockchains run an interpreted VM to execute EVM bytecode. This is often a relatively naive implementation which keeps its own stack, loops through each operation, and looks up the functionality of each operation in a lookup table. This is very slow compared to native execution.

Further, Solidity and other Ethereum compilers often optimise for bytecode size over gas. For example, they will include code to generate large constants instead of including them inline. This ends up including a large amount of runtime computation that can actually be statically resolved at compile time.

To exploit these redundancies, Somnia includes its own EVM compiler, which translates EVM bytecode to x86. This approaches near-native speed (native speed being the equivalent functionality handwritten in C++). In benchmarks, this can execute ERC-20 transfers in hundreds of nanoseconds, achieving millions of TPS on a single core.

However, there is no free lunch as the compilation process is relatively expensive. For this reason, you would only do this on contracts that are called frequently, falling back to standard interpreted EVM on the rest.

## 

**Hardware Level Parallelism**

As mentioned above, "parallel execution", attempting to run unrelated transactions on different cores, breaks down when you need it the most because it cannot handle correlated transactions, which are much more common during load spikes. This type of parallelism is also known as "software parallelism".

For this reason, Somnia does not attempt to parallelise unrelated transactions. It does, however, enable the CPU to hardware parallelise each individual transaction.

This harnesses the single core parallelism available in modern CPUs to speed up every individual transaction, meaning this technique also works for transactions which modify the same state, helping during the load spikes as well.

So, what is hardware-level parallelism? 

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FhEUf5l6MCgn0iJsSVgmd%2Fblobs%2Fk6AbvfKfTZrEImgWrqhS%2Fimage.png&width=768&dpr=4&quality=100&sign=3f254cc4&sv=2)

_Diagram showing the difference between sequential execution (left) and hardware parralised execution (right)_

Modern CPU cores give the appearance that they execute assembly instructions in order, implementing control flow primitives by jumping around the assembly. The reality is that they are actually executing these instructions completely out of order, and often in parallel with each other.

For example, when reading a value from memory, the CPU will run ahead and work on future computation while waiting for the result. This is all completely invisible to the developer. This can cause massive speedups. Consider the case of an ERC-20 token swap. The program, at a high level, completes the following steps in the first half of it's execution:

1\. Hash the sender account. 

2\. Lookup the sender balance using this hash. 

3\. Hash the receiver account. 

4\. Lookup the receiver balance using this hash. 

5\. ...

Let's say the speed to hash an account is 150ns, and the speed to lookup the sender balance is 100ns (a single RAM read).

If the CPU ran these steps in serial, this would take 150 + 100 + 150 + 100 = 500ns. However, in practice, if these steps are compiled to native code, your CPU hardware would execute 1 and 2 completely in parallel to 3 and 4, causing the execution speed to be 250ns, double the speed.

The problem is, interpreting the EVM stops your CPU core from executing assembly in parallel. To really harness the available silicon in your CPU, you need to execute native assembly. Somnia's compiler and database are built to enable hardware-level parallelism of smart contracts.

[PreviousMultiStream Consensus](/concepts/somnia-blockchain/multistream-consensus)[NextSomnia's IceDB](/concepts/somnia-blockchain/somnias-icedb)
