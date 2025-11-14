# Debug Playbook | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Development Workflow](/developer/development-workflow)
  3. [Development Environment](/developer/development-workflow/development-environment)



# Debug Playbook

## 

1\. Revert Decoding

Debugging smart contracts on the **Somnia Network** requires an understanding of how and why transactions fail. Every reverted transaction carries encoded data that can reveal the root cause of failure, whether it’s due to logic errors, insufficient gas, failed access checks, or internal Solidity panics.

### 

1.1 Anatomy of a Revert

When a transaction fails on Somnia, the EVM halts execution and returns **revert data** , an ABI-encoded payload that follows one of these three formats:

Type

Selector

Description

Example

`Error(string)`

`0x08c379a0`

Standard revert reason with message

`require(balance > 0, "Zero balance");`

`Panic(uint256)`

`0x4e487b71`

Internal error (e.g., overflow, div/0, invalid enum)

`assert(x > 0);`

Custom Errors

Function selector of custom error

`error Unauthorized(address caller);`

On Somnia, these behave identically to Ethereum but may differ in **gas costs** and **stack trace length** depending on the validator node configuration.

### 

1.2 Catching and Displaying Reverts in Hardhat

When running tests or scripts on Somnia, wrap calls in `try/catch` to capture the revert reason.

example.ts

Copy
    
    
    try {
      await treasury.withdraw(1000);
    } catch (error: any) {
      console.log('Revert reason:', error.reason || error.message);
      console.log('Full error data:', error.data || error.error?.data);
    }

In **Chai matchers** :

chai-example.ts

Copy
    
    
    await expect(treasury.connect(user).withdraw(1000))
      .to.be.revertedWith('Insufficient funds');

If your contract uses **custom errors** , Hardhat will not automatically print the name. Decode it manually:

decode-custom-error.ts

Copy
    
    
    const iface = new ethers.utils.Interface(contractABI);
    try {
      await treasury.connect(attacker).withdraw(9999);
    } catch (error: any) {
      const data = error.data || error.error?.data;
      if (data) {
        const decoded = iface.parseError(data);
        console.log(`Custom Error: ${decoded.name}`);
        console.log('Arguments:', decoded.args);
      }
    }

### 

1.3 Decoding Panic Codes

Internal Solidity panics correspond to low-level EVM exceptions. Somnia propagates these codes like any other EVM chain.

Panic Code

Description

Typical Cause

`0x01`

Assertion failed

Logic invariant broken

`0x11`

Arithmetic overflow/underflow

Unchecked math operation

`0x12`

Division by zero

Incorrect math division

`0x21`

Invalid enum conversion

Out-of-bounds value

`0x31`

Storage array index out of bounds

Bad loop or mapping access

`0x32`

Memory array index out of bounds

Corrupt array operation

To detect Panic errors dynamically:

detect-panic.ts

Copy
    
    
    if (error.data?.startsWith('0x4e487b71')) {
      const code = parseInt(error.data.slice(10), 16);
      console.log('Panic Code:', `0x${code.toString(16)}`);
    }

### 

1.4 Advanced Revert Inspection with Hardhat Traces

Hardhat’s tracing layer can reveal the full execution path of a revert.

trace

Copy
    
    
    npx hardhat test --trace

You’ll see nested calls, gas usage per function, and exactly where the failure occurred. This is invaluable for multi-contract interactions like on-chain governance or liquidity management.

Example output:

Copy
    
    
    CALL treasury.withdraw
     └─ CALL token.transfer -> reverted with reason: 'Insufficient balance'

### 

1.5 Custom Error Decoding for Verified Contracts

If a Somnia contract is verified on the explorer, you can fetch its ABI dynamically to decode errors programmatically:

fetch-abi.ts

Copy
    
    
    import axios from 'axios';
    const abiURL = `https://explorer.somnia.network/api?module=contract&action=getabi&address=${address}`;
    const { data } = await axios.get(abiURL);
    const iface = new ethers.utils.Interface(JSON.parse(data.result));

Then use `iface.parseError(error.data)` to decode reverts directly from on-chain logs or transactions.

* * *

## 

2\. Common Error Patterns on Somnia

Even experienced developers encounter recurring issues. Below are the **most common EVM-level errors** observed when deploying or testing on Somnia Testnet (Shannon) and Mainnet.

Error Type

Cause

Fix

`execution reverted`

Fallback revert with no message

Add explicit revert messages or decode ABI data

`out of gas`

Gas exhausted mid-call

Use `estimateGas()` or increase gas limit

`invalid opcode`

Calling a non-existent function

Validate ABI and deployed bytecode

`nonce too low`

Pending transaction not mined yet

Wait for confirmation or reset nonce

`replacement underpriced`

Gas bump too small

Raise gas price by 10–20%

`static call violation`

State-changing call via `eth_call`

Use `.sendTransaction()` instead

### 

2.1 Example: Catching a Custom Error in Somnia Treasury Contract

Treasury.sol

Copy
    
    
    error Unauthorized(address caller);
    
    function mint(address to, uint amount) external {
      if (msg.sender != owner) revert Unauthorized(msg.sender);
      _mint(to, amount);
    }

Decoding in JS:

catch-unauthorized.ts

Copy
    
    
    try {
      await treasury.connect(randomUser).mint(addr, 100);
    } catch (e: any) {
      const iface = new ethers.utils.Interface(['error Unauthorized(address caller)']);
      const decoded = iface.parseError(e.data);
      console.log('Unauthorized address:', decoded.args[0]);
    }

### 

2.2 Handling Complex Contract Interactions

When interacting with multi-layered DeFi protocols or bridging modules on Somnia, reverts can originate **several calls deep**. Use Hardhat’s trace or Foundry’s `-vvvv` verbosity to see the full stack.

Foundry example:

foundry-verbosity

Copy
    
    
    forge test -vvvv

This reveals each opcode execution, event emission, and revert reason.

### 

2.3 Invalid ABI or Proxy Conflicts

Many Somnia projects use **upgradeable proxies**. Reverts from a proxy may originate in the implementation contract. If you get a generic `execution reverted`, verify you’re using the correct implementation ABI:

get-impl.ts

Copy
    
    
    const implAddr = await provider.getStorageAt(proxyAddress, '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc');
    const iface = new ethers.utils.Interface(implementationABI);

* * *

## 

3\. Transaction Simulation

Simulating transactions allows developers to predict revert causes, estimate gas usage, and test behaviors **without risking real SOMI or STT**.

### 

3.1 Fork Somnia Networks Locally

Create a local fork of Somnia Mainnet or Shannon Testnet:

hardhat-fork

Copy
    
    
    npx hardhat node --fork https://api.infra.mainnet.somnia.network

Or in configuration:

hardhat-config.ts

Copy
    
    
    networks: {
      hardhat: {
        forking: {
          url: process.env.SOMNIA_RPC_TESTNET,
          blockNumber: 123456, //example
        }
      }
    }

This mirrors on-chain state locally, so you can safely replay any transaction.

### 

3.2 Using callStatic for Dry-Run Simulation

`callStatic` runs a transaction without broadcasting or altering state.

callstatic.ts

Copy
    
    
    try {
      const result = await treasury.callStatic.withdraw(1000);
      console.log('Call successful:', result);
    } catch (error: any) {
      console.log('Simulation failed with reason:', error.reason);
    }

### 

3.3 Using eth_call Manually

For raw RPC simulation:

eth-call.ts

Copy
    
    
    const tx = {
      to: contract.address,
      data: contract.interface.encodeFunctionData('stake', [amount])
    };
    const result = await provider.call(tx);
    console.log('Returned data:', result);

If the call reverts, inspect `error.data` to decode it with the ABI.

### 

3.4 Impersonating Accounts for Privileged Actions

Simulate admin or contract-controlled operations:

impersonate.ts

Copy
    
    
    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: ['0xAdminAddress']
    });
    const admin = await ethers.getSigner('0xAdminAddress');
    await treasury.connect(admin).setFee(5);

Stop impersonation when finished:

stop-impersonate.ts

Copy
    
    
    await network.provider.request({
      method: 'hardhat_stopImpersonatingAccount',
      params: ['0xAdminAddress']
    });

### 

3.5 Snapshot and Rollback Control

Snapshots let you test different outcomes quickly:

snapshot.ts

Copy
    
    
    const snapshot = await network.provider.send('evm_snapshot', []);
    await treasury.mint(100);
    await network.provider.send('evm_revert', [snapshot]);

This resets the blockchain to its previous state instantly.

### 

3.6 Simulating On-Chain Transactions

If you have a failed transaction hash from Somnia Mainnet:

replay-tx.ts

Copy
    
    
    const tx = await provider.getTransaction('0x123...');
    await provider.call({ to: tx.to!, data: tx.data });

This reproduces the failure locally and lets you inspect the revert reason directly in Hardhat.

### 

3.7 Advanced Fork Testing with Foundry

anvil-forge

Copy
    
    
    anvil --fork-url https://dream-rpc.somnia.network --fork-block-number 3456789
    forge test -vvvv

You can use cheatcodes like:

foundry-cheatcodes.sol

Copy
    
    
    vm.startPrank(admin);
    contract.withdraw(1000);
    vm.stopPrank();

### 

3.8 Gas Profiling and Cost Analysis

Somnia gas costs can differ from Ethereum due to consensus differences. Always estimate gas usage per function:

estimate-gas.ts

Copy
    
    
    const gas = await contract.estimateGas.executeTrade(orderId);
    console.log('Estimated gas:', gas.toString());

Compare against Shannon and Mainnet to identify anomalies.

### 

3.9 Full Transaction Lifecycle Test

1

#### 

Fork Somnia Testnet

Create a fork of the testnet to reproduce on-chain state locally.

2

#### 

Impersonate the deployer account

Use impersonation to perform privileged actions and reproduce behavior.

3

#### 

Run callStatic to simulate critical functions

Dry-run core functions to inspect return values and revert reasons.

4

#### 

Capture reverts and decode with ABI

Decode revert data, custom errors, and panic codes to get actionable context.

5

#### 

Use snapshot/revert to iterate quickly

Take snapshots to test multiple scenarios and revert between them.

6

#### 

Once clean, deploy and verify on testnet

After local verification, deploy to the testnet and verify behavior.

7

#### 

Run same steps on mainnet fork before release

Final validation on a mainnet fork ensures production parity.

* * *

Summary

  * Always **decode revert data** rather than relying on generic error strings.

  * Decode **custom errors** to get structured failure context.

  * Use **forked local environments** for safe and realistic debugging.

  * Combine **callStatic** , **trace** , and **snapshot/revert** for fast iteration.

  * Validate gas behavior across testnet and mainnet for accurate production cost.




Debugging on Somnia means understanding the EVM intimately. Every revert, panic, and trace is a clue—decode them, simulate safely, and ship with confidence.

[PreviousLocal Testing and Forking](/developer/development-workflow/development-environment/local-testing-and-forking)[NextUsing the Viem Library](/developer/development-workflow/development-environment/using-the-viem-library)

Last updated 21 days ago
