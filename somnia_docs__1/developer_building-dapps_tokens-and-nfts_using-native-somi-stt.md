# Using Native SOMI/STT | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Building DApps](/developer/building-dapps)
  3. [Tokens and NFTs](/developer/building-dapps/tokens-and-nfts)



# Using Native SOMI/STT

SOMI is the native token of the Somnia Network, similar to ETH on Ethereum. Unlike ERC20 tokens, SOMI is built into the protocol itself and does not have a contract address.

Kindly note that the Native Token for Somnia Testnet is STT.

This multi-part guide shows how to use SOMI for:

  * Payments

  * Escrow

  * Donations & Tipping

  * Sponsored gas via Account Abstraction




## 

Use SOMI for Payments in Smart Contracts

A simple contract that accepts exact SOMI payments:

Copy
    
    
    function payToAccess() external payable {
      require(msg.value == 0.01 ether, "Must send exactly 0.01 SOMI");
    }

Use `msg.value` to access the native token sent in a transaction. No ERC20 functions are needed.

To withdraw collected SOMI:

Copy
    
    
    function withdraw() external onlyOwner {
      payable(owner).transfer(address(this).balance);
    }

Deploy using Hardhat Ignition or Viem and test with a `sendTransaction` call.

Example.sol

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.20;
    
    contract SOMIPayment {
        address public owner;
    
        constructor() {
            owner = msg.sender;
        }
    
        // Modifier to restrict access to the contract owner
        modifier onlyOwner() {
            require(msg.sender == owner, "Only owner can call this");
            _;
        }
    
        // User must send exactly 0.01 SOMI to access this feature
        function payToAccess() external payable {
            require(msg.value == 0.01 ether, "Must send exactly 0.01 SOMI");
    
            // Logic for access: mint token, grant download, emit event, etc.
        }
    
        // Withdraw collected SOMI to owner
        function withdraw() external onlyOwner {
            payable(owner).transfer(address(this).balance);
        }
    }

## 

Build an SOMI Escrow Contract

A secure escrow contract allows a buyer to deposit SOMI and later release or refund:

Copy
    
    
    constructor(address payable _seller) payable {
      buyer = msg.sender;
      seller = _seller;
      amount = msg.value;
    }

Release funds to the seller:

Copy
    
    
    function release() external onlyBuyer {
      seller.transfer(amount);
    }

Deploy with Hardhat Ignition and pass SOMI as `value` during deployment.

Example.sol

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.20;
    
    contract SOMIEscrow {
        address public buyer;
        address payable public seller;
        uint256 public amount;
        bool public isDeposited;
    
        constructor(address payable _seller) payable {
            buyer = msg.sender;
            seller = _seller;
            amount = msg.value;
            require(amount > 0, "Must deposit SOMI");
            isDeposited = true;
        }
    
        modifier onlyBuyer() {
            require(msg.sender == buyer, "Only buyer can call this");
            _;
        }
    
        function release() external onlyBuyer {
            require(isDeposited, "No funds to release");
            isDeposited = false;
            seller.transfer(amount);
        }
    
        function refund() external onlyBuyer {
            require(isDeposited, "No funds to refund");
            isDeposited = false;
            payable(buyer).transfer(amount);
        }
    }
    

## 

SOMI Tip Jar

Allow any wallet to send tips directly:

Copy
    
    
    receive() external payable {
      emit Tipped(msg.sender, msg.value);
    }

Withdraw all tips:

Copy
    
    
    function withdraw() external onlyOwner {
      payable(owner).transfer(address(this).balance);
    }

Example.sol

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.20;
    
    contract SOMITipJar {
        address public owner;
    
        event Tipped(address indexed from, uint256 amount);
        event Withdrawn(address indexed to, uint256 amount);
    
        constructor() {
            owner = msg.sender;
        }
    
        receive() external payable {
            emit Tipped(msg.sender, msg.value);
        }
    
        function withdraw() external {
            require(msg.sender == owner, "Only owner can withdraw");
            uint256 balance = address(this).balance;
            require(balance > 0, "No tips available");
            payable(owner).transfer(balance);
            emit Withdrawn(owner, balance);
        }
    }

## 

Frontend tip

Copy
    
    
    await walletClient.sendTransaction({
      to: '0xTipJarAddress',
      value: parseEther('0.05'),
    });

## 

Sponsor SOMI Transactions with Account Abstraction

Using a smart account + relayer (e.g. via Privy, Thirdweb), the dApp can cover gas fees:

Copy
    
    
    await sendTransaction({
      to: contractAddress,
      data: mintFunctionEncoded,
      value: 0n, // user sends no SOMI
    });

The Smart Contract function can execute mint or other logic as usual. The paymaster or relayer pays SOMI.

## 

Conclusion

  * **SOMI is native** and used via `msg.value`, `.transfer()`, and `payable`.

  * **There is no contract address for SOMI (STT for Testnet)**.

  * You can integrate SOMI into any Solidity or Viem app with no ERC20 logic.

  * Account Abstraction enables gasless dApps using SOMI as sponsor currency.




[PreviousManaging NFT Metadata with IPFS](/developer/building-dapps/tokens-and-nfts/managing-nft-metadata-with-ipfs)[NextWallet Integration and Auth](/developer/building-dapps/wallet-integration-and-auth)

Last updated 1 month ago
