# Using the Viem Library | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Development Workflow](/developer/development-workflow)
  3. [Development Environment](/developer/development-workflow/development-environment)



# Using the Viem Library

Somnia empowers developers to build applications for mass adoption. Smart Contracts deployed on Somnia will require front-end user interfaces to interact with them. These front-end user interfaces will require middleware libraries to establish a connection to the Somnia Network and enable interaction with Smart Contracts. In this Guide, you will learn how to use the Viem Library to establish a connection between your deployed Smart Contracts on Somnia Network and your Front-end User application. You will also learn how to perform READ and WRITE operations using Viem. [Viem](https://viem.sh) is a TypeScript interface for Ethereum that provides low-level stateless primitives for interacting with Ethereum. 

Somnia Mainnet is LIVE. To deploy on Somnia Mainnet, you will need SOMI Tokens. Please refer to the [guide](/get-started/getting-started-for-mainnet) on Moving from Testnet to Mainnet.

## 

How does Viem enable UI interaction?

When a Smart Contract is programmed using any development tool such as RemixIDE, Hardhat or Foundry, the Smart Contract undergoes a “compilation” stage. Compiling a Smart Contract, among other things will convert the Solidity code into machine-readable bytecode. An ABI file is also produced when a Smart Contrac is compiled. ABI stand for Application Binary Interface. You can think of an ABI like the Interface that make it possible for a User Interface to connect with the Smart Contract functions in a way similar to how an API makes it possible to to connect a UI and Backend server in web2.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Flh7-rt.googleusercontent.com%2Fdocsz%2FAD_4nXfaRoTuAtASsyoeB7jqiU2urm-g50ESwc_Ty4iH2h7DlLcwQak0uXG-eew1-J40_S4Cr0pJwGPxgWzjCjfo4_sHX8aV20snkM5w1dcJUeGpJx8igiTMGUqatgy1OpaYTnbINqXV6A%3Fkey%3DHxFSDQZc_LGgImSmo9E6Cd6w&width=768&dpr=4&quality=100&sign=ac6bc4c2&sv=2)

## 

Example Smart Contract

Here is an example `Greeter.sol` Smart Contract:

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

Example ABI

When the Greeter Smart Contract is compiled, below is its ABI:

ABI

<https://gist.github.com/emmaodia/bdb9b84998b1e4f3f19d0ae27c541e63>[](https://gist.github.com/emmaodia/bdb9b84998b1e4f3f19d0ae27c541e63)

The ABI is an array of JSON objects containing the constructor, event, and four functions in the Smart Contract. Using a Library such as Viem, you can perform READ and WRITE operations, for each of the ABI objects. You can READ the events, and other “view” only methods. You can perform WRITE operations on the “changeName” function. A cursory look at each ABI method will help you understand the function and what can be accomplished by interacting with the method. For example:

Copy
    
    
    {
    "inputs": [  --->specifies it is an input, i.e. a WRITE function
    {
    "internalType": "string", ---> the data type
    "name": "_newName", ---> params name
    "type": "string" ---> data type
    }
    ],
    "name": "changeName", ---> function name
    "outputs": [], ---> it does not have a return property
    "stateMutability": "nonpayable", ---> It changes the Blockchain State without Token exchange, it simply stores information.
    "type": "function" ---> It is a function.
    },

## 

How to use Viem.

To use Viem, it has to be installed in the project directory where you want to perform READ and WRITE operations. First, create a directory and initialize a new project using npm.

Copy
    
    
    mkdir viem-example && cd viem-example

Initialize a project in the directory by running the command:

Copy
    
    
    npm init -y

Install Viem by running the following command.

Copy
    
    
    npm i viem

## 

Set Up Viem

To connect to the deployed Example Greeter Smart Contract using Viem, it is necessary to have access to the Smart Contract’s ABI and its Contract Address. Viem sets up a “`transport`” infrastructure to connect with a node in the EVM Network and the deployed Smart Contracts. We will use some Viem methods to connect to your Smart Contract deployed on the Somnia Network. Viem has a `createPublicClient` and a `createWalletClient` method. The PublicClient is used to perform READ operations, while the WalletClient is used to perform WRITE operations. Create a new file `index.js` Import the method classes from the Library:

Copy
    
    
    import { createPublicClient, createWalletClient, http } from "viem";

The `http` is the transport protocol for interacting with the Node of the Somnia Blockchain via RPC. It uses the default Somnia RPC URL: [`https://dream-rpc.somnia.network`](https://dream-rpc.somnia.network). In the future developers can use RPC providers to avoid rate limiting. 

Copy
    
    
    import { somniaTestnet } from "viem/chains"

## 

Set up PublicClient

We will start with setting up the `publicClient` to read `view` only methods. Set up a `**publicClient**` where the default Transport is `http` and `chain` is `SOMNIA` network created using the `defineChain` method.

Copy
    
    
    const publicClient = createPublicClient({ 
      chain: somniaTestnet, 
      transport: http(), 
    }) 

## 

Consume Actions

Now that you have a Client set up, you can interact with Somnia Blockchain and consume Actions! An example will be to call the `greet` method on the deployed Smart Contract. To do this, we have to create a file name `abi.js` and add the exported ABI in the file.

Copy
    
    
    export const ABI = [//...ABI here]

In the `index.js` we can import the ABI file and start calling methods on the deployed Smart Contract. Import the ABI:

Copy
    
    
    import { ABI } from "./abi.js";

Set Contract Address

Copy
    
    
    const CONTRACT_ADDRESS = "0x2e7f682863a9dcb32dd298ccf8724603728d0edd";

> This is an example Greeter Smart Contract deployed on Somnia Testnet

Write a Function `interactWithContract`:

Copy
    
    
    const interactWithContract = async () => {
      try {
        console.log("Reading message from the contract...");
    
    
        // Read the "greet" function
        const greeting = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: ABI,
          functionName: "greet",
        });
        console.log("Current greeting:", greeting);
     } catch (error) {
        console.error("Error interacting with the contract:", error);
      }
    };
    
    
    interactWithContract();

Open your terminal and run the following:

Copy
    
    
    node index.js

You will see the response from the Smart Contract logged into the Console! 

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Flh7-rt.googleusercontent.com%2Fdocsz%2FAD_4nXeerGko1tZ3XeNPJPAiHOIw4DsOM8hL4HSurOu3-CgEP7dQeAUc_rbGJdXRx2jYX16DxCCUslCrEFQmmOmZJ5MDAB3-iWw8h2j4pWbbucO0YUO4Wp8i9xJ6JcI6zFUvztoPdUgbPw%3Fkey%3DHxFSDQZc_LGgImSmo9E6Cd6w&width=768&dpr=4&quality=100&sign=8b8b0cb2&sv=2)

Congratulations, you have successfully performed a READ operation on your Smart Contract deployed on Somnia.

## 

Set up Wallet Client

To perform a write operation, we will parse the `createWalletClient` method to a `walletClient` variable. It is important to understand that carrying out WRITE operations changes the state of the Blockchain, unlike READ operations, where you read the state of the Blockchain. So, to perform WRITE operations, a user will have to spend Gas, and to be able to spend Gas, a user will have to parse his Private Key from an EOA to give the Library masked permission to carry out transactions on behalf of the user. To read the Private Key from an EOA, we will use a Viem method:

Copy
    
    
    import { privateKeyToAccount } from "viem/accounts";

Then, create a variable `walletClient`

Copy
    
    
    const walletClient = createWalletClient({
      account: privateKeyToAccount($YOUR_PRIVATE_KEY),
      chain: somniaTestnet,
      transport: http(),
    });

> The variable `$YOUR_PRIVATE_KEY` variable can be parsed using a dotenv file.

After sending a WRITE operation, we also have to be able to read the transaction to see the state changes. We will rely on a READ method to read a transaction, `waitForTransactionReceipt`. Update the `interactWithContract` function with the code below:

Copy
    
    
       // Write to the "changeName" function
        const txHash = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi: ABI,
          functionName: "changeName",
          args: ["Emmanuel!"],
        });
        console.log("Transaction sent. Hash:", txHash);
        console.log("Waiting for transaction confirmation...");
    
        // Wait for the transaction to be confirmed
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        console.log("Transaction confirmed. Receipt:", receipt);
    
        // Read the updated "greet" function
        const updatedGreeting = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: ABI,
          functionName: "greet",
        });
        console.log("Updated greeting:", updatedGreeting);

Save the file and run the node command to see your responses logged into the console.

Copy
    
    
    node index.js

Congratulations, you have successfully performed a WRITE operation on your Smart Contract deployed on Somnia. 🎉

[PreviousDebug Playbook](/developer/development-workflow/development-environment/debug-playbook)[NextTokens and NFTs](/developer/building-dapps/tokens-and-nfts)

Last updated 1 month ago
