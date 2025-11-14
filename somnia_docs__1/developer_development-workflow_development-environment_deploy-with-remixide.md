# Deploy with RemixIDE | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Development Workflow](/developer/development-workflow)
  3. [Development Environment](/developer/development-workflow/development-environment)



# Deploy with RemixIDE

The Somnia mission is to enable the building of mass-consumer real-time applications. As a Developer, you must understand the quick steps to deploy your first Smart Contract on the Somnia Network. This guide will teach you how to connect to and deploy your first Smart Contract to the Somia Network using the Remix IDE.

Somnia Mainnet is LIVE. To deploy on Somnia Mainnet, you will need SOMI Tokens. Please refer to the [guide](/get-started/getting-started-for-mainnet) on Moving from Testnet to Mainnet.

## 

Pre-requisites:

  1. This guide is not an introduction to Solidity Programming; you are expected to understand Basic Solidity Programming.

  2. To complete this guide, you will need MetaMask installed and the Somnia Network added to the list of Networks. If you have yet to install MetaMask, please follow this guide to [Connect Your Wallet](/get-started/connect-your-wallet-to-mainnet).




[Remix](https://remix.ethereum.org/) is an IDE for Smart Contract development, which includes compilation, deployment, testing, and debugging. It makes it easy for developers to create, debug, and deploy Smart Contracts to the Somnia Network. In this example, we will deploy a Greeter Smart contract, where we can update the state of the Contract to say “Hello” + Name. 

## 

Connect to Somnia Testnet

Ensure you are logged into your MetaMask, connected to the Somnia Testnet, and have some STT Tokens. [Get STT Tokens](/get-started/testnet-stt-tokens) from the faucet.

## 

Create the Smart Contract

Go to the Remix IDE and create a new file. Paste the Smart Contract below:

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.22;
    
    contract Greeter {
        string public name;
        address public owner;
    
        event NameChanged(string oldName, string newName);
    
        modifier onlyOwner() {
            require(msg.sender == owner, "Only the owner can perform this action");
            _;
        }
        
        constructor(string memory _initialName) {
            name = _initialName;
            owner = msg.sender;
        }
    
    
        function changeName(string memory _newName) external onlyOwner {
            string memory oldName = name;
            name = _newName;
            emit NameChanged(oldName, _newName);
        }
    
    
        function greet() external view returns (string memory) {
            return string(abi.encodePacked("Hello, ", name, "!"));
        }
    }

## 

Compile the Smart Contract

On the left tab, click the “Solidity Compiler” menu item and then the “ Compile Greeter.sol” button. This will compile the Solidity file and convert the Solidity code into machine-readable bytecode.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252FdKcbUUf1Opv1MdtaSVl0%252Fgreeter1.png%3Falt%3Dmedia%26token%3D016a067e-3187-47dc-a148-6ddbf09fb71c&width=768&dpr=4&quality=100&sign=8fa6d84e&sv=2)

## 

Deploy the Smart Contract

The Smart Contract has been created and compiled into ByteCode, and the ABI has also been created. The next step is to deploy the Smart Contract to the Somnia DevNet so that you can perform READ and WRITE operations.

On the left tab, click the “Deploy and run transactions” menu item. To deploy the Smart Contract, we will require a wallet connection. In the Environment dropdown, select the option: “Injected Provider - MetaMask”. Then select the MetaMask account where you have STT Tokens. 

In the “DEPLOY” field, enter a value for the “_INITIALNAME” variable, and click deploy. 

When prompted, approve the Contract deployment on your MetaMask.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252FbZnJ394qflm4jauGRoaT%252FGreeter3.png%3Falt%3Dmedia%26token%3D24e2ccd9-b1de-41a4-aa6b-fa71f0dc72c5&width=768&dpr=4&quality=100&sign=4e167d01&sv=2)

Look at the terminal for the response and the deployed Smart Contract address. You can interact with the Smart Contract via the Remix IDE. Send a transaction to change the name.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252F3nbALtkWIA8XUaKdnsdO%252FGreeter4.png%3Falt%3Dmedia%26token%3D225da565-48df-46bb-ab1b-b056d10e13a4&width=768&dpr=4&quality=100&sign=16f35edd&sv=2)

Congratulations. 🎉 You have deployed your first Smart Contract to the Somnia Network. 🎉

[PreviousDevelopment Environment](/developer/development-workflow/development-environment)[NextDeploy with Hardhat](/developer/development-workflow/development-environment/deploy-with-hardhat)

Last updated 1 month ago
