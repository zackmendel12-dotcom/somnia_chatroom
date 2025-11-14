# Building Subgraph UIs (NextJS/Fetch) | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Building DApps](/developer/building-dapps)
  3. [Data Indexing and Querying](/developer/building-dapps/data-indexing-and-querying)



# Building Subgraph UIs (NextJS/Fetch)

[Subgraphs](https://somnia.chain.love) allow developers to efficiently query Somnia blockchain data using GraphQL, making it easy to index and retrieve real-time blockchain activity. In this tutorial, you’ll learn how to:

  * Fetch blockchain data from a Subgraph API

  * Fix CORS errors using a NextJS API route

  * Display token transfers in a real-time UI




By the end of this guide, you'll have a fully functional UI that fetches and displays token transfers from Somnia’s Subgraph API.

## 

Prerequisites

  * Basic knowledge of React & Next.js.

  * A deployed Subgraph API on Somnia ([or use an existing one](https://somnia.chain.love/graph)).

  * Account on <https://somnia.chain.love>[](https://somnia.chain.love) see [guide](/developer/building-dapps/data-indexing-and-querying/protofire-subgraph).




## 

Create a NextJS Project

Start by creating a new Next.js app.

Copy
    
    
    npx create-next-app@latest somnia-subgraph-ui
    cd somnia-subgraph-ui

Then, install required dependencies.

Copy
    
    
    npm install thirdweb react-query graphql

## 

Define the Subgraph API in Environment Variables

Create a .env.local file in the root folder.

Copy
    
    
    NEXT_PUBLIC_SUBGRAPH_URL=https://proxy.somnia.chain.love/subgraphs/name/somnia-testnet/test-mytoken
    NEXT_PUBLIC_SUBGRAPH_CLIENT_ID=YOUR_CLIENT_ID

💡 Note: Restart your development server after modifying .env.local:

Copy
    
    
    npm run dev

## 

Create a NextJS API Route for the Subgraph

Since the Somnia Subgraph API has CORS restrictions, we’ll use a NextJS API route to act as a proxy.

Inside the app directory create the folder paths `**api/proxy**` and add a file `**route.ts**` Update the `**route.ts**` file with the following code:

Copy
    
    
    import { NextResponse } from "next/server";
    
    const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL as string;
    const CLIENT_ID = process.env.NEXT_PUBLIC_SUBGRAPH_CLIENT_ID as string;
    
    export async function POST(req: Request) {
      try {
        const body = await req.json();
    
    
        const response = await fetch(SUBGRAPH_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Client-ID": CLIENT_ID, // ✅ Pass the Subgraph Client ID
          },
          body: JSON.stringify(body),
        });
    
    
        const data = await response.json();
        return NextResponse.json(data);
      } catch (error) {
        console.error("Proxy Error:", error);
        return NextResponse.json({ error: "Failed to fetch from Subgraph" }, { status: 500 });
      }
    }

This code allows your frontend to make requests without triggering CORS errors.

## 

Fetch and Display Token Transfers in the UI

Now that we have the API set up, let’s build a React component that:

  * Sends the GraphQL query using fetch()

  * Stores the fetched data using useState()

  * Displays the token transfers in a simple UI




To fetch the latest 10 token transfers, we’ll use this GraphQL query:

Copy
    
    
    {
      transfers(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
        id
        from
        to
        value
        blockTimestamp
        transactionHash
      }
    }

This code fetches the last 10 transfers (first: 10) and orders them by timestamp (latest first). It retrieves wallet addresses (from, to) and the amount transferred (value) and includes the transaction hash (used to generate an explorer link).

## 

Fetch and Display Data in a React Component

Now, let’s integrate the query into our NextJS frontend. Create a folder `**components**` and add a file `**TokenTransfer.ts**`

We use `**useState()**` to store transfer data and `**useEffect()**` to fetch it when the component loads.

Copy
    
    
    "use client";
    import { useEffect, useState } from "react";
    
    export default function TokenTransfers() {
      // Store transfers in state
      const [transfers, setTransfers] = useState<any[]>([]);
      
      // Track loading state
      const [loading, setLoading] = useState(true);
    
    
    Next, we fetch the token transfer data when the component loads.
     useEffect(() => {
        async function fetchTransfers() {
          setLoading(true); // Show loading state
    
    
          const query = `
            {
              transfers(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
                id
                from
                to
                value
                blockTimestamp
                transactionHash
              }
            }
          `;
    
    
          const response = await fetch("/api/proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
          });
    
    
          const { data } = await response.json();
          setTransfers(data.transfers || []); // Store results in state
          setLoading(false); // Hide loading state
        }
    
    
        fetchTransfers();
      }, []);

Once data is fetched, we render it inside the UI.

Copy
    
    
    return (
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Latest Token Transfers</h2>
          
          {loading ? (
            <p>Loading transfers...</p>
          ) : (
            <ul>
              {transfers.map((transfer) => (
                <li key={transfer.id} className="mb-2 p-2 border rounded-lg">
                  <p><strong>From:</strong> {transfer.from}</p>
                  <p><strong>To:</strong> {transfer.to}</p>
                  <p><strong>Value:</strong> {parseFloat(transfer.value) / 1e18} STT</p>
                  <p>
                    <strong>TX:</strong>{" "}
                    <a
                      href={`https://shannon-explorer.somnia.network/tx/${transfer.transactionHash}`}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      View Transaction
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

The UI shows a loading message while data is being fetched. When data is ready, it displays the latest 10 token transfers. It formats transaction values (value / 1e18) to show the correct STT amount and provides a link to view each transaction on Somnia Explorer.

## 

Add the Component to the NextJS Page

Update the page.tsx file:

Copy
    
    
    "use client";
    import TokenTransfers from "../components/TokenTransfers";
    
    export default function Home() {
      return (
        <main className="min-h-screen p-8">
          <h1 className="text-2xl font-bold">Welcome to MyToken Dashboard</h1>
          <TokenTransfers />
        </main>
      );
    }

Restart the development server:

Copy
    
    
    npm run dev

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252FXbWJRdvQ4SHjCpp9uaBX%252FTokenTransfers.png%3Falt%3Dmedia%26token%3Dcafd3254-32a7-44ed-8481-6f47afa28e59&width=768&dpr=4&quality=100&sign=26ff9a1d&sv=2)

Now your NextJS UI dynamically fetches and displays token transfers from Somnia’s Subgraph! 🔥

[PreviousProtofire Subgraph](/developer/building-dapps/data-indexing-and-querying/protofire-subgraph)[NextBuilding Subgraph UIs (Apollo Client)](/developer/building-dapps/data-indexing-and-querying/building-subgraph-uis-apollo-client)

Last updated 7 months ago
