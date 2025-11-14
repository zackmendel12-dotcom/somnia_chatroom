# Local Testing and Forking | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Development Workflow](/developer/development-workflow)
  3. [Development Environment](/developer/development-workflow/development-environment)



# Local Testing and Forking

This page shows how to spin up a local EVM node with **Hardhat** (and optionally **Anvil**) and fork **Somnia Testnet (Shannon)** or **Somnia Mainnet** for realistic testing.

* * *

## 

Prerequisites

  * Node.js 18+

  * npm or yarn

  * Hardhat (or Foundry/Anvil if you prefer)

  * A `.env` file with Somnia RPCs:




.env (example)

Copy
    
    
    # .env (example)
    SOMNIA_RPC_MAINNET=https://api.infra.mainnet.somnia.network/
    SOMNIA_RPC_TESTNET=https://dream-rpc.somnia.network/
    
    # Optional: pin block numbers for reproducible forks
    FORK_BLOCK_MAINNET=
    FORK_BLOCK_TESTNET=

> Do not commit real keys/tokens. Use environment variables.

* * *

## 

Quick Start (Hardhat)

1

Install packages

Copy
    
    
    npm i -D hardhat @nomicfoundation/hardhat-ethers ethers dotenv
    npx hardhat # if project not initialized yet
    cp .env.example .env || true

2

hardhat.config.ts

Copy
    
    
    import { HardhatUserConfig } from "hardhat/config";
    import "@nomicfoundation/hardhat-ethers";
    import * as dotenv from "dotenv";
    dotenv.config();
    
    const cfgFromEnv = {
      mainnetUrl: process.env.SOMNIA_RPC_MAINNET || "https://api.infra.mainnet.somnia.network/",
      testnetUrl: process.env.SOMNIA_RPC_TESTNET || "https://dream-rpc.somnia.network/",
      forkMainnetBlock: process.env.FORK_BLOCK_MAINNET ? Number(process.env.FORK_BLOCK_MAINNET) : undefined,
      forkTestnetBlock: process.env.FORK_BLOCK_TESTNET ? Number(process.env.FORK_BLOCK_TESTNET) : undefined,
    };
    
    const config: HardhatUserConfig = {
      solidity: "0.8.19",
      networks: {
        hardhat: {
          chainId: 31337,
        },
        localhost: {
          url: "http://127.0.0.1:8545",
          chainId: 31337,
        },
        somnia_testnet: {
          url: cfgFromEnv.testnetUrl,
          chainId: 50312,
        },
        somnia_mainnet: {
          url: cfgFromEnv.mainnetUrl,
          chainId: 5031,
        },
      },
    };
    
    export default config;

* * *

## 

Testing Your DApp Locally

Once your Hardhat environment is set up, you can write and run tests for your smart contracts. This ensures your code works as expected before deploying it.

**Create a Simple Smart Contract**

First, create a basic smart contract to test. The `Counter.sol` contract below includes fundamental functions for incrementing a counter and retrieving its current value. Save this file in your project's `contracts` directory.

contracts/Counter.sol

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.19;
    
    contract Counter {
        uint256 private count;
    
        event CountedTo(uint256 number);
    
        function getCount() public view returns (uint256) {
            return count;
        }
    
        function increment() public {
            count += 1;
            emit CountedTo(count);
        }
    }

### 

**Write a Test File**

Next, write a test file to verify the functionality of your smart contract. The `Counter.test.ts` file below deploys the `Counter` contract on a local test network, calls the `increment` function, and checks whether the outcome is as expected. Save this file in your project's `test` directory.

test/Counter.test.ts

Copy
    
    
    import { expect } from "chai";
    import { ethers } from "hardhat";
    
    describe("Counter Contract", function () {
      it("Should increment the count by 1", async function () {
        const Counter = await ethers.getContractFactory("Counter");
        const counter = await Counter.deploy();
        await counter.waitForDeployment();
    
        expect(await counter.getCount()).to.equal(0);
    
        const tx = await counter.increment();
        await tx.wait();
    
        expect(await counter.getCount()).to.equal(1);
      });
    
      it("Should emit a CountedTo event", async function () {
        const Counter = await ethers.getContractFactory("Counter");
        const counter = await Counter.deploy();
        await counter.waitForDeployment();
    
        await expect(counter.increment()).to.emit(counter, "CountedTo").withArgs(1);
      });
    });

### 

**Run Your Tests**

To run your tests, navigate to your project's root directory in the terminal and use the following command. This command will execute your test scripts using Hardhat's built-in test network and display the results.

Copy
    
    
    # Run tests on the default in-process Hardhat network
    npx hardhat test
    
    # Or, start a local node in a separate terminal
    npx hardhat node
    
    # Then run tests against it
    npx hardhat test --network localhost

* * *

## 

Forking Somnia (Testnet vs Mainnet)

_Forking is the process of copying the state of a live network, like Somnia Mainnet or Testnet, at a specific block and creating a simulation of it on your local machine. This powerful feature allows you to test how your contract will interact with other deployed contracts on the live network (such as a DEX, oracle, or NFT marketplace) using real-world data, but without any of the risk or cost._

You can fork Shannon Testnet for faster iteration or Mainnet for production-like state. For deterministic CI, always pin a blockNumber.

Fork Testnet (Shannon)

Fork Mainnet

Copy
    
    
    hardhat: {
      forking: {
        url: process.env.SOMNIA_RPC_TESTNET!,
        blockNumber: process.env.FORK_BLOCK_TESTNET ? Number(process.env.FORK_BLOCK_TESTNET) : undefined,
      },
    }

Copy
    
    
    # in-process fork
    npx hardhat test
    
    # persistent node
    npx hardhat node --fork $SOMNIA_RPC_TESTNET ${FORK_BLOCK_TESTNET:+--fork-block-number $FORK_BLOCK_TESTNET}

Copy
    
    
    hardhat: {
      forking: {
        url: process.env.SOMNIA_RPC_MAINNET!,
        blockNumber: process.env.FORK_BLOCK_MAINNET ? Number(process.env.FORK_BLOCK_MAINNET) : undefined,
      },
    }

Copy
    
    
    # in-process fork
    npx hardhat test
    
    # persistent node
    npx hardhat node --fork $SOMNIA_RPC_MAINNET ${FORK_BLOCK_MAINNET:+--fork-block-number $FORK_BLOCK_MAINNET}

> Testnet (STT) is ideal for validating flows and cheaper RPC limits; Mainnet (SOMI) reflects real contract/state and gas rules.

* * *

## 

Handy RPC Tricks (Hardhat)

These RPC methods provided by Hardhat Network allow you to manipulate the blockchain state for advanced testing scenarios.

### 

**Impersonate an account**

This allows you to execute transactions from any wallet address on the forked chain, which is perfect for testing functions with admin privileges or interacting with contracts using an account that holds a large amount of tokens ("whale").

impersonate.ts

Copy
    
    
    import { ethers, network } from "hardhat";
    
    async function main() {
      const target = "0xYourSomniaAddress"; // account to impersonate
      await network.provider.request({ method: "hardhat_impersonateAccount", params: [target] });
      const signer = await ethers.getSigner(target);
    
      await network.provider.send("hardhat_setBalance", [
        target,
        "0x152d02c7e14af6800000" // 1000 ether in wei
      ]);
    
      console.log("Impersonating:", await signer.getAddress());
    }
    
    main().catch((e) => { console.error(e); process.exit(1); });

### 

**Time travel**

This feature lets you change the timestamp of future blocks. It's incredibly useful for testing time-dependent smart contract logic, such as vesting schedules, lock-up periods, or any functionality that relies on `block.timestamp`.

Copy
    
    
    await network.provider.send("evm_setNextBlockTimestamp", [Math.floor(Date.now()/1000) + 3600]);
    await network.provider.send("evm_mine");

### 

**Snapshot and Revert**

This allows you to save the current state of the blockchain and later restore it instantly. It's an efficient way to isolate your tests, ensuring that each test case starts from the same clean state without needing to restart the local node.

Copy
    
    
    const id = await network.provider.send("evm_snapshot");
    // ... run actions ...
    await network.provider.send("evm_revert", [id]);

### 

**Reset fork**

This command resets the local Hardhat node to a fresh state forked from the blockchain. You can use it to switch to a different block number or even a different RPC endpoint without restarting your entire testing process.

Copy
    
    
    await network.provider.request({
      method: "hardhat_reset",
      params: [{ forking: { url: process.env.SOMNIA_RPC_TESTNET!, blockNumber: Number(process.env.FORK_BLOCK_TESTNET||0) || undefined } }]
    });

* * *

## 

Alternative: Anvil (Foundry)

Fork Testnet

Fork Mainnet

Notes

Copy
    
    
    anvil --fork-url $SOMNIA_RPC_TESTNET ${FORK_BLOCK_TESTNET:+--fork-block-number $FORK_BLOCK_TESTNET} --port 8546

Copy
    
    
    anvil --fork-url $SOMNIA_RPC_MAINNET ${FORK_BLOCK_MAINNET:+--fork-block-number $FORK_BLOCK_MAINNET} --port 8546

Point your app/tests to `http://127.0.0.1:8546`.

Anvil JSON-RPC is Hardhat-compatible for most calls (`evm_*`). Replace `hardhat_*` with Anvil equivalents where needed.

* * *

## 

Tips & Best Practices

  * Always pin block numbers in forks for reproducibility.

  * Prefer `localhost` network when you need state persistence across multiple test files.

  * Keep Anvil/Hardhat on separate ports if you run both simultaneously.

  * Use labels/comments in tests to describe assumptions tied to a specific fork block.

  * Avoid draining RPC rate limits: cache fixtures, use snapshots, and fork testnet for most flows.




* * *

## 

Common Issues

**insufficient funds for gas**

Top up native balance with `hardhat_setBalance`.

**nonce too high / replacement underpriced**

Reset account state (new snapshot) or use a fresh signer.

**Contract already deployed at address**

On persistent localhost, restart node or change deployer nonce.

[PreviousVerifying via Explorer](/developer/development-workflow/development-environment/verifying-via-explorer)[NextDebug Playbook](/developer/development-workflow/development-environment/debug-playbook)

Last updated 28 days ago
