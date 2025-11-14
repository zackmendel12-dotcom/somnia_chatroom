# Deploy with Hardhat | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Development Workflow](/developer/development-workflow)
  3. [Development Environment](/developer/development-workflow/development-environment)



# Deploy with Hardhat

Various developer tools can be used to build on Somnia to enable the Somnia mission of empowering developers to build Mass applications. One such development tool is Hardhat. [Hardhat](https://hardhat.org) is a development environment for the EVM i.e. Somnia. It consists of different components for editing, compiling, debugging, and deploying your smart contracts and dApps, all working together to create a complete development environment. This guide will teach you how to deploy a “Buy Me Coffee” Smart Contract to the Somia Network using Hardhat Development tools.

Somnia Mainnet is LIVE. To deploy on Somnia Mainnet, you will need SOMI Tokens. Please refer to the [guide](/get-started/getting-started-for-mainnet) on Moving from Testnet to Mainnet.

## 

Pre-requisites

  1. This guide is not an introduction to Solidity Programming; you are expected to understand Basic Solidity Programming.

  2. To complete this guide, you will need MetaMask installed and the Somnia Network added to the list of Networks. If you have yet to install MetaMask, please follow this guide to [Connect Your Wallet](/get-started/connect-your-wallet-to-mainnet).

  3. Hardhat is installed and set up on your local machine. See [Guide](https://hardhat.org/hardhat-runner/docs/getting-started#installation).




## 

Initialise Hardhat Project

Start a new Hardhat project by running the following command in your Terminal: 

Copy
    
    
    npx hardhat init

This will give you a series of prompts. Select the option to “Create a TypeScript Project (with Viem)”

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252F1d19cgBgLMTfHs1n3h9V%252FHardhat1.png%3Falt%3Dmedia%26token%3D39635e08-e00e-4080-8946-efc6176246c4&width=768&dpr=4&quality=100&sign=168ff72b&sv=2)

This will install the required dependencies for your project. Once the installation is complete, open the project directory and check the directories where you will find the `contracts` directory. This is where the Smart Contract will be added.

## 

Create the Smart Contract

Open the Smart Contracts folder and delete the default `Lock.sol` file. Create a new file, `BuyMeCoffee.sol` and paste the following code:

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.28;
    
    contract BuyMeCoffee {
        event CoffeeBought(
            address indexed supporter,
            uint256 amount,
            string message,
            uint256 timestamp
        );
    
        address public owner;
    
        struct Contribution {
            address supporter;
            uint256 amount;
            string message;
            uint256 timestamp;
        }
        
        Contribution[] public contributions;
    
        constructor() {
            owner = msg.sender;
        }
    
        function buyCoffee(string memory message) external payable {
            require(msg.value > 0, "Amount must be greater than zero.");
            contributions.push(
                Contribution(msg.sender, msg.value, message, block.timestamp)
            );
    
            emit CoffeeBought(msg.sender, msg.value, message, block.timestamp);
        }
    
        function withdraw() external {
            require(msg.sender == owner, "Only the owner can withdraw funds.");
            payable(owner).transfer(address(this).balance);
        }
    
        function getContributions() external view returns (Contribution[] memory) {
            return contributions;
        }
    
        function setOwner(address newOwner) external {
            require(msg.sender == owner, "Only the owner can set a new owner.");
            owner = newOwner;
        }
    }

## 

Compile the Smart Contract

To compile your contracts, you need to customize the Solidity compiler options, open the `hardhat.config.js` file and ensure the Solidity version is `0.8.28` and then run the command:

Copy
    
    
    npx hardhat compile

It will return the response:

Copy
    
    
    Compiling...
    Compiled 1 contract successfully

This will compile the Solidity file and convert the Solidity code into machine-readable bytecode. By default, the compiled _artifacts_ will be saved in the newly created `artifacts` directory. The next step is to deploy the contracts to the Somnia Network. In Hardhat, deployments are defined through **Ignition Modules**. These modules are abstractions that describe a deployment, specifically, JavaScript functions that process the file you want to deploy. Open the `ignition` directory inside the project root's directory, then enter the directory named `modules`. Delete the `Lock.ts` file. Create a `deploy.ts` file and paste the following code:

Copy
    
    
    import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
    
    const BuyMeCoffee = buildModule("BuyMeCoffee", (m) => {
      const contract = m.contract("BuyMeCoffee");
      return { contract };
    });
    
    module.exports = BuyMeCoffee;

## 

Deploy Contract

Open the `hardhat.config.js` file and update the network information by adding Somnia Network to the list of networks. Copy your Wallet Address Private Key from MetaMask, and add it to the **accounts** section. Ensure there are enough STT Token in the Wallet Address to pay for Gas. You can get some from the Somnia [Faucet](https://devnet.somnia.network/).

Copy
    
    
    module.exports = {
      // ...
      networks: {
        somnia: {
          url: "https://dream-rpc.somnia.network",
          accounts: ["0xPRIVATE_KEY"], // put dev menomonic or PK here,
        },
       },
      // ...
    };

> The "**0xPRIVATE_KEY** " is used to sign the Transaction from your EOA without permission. When deploying the smart contract, you must ensure the EOA that owns the Private Key is funded with enough STT Tokens to pay for gas. Follow this [guide](https://support.metamask.io/managing-my-wallet/secret-recovery-phrase-and-private-keys/how-to-export-an-accounts-private-key/) to get your Private Key on MetaMask.

Open a new terminal and deploy the smart contract to the Somnia Network. Run the command:

Copy
    
    
    npx hardhat ignition deploy ./ignition/modules/deploy.ts --network somnia

You will see a confirmation message asking if you want to deploy to the Somnia Network. Answer by hitting “**y** ” on your keyboard. This will confirm the deployment of the Smart Contract to the Somnia Network. 

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252F1WJLxutkGqpORdMMV2iO%252FHardhat2.png%3Falt%3Dmedia%26token%3Dfb2b88e6-c5ee-4521-9185-f8a8b89b8b4a&width=768&dpr=4&quality=100&sign=b4f6d0da&sv=2)

Congratulations. 🎉 You have deployed your “BuyMeCoffee” Smart Contract to the Somnia Network using Hardhat. 🎉

## 

**Verify Your Smart Contract**

After deploying your contract, you can verify it using the [Hardhat Verify plugin](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify). This allows your source code to be visible and validated on the [Somnia Explorer](https://shannon-explorer.somnia.network).

#### 

Update `hardhat.config.ts`Add the following to your config file:

Copy
    
    
    import { HardhatUserConfig } from "hardhat/config";
    import "@nomicfoundation/hardhat-toolbox";
    
    const config: HardhatUserConfig = {
      solidity: "0.8.28",
      networks: {
        somnia: {
          url: "https://dream-rpc.somnia.network",
          accounts: ["YOUR_PRIVATE_KEY"],
        },
      },
      sourcify: {
        enabled: false,
      },
      etherscan: {
        apiKey: {
          somnia: "empty",
        },
        customChains: [
          {
            network: "somnia",
            chainId: 50312,
            urls: {
              apiURL: "https://shannon-explorer.somnia.network/api",
              browserURL: "https://shannon-explorer.somnia.network",
            },
          },
        ],
      },
    };

> Store your private key in a `.env` file and import it securely to avoid hardcoding.

After deploying your contract, run the Verify command. Copy the deployed address and run:

Copy
    
    
    npx hardhat verify --network somnia DEPLOYED_CONTRACT_ADDRESS "ConstructorArgument1" ...

Example for a contract with one string constructor arg:

Copy
    
    
    npx hardhat verify --network somnia 0xYourContractAddress "YourDeployerWalletAddress"

Visit the [Somnia Explorer](https://shannon-explorer.somnia.network) and search for your contract address. If successful, the source code will appear under the **“Contract”** tab and show as **verified**.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252FcN2gHJzFCQwqoaqicN3T%252FVerifiedSC-1.png%3Falt%3Dmedia%26token%3D5d8d8372-1646-4897-ac80-a3081c35efaa&width=768&dpr=4&quality=100&sign=384ab739&sv=2)

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252F2u9IKT2RJTl02qpVVc2S%252FVerified-SC2.png%3Falt%3Dmedia%26token%3Da61d90b4-21a0-49a5-b18f-f38f9f149d9e&width=768&dpr=4&quality=100&sign=dccbfd4d&sv=2)

The verified Smart Contracts contain the Source Code, which anyone can review for bugs and malicious code. Users can also connect with and interact with the Verified Smart Contract.

[PreviousDeploy with RemixIDE](/developer/development-workflow/development-environment/deploy-with-remixide)[NextDeploy with Foundry](/developer/development-workflow/development-environment/deploy-with-foundry)

Last updated 1 month ago
