# Authenticating with RainbowKit | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Building DApps](/developer/building-dapps)
  3. [Wallet Integration and Auth](/developer/building-dapps/wallet-integration-and-auth)



# Authenticating with RainbowKit

In this guide, we'll integrate [RainbowKit](https://www.rainbowkit.com/docs/introduction) with the Somnia Network in a Next.js application. This will enable users to connect their wallets seamlessly, facilitating interactions with the Somnia blockchain.

## 

Prerequisites

Before we begin, ensure you have the following:

  1. This guide is not an introduction to JavaScript Programming; you are expected to understand JavaScript.

  2. To complete this guide, you will need MetaMask installed and the Somnia DevNet added to the list of Networks. If you have yet to install MetaMask, please follow this guide to [Connect Your Wallet guide](/get-started/connect-your-wallet-to-mainnet).

  3. Familiarity with React and Next.js is assumed.




## 

Create the Next.js Project

Open your terminal and run the following commands to set up a new Next.js project:

Copy
    
    
    npx create-next-app@latest somnia-rainbowkit
    cd somnia-rainbowkit

Install the required Dependencies, which are `**wagmi**`, `**viem**`, @tanstack/react-query, and rainbowkit. Run the following command:

Copy
    
    
    npm install wagmi viem @tanstack/react-query rainbowkit

### 

Set Up Providers in Next.js

We'll set up several providers to manage the application's state and facilitate interactions with the blockchain.

Create a `**components**` directory in the app folder. Inside the components directory, create a file named `**ClientProvider.tsx**` with the following content:

Copy
    
    
    'use client';
    
    import { WagmiProvider } from "wagmi";
    import {
      RainbowKitProvider,
      getDefaultConfig,
    } from "@rainbow-me/rainbowkit";
    import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
    import { somniaTestnet } from "viem/chains";
    
    const queryClient = new QueryClient();
    
    const config = getDefaultConfig({
      appName: "Somnia Example App",
      projectId: "Get_WalletConnect_ID",
      chains: [somniaTestnet],
      ssr: true, 
    });
    
    export default function ClientProvider({ children }) {
      return (
        <WagmiConfig config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowkitProvider>{children}</RainbowkitProvider>
          </QueryClientProvider>
        </WagmiConfig>
      );
    }

> Every Rainbowkit dApp relies on **WalletConnect** and needs to obtain a `**projectId**` from WalletConnect Cloud. Get one [here](https://cloud.walletconnect.com/).

In the app directory, locate the `**layout.tsx**` file and update it as follows:

Copy
    
    
    import ClientProvider from './components/ClientProvider';
    
    
    export default function RootLayout({ children }) {
      return (
        <html lang="en">
          <head>
            <title>Somnia DApp</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body>
            <ClientProvider>{children}</ClientProvider>
          </body>
        </html>
      );
    }

### 

Build the Home Page

We'll create a simple home page that allows users to connect their wallets and displays their address upon connection.

In the app directory, locate the `**page.tsx**` file and update it as follows:

Copy
    
    
    'use client';
    
    import { useAccount } from 'wagmi';
    import { ConnectButton } from "@rainbow-me/rainbowkit";
    
    
    export default function Home() {
      const { address, isConnected } = useAccount();
    
    
      return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <ConnectButton />
            {isConnected && (
              <p className="mt-4 text-lg text-blue-600">Connected as: {address}</p>
            )}
          </main>
        </div>
      );
    }

### 

Run the Application

Start the Development Server by running the following command:

Copy
    
    
    npm run dev

Open your browser and navigate to http://localhost:3000. You should see the RainbowKit button, allowing users to connect their wallets to the Somnia network.

## 

Conclusion

You've successfully integrated RainbowKit with the Somnia Network in a Next.js application. This setup provides a foundation for building decentralized applications on Somnia, enabling seamless wallet connections and interactions with the Somnia Network.

For further exploration, consider adding features such as interacting with smart contracts, displaying user balances, or implementing transaction functionalities.

If you encounter any issues or need assistance, join the[ Somnia Developer Discord](https://discord.gg/somnia).

[PreviousAuthenticating with Privy](/developer/building-dapps/wallet-integration-and-auth/authenticating-with-privy)[NextOnRamps](/developer/building-dapps/onramps)

Last updated 1 month ago
