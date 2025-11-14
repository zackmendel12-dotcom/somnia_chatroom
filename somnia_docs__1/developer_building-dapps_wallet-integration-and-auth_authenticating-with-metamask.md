# Authenticating with MetaMask | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Building DApps](/developer/building-dapps)
  3. [Wallet Integration and Auth](/developer/building-dapps/wallet-integration-and-auth)



# Authenticating with MetaMask

Somnia empowers developers to build applications for mass adoption. Developers who deploy their Smart Contracts on Somnia, will require a User Interface to Connect to the Smart Contract. To enable users connect via the User Interface, it is necessary to set up an authentication process where only authorized users can access the functionality on the deployed Smart Contracts, for example, to carry out WRITE operations. [MetaMask](https://docs.metamask.io) is a wallet library that developers can use to build login functionality for applications on the Somnia Network.

Somnia Mainnet is LIVE. To deploy on Somnia Mainnet, you will need SOMI Tokens. Please refer to the [guide](/get-started/getting-started-for-mainnet) on Moving from Testnet to Mainnet.

In this guide, you will learn how to use the MetaMask Library to set up authentication for your User Interface App and connect to the Somnia Network. We will build a simple NextJS application to walk through the process.

## 

Start a NextJS Project

Run the command below to start a NextJS project:

Copy
    
    
    npx create-next-app metamask-example

Select Typescript, TailWind CSS, and Page Router in the build options.

Change the directory into the project folder. Delete the code inside of the `<main>` tags and replace them with the following:

Copy
    
    
     <p>Hello, World!</p>

## 

Install Viem

Copy
    
    
    npm i viem

[Viem](https://viem.sh) is a TypeScript interface for Ethereum that provides low-level stateless primitives for interacting with Ethereum. Viem sets up a “`transport`” infrastructure to connect with a node in the EVM Network and the deployed Smart Contracts. We will use some ViemJS methods to connect to your Smart Contract deployed on the Somnia Network. ViemJS has a `createPublicClient` and a `createWalletClient` method. The PublicClient is used to perform READ operations, while the WalletClient is used to perform WRITE operations. 

## 

Import Methods

The next step is to set up the React State methods and the ViemJS methods that we will require:

Copy
    
    
    import { useState } from "react";
    import {
      createPublicClient,
      http,
      createWalletClient,
    } from "viem";

The `http` is the transport protocol for interacting with the Node of the Somnia Blockchain via RPC. It uses the default Somnia RPC URL: [`https://dream-rpc.somnia.network`](https://dream-rpc.somnia.network). In the future developers can use RPC providers to avoid rate limiting. 

## 

Import Somnia

Import Somnia Testnet

Copy
    
    
    import { somniaTestnet } from "viem/chains";

## 

Declare React States

State allows us to manage changing data in the User Interface. For this example application, we are going to manage two states:

  * When we can read the User's Address

  * When a User is connected (Authorization)




Add the states inside the export statement:

Copy
    
    
    const [address, setAddress] = useState<string>("");
    const [connected, setConnected] = useState(false);

Now that the States are declared, we can declare a function to handle the MetaMask authentication process on Somnia Network.

## 

Connect MetaMask Function

Add the function below inside the export statement:

Copy
    
    
    const connectToMetaMask = async () => {
        if (typeof window !== "undefined" && window.ethereum !== undefined) {
          try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const walletClient = createWalletClient({
              chain: SOMNIA,
              transport: custom(window.ethereum),
            });
            const [userAddress] = await walletClient.getAddresses();
            setClient(walletClient);
            setAddress(userAddress);
            setConnected(true);
            console.log("Connected account:", userAddress);
          } catch (error) {
            console.error("User denied account access:", error);
          }
        } else {
          console.log(
            "MetaMask is not installed or not running in a browser environment!"
          );
        }
      };

## 

Update the UI

MetaMask connection is set up, and the final step is to test the connection via the User Interface. Update the `<p>Hello, World!</p>` in the return statement to the following:

Copy
    
    
    {!connected ? (
            <button
              onClick={connectToMetaMask}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Connect Wallet
            </button>
          ) : (
            <div>
              <p>Connected as: {address}</p>
             </div>
          )}

Open your terminal and run the following command to start the app:

Copy
    
    
    npm run dev

Go to `localhost:3000` in your Web Browser to interact with the app and connect to Somnia Network via MetaMask. You can read more about using Viem to interact with the deployed Smart Contract methods on Somnia Network [here](/developer/development-workflow/development-environment/using-the-viem-library). Congratulations, you have successfully connected from MetaMask to Somnia Network. 🎉

[PreviousWallet Integration and Auth](/developer/building-dapps/wallet-integration-and-auth)[NextAuthenticating with ConnectKit](/developer/building-dapps/wallet-integration-and-auth/authenticating-with-connectkit)

Last updated 2 months ago
