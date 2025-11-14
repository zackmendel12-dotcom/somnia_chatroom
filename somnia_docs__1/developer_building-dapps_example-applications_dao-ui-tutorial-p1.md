# DAO UI Tutorial p1 | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Building DApps](/developer/building-dapps)
  3. [Example Applications](/developer/building-dapps/example-applications)



# DAO UI Tutorial p1

Somnia empowers developers to build applications for mass adoption. Smart Contracts deployed on the Somnia Blockchain will sometimes require building a User Interface. This guide will teach you how to build a user interface for a [DAO Smart Contract](/developer/building-dapps/example-applications/dao-smart-contract) using Next.js and React Context. It is divided into three parts. At the end of this guide, you’ll learn how to:

  1. Initialize a Next.js project.

  2. Set up a global state using the Context API ([`**useContext**`](https://react.dev/reference/react/useContext) hook).

  3. Add a global NavBar in `**_app.js**` so it appears on every page.




You will have a basic skeleton of a DApp, ready for **READ/WRITE** operations and UI components —topics we’ll cover in the subsequent articles.

* * *

## 

Pre-requisites:

  1. This guide is not an introduction to JavaScript Programming; you are expected to understand JavaScript.

  2. To complete this guide, you will need MetaMask installed and the Somnia Network added to the list of Networks. If you have yet to install MetaMask, please follow this guide to [Connect Your Wallet](https://codex.somnia.network/get-started/connect-your-wallet).




## 

Create Your Next.js Project

To create a NextJS project, run the command:

Copy
    
    
    npx create-next-app my-dapp-ui

Accept the prompts and change directory into the folder after the build is completed.

This gives you a minimal Next.js setup with a pages folder (holding your routes), a public folder (for static assets), and config files.

#### 

(Optional) Add Tailwind CSS

If you plan to style your app with Tailwind, install and configure it now:

Copy
    
    
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p

Then edit your tailwind.config.js:

Copy
    
    
    module.exports = {
      content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }

Finally, include Tailwind in styles/globals.css:

Copy
    
    
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

* * *

## 

Setting Up a React Context for Global State

In many DApps, including this one, developers will manage **Wallet connection** and **State** globally so each page and component in the project can access it without repetitive code. This can be achieved by a [Context](https://react.dev/learn/passing-data-deeply-with-context) following React patterns. 

  * Create a folder and name it `**contexts**` at the project root or inside `**pages**` directory.

  * Inside it, create a file called `**walletcontext.js**` add the following code to the file:


walletcontext.js

Copy
    
    
    import { createContext, useContext, useState } from "react";
    
    const WalletContext = createContext();
    
    export function WalletProvider({ children }) {
      const [connected, setConnected] = useState(false);
      const [address, setAddress] = useState("");
      
      async function connectToMetaMask() {
        if (typeof window !== "undefined" && window.ethereum) {
          try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            // For simplicity, get the first address
            const [userAddress] = window.ethereum.selectedAddress
              ? [window.ethereum.selectedAddress]
              : [];
            setAddress(userAddress);
             setConnected(true);
          } catch (err) {
            console.error("User denied account access:", err);
          }
        } else {
          console.log("MetaMask is not installed!");
        }
      }
    
      function disconnectWallet() {
        setConnected(false);
        setAddress("");
      }
    
      // Return the context provider
      return (
    <WalletContext.Provider
          value={{
            connected,
            address,
            connectToMetaMask,
            disconnectWallet,
          }}
        >
          {children}
        </WalletContext.Provider>
      );
    }
    
    
    export function useWallet() {
      return useContext(WalletContext);
    }
    

We parse three class methods from React: `**createContext**`, `**useContext**`, and`**useState**`

`createContext` is used to create a [context](https://react.dev/learn/passing-data-deeply-with-context) that components can provide or read. In this example, we assign `createContext` to the `**WalletContext**` variable and call the `**Provider**` method on each State and Function to make them available throughout the application.

`**useWallet()**` is a custom hook, so any page or component can do:

Copy
    
    
    const { connected, ... } = useWallet()

to access the global wallet state i.e. any of the `**Wallet.Provider**` methods

`**connectToMetaMask()**` triggers the MetaMask connection flow.

`**WalletProvider**` manages **State** and **Methods** in the application.

* * *

## 

Creating a Global NavBar in _app.js

Next.js automatically uses `**pages/_app.js**` to initialize every page. We will wrap the entire app in the `**WalletProvider**` inside `_app.js` and inject a `**NavBar**` menu that appears site-wide in the application

#### 

Create the `_app.js` and add the code:

Copy
    
    
    import "../styles/globals.css";
    import { WalletProvider } from "../contexts/walletcontext";
    import NavBar from "../components/navbar";
    
    function MyApp({ Component, pageProps }) {
      return (
        <WalletProvider>
          <NavBar />
          <main className="pt-16">
            <Component {...pageProps} />
          </main>
        </WalletProvider>
      );
    }
    
    export default MyApp;

`**< WalletProvider>**` wraps the entire `**< Component />**` tree so that every page can share the same wallet state.

`**< NavBar />**` is placed above `**< main>**`, so it’s visible on all pages. We give `**< main>**` a pt-16 to avoid content hiding behind a fixed navbar.

## 

NavBar

Create a sub directory **components** and add a file called `**navbar.js**` Add the code:

Copy
    
    
    import { useWallet } from "../contexts/walletcontext";
    import Link from "next/link";
    
    export default function NavBar() {
      const { connected, address, disconnectWallet } = useWallet();
    
    
      return (
        <nav className="fixed w-full bg-white shadow z-50">
          <div className="mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">
            <Link href="/">
              <h1 className="text-xl font-bold text-blue-600">MyDAO</h1>
            </Link>
    <div>
              {connected ? (
                <div className="flex items-center space-x-4 text-blue-500">
                  <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
                  <button onClick={disconnectWallet} className="px-4 py-2 bg-red-500 text-white rounded">
                    Logout
                  </button>
                </div>
              ) : (
                <span className="text-gray-500">Not connected</span>
              )}
            </div>
          </div>
        </nav>
      );
    }

It uses `**useWallet()**` to read the global `connected` and `address`states, and the `**disconnectWallet**` function. The truncated `address` is displayed if a user is logged into the App or “Not connected” otherwise. A **Logout** button calls `**disconnectWallet()**` to reset the global state.

* * *

## 

Test Your Setup

Start the dev server:

Copy
    
    
    npm run dev

Open **http://localhost:3000** in a Web Browser. You should see your NavBar at the top.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252Fl9fqbfW5Kr8EGo0TI4H1%252FNot_Logged_In.png%3Falt%3Dmedia%26token%3D7ed9498d-59ea-404a-89d8-e2e196073877&width=768&dpr=4&quality=100&sign=21694a46&sv=2)

Not Logged In

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252FyctcgnYDLdzAshYqW54b%252FLogged_In.png%3Falt%3Dmedia%26token%3D6f8b2631-921e-444a-a11d-0e8c91dd42f1&width=768&dpr=4&quality=100&sign=66425b8b&sv=2)

Logged In

Because we haven’t built any advanced pages yet, you will see a blank home page. The important part is that your **WalletContext** and global **NavBar** are in place and ready for the next steps. 

* * *

### 

5\. Next Steps

  * Article 2 shows you how to implement READ/WRITE operations (e.g., deposit, create proposals, vote, etc.) across different Next.js pages—using the same WalletContext to handle contract calls.

  * Article 3 will focus on UI components, like forms, buttons, and event handling, tying it all together into a polished user interface.




Congratulations! You have a clean foundation, a Next.js project configured with Tailwind, a global context to manage wallet states, and a NavBar appearing across all routes. This sets the stage for adding contract interactions and advanced UI flows in the subsequent articles. Happy building!

[PreviousDAO Smart Contract](/developer/building-dapps/example-applications/dao-smart-contract)[NextDAO UI Tutorial p2](/developer/building-dapps/example-applications/dao-ui-tutorial-p2)

Last updated 6 months ago
