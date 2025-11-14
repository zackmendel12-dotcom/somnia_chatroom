# Building Subgraph UIs (Apollo Client) | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Building DApps](/developer/building-dapps)
  3. [Data Indexing and Querying](/developer/building-dapps/data-indexing-and-querying)



# Building Subgraph UIs (Apollo Client)

This guide will teach you how to create a minimal, functional UI that queries blockchain data from a Somnia subgraph using Next.js, Apollo Client, and GraphQL.

## 

Prerequisites

  * Basic knowledge of React and Next.js

  * Node.js installed (v16 or higher)

  * A deployed subgraph on Somnia (we'll use [SomFlip](https://shannon-explorer.somnia.network/address/0x014F851965F281d6112FC7F6dfe8c331C413Eb9b) as an example)




## 

What You'll Build

A clean, minimal interface that:

  * Displays all coin flip results with pagination

  * Shows a live feed that auto-refreshes every 5 seconds




## 

Create a Next.js Project

Start by creating a new Next.js application with TypeScript and TailwindCSS:

Copy
    
    
    npx create-next-app@latest somnia-subgraph-ui --typescript --tailwind --app
    cd somnia-subgraph-ui

Install the required GraphQL dependencies:

Copy
    
    
    npm install @apollo/client graphql

## 

Understand the Architecture

Before we code, let's understand how the pieces fit together:

Copy
    
    
    User Interface (React Components)
            ↓
    Apollo Client (GraphQL Client)
            ↓
    GraphQL Queries
            ↓
    Somnia Subgraph API
            ↓
    Blockchain Data

## 

Set Up Apollo Client

Apollo Client is a comprehensive GraphQL client that manages data fetching, caching, and state management. Create a `lib` directory and create a file `apollo-client.ts`

Copy
    
    
    import { ApolloClient, InMemoryCache } from '@apollo/client';
    const client = new ApolloClient({
      // The URI of your subgraph endpoint
      uri: 'https://proxy.somnia.chain.love/subgraphs/name/somnia-testnet/SomFlip',
      
      // Apollo's caching layer - stores query results
      cache: new InMemoryCache(),
    });
    
    export default client;

The `URI` is the endpoint where your subgraph is hosted, and `InMemoryCache` will store the query results in memory for fast access

## 

Create the Apollo Provider Wrapper

React components need access to the Apollo Client. We'll create a wrapper component that provides this access to the entire app. Create a `components` directory and create a file `ApolloWrapper.tsx`.

Copy
    
    
    'use client';  // Next.js 13+ directive for client-side components
    
    import { ApolloProvider } from '@apollo/client';
    import client from '@/lib/apollo-client';
    
    // This component wraps your app with Apollo's context provider
    export default function ApolloWrapper({ 
      children 
    }: { 
      children: React.ReactNode 
    }) {
      return (
        <ApolloProvider client={client}>
          {children}
        </ApolloProvider>
      );
    }

ApolloProvider: Makes the Apollo Client available to all child components

## 

Update app/layout.tsx

Copy
    
    
    import ApolloWrapper from '@/components/ApolloWrapper';
    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <html lang="en">
          <body>
            <ApolloWrapper>
              {children}
            </ApolloWrapper>
          </body>
        </html>
      );
    }

## 

Create GraphQL Queries

GraphQL queries define exactly what data you want from the subgraph. Let's create queries for our two main features. In the `lib` directory create a `queries.ts` file.

queries.ts

Copy
    
    
    import { gql } from '@apollo/client';
    // Query for paginated flip results
    export const GET_FLIP_RESULTS = gql`
      query GetFlipResults(
        $first: Int!,        # Number of results to fetch
        $skip: Int!,         # Number of results to skip (for pagination)
        $orderBy: String!,   # Field to sort by
        $orderDirection: String!  # 'asc' or 'desc'
      ) {
        flipResults(
          first: $first
          skip: $skip
          orderBy: $orderBy
          orderDirection: $orderDirection
        ) {
          id                 # Unique identifier
          player             # Wallet address of player
          betAmount          # Amount bet (in wei)
          choice             # Player's choice: HEADS or TAILS
          result             # Actual result: HEADS or TAILS
          payout             # Amount won (0 if lost)
          blockNumber        # Block when flip occurred
          blockTimestamp     # Unix timestamp
          transactionHash    # Transaction hash on blockchain
        }
      }
    `;
    
    
    // Query for recent flips (live feed)
    export const GET_RECENT_FLIPS = gql`
      query GetRecentFlips($first: Int!) {
        flipResults(
          first: $first
          orderBy: blockTimestamp
          orderDirection: desc  # Most recent first
        ) {
          id
          player
          betAmount
          choice
          result
          payout
          blockTimestamp
          transactionHash
        }
      }
    `;

Note the following:

  * `gql` is the template literal tag that parses GraphQL queries

  * Variables start with $ and have types (Int!, String!, etc.)

  * ! means the field is required (non-nullable)




## 

Build the All Flips Component

Let's build the All Flips component step by step, understanding each part in detail.

### 

Set Up the Component File

In the `components` directory create `AllFlips.tsx` file and add the following imports.

Copy
    
    
    'use client';  
    import { useState } from 'react';
    import { useQuery } from '@apollo/client';
    import { GET_FLIP_RESULTS } from '@/lib/queries';

### 

Create Utility Functions

Add these helper functions at the top of your component:

Copy
    
    
    / Shortens long blockchain addresses for display
    // Example: "0x1234567890abcdef" becomes "0x1234...cdef"
    const truncateHash = (hash: string) => {
      return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    };
    
    // Converts wei (smallest unit) to ether (display unit)
    // 1 ether = 1,000,000,000,000,000,000 wei (10^18)
    const formatEther = (wei: string) => {
      const ether = parseFloat(wei) / 1e18;
      return ether.toFixed(4);  // Show 4 decimal places
    };
    
    // Converts Unix timestamp to readable date
    // Blockchain stores time as seconds since Jan 1, 1970
    const formatTime = (timestamp: string) => {
      const milliseconds = parseInt(timestamp) * 1000;
      const date = new Date(milliseconds);
      return date.toLocaleString();
    };

### 

Component Function and State Management

Copy
    
    
    export default function AllFlips() {
      // Track which page of results we're viewing
      const [page, setPage] = useState(0);
      const itemsPerPage = 30;

`the number ofpage` tracks the current page number (starting at 0), which is used to calculate the number of results to skip. It updates when the user clicks the Previous/Next button.

### 

Execute the GraphQL Query 

Copy
    
    
    const { loading, error, data } = useQuery(GET_FLIP_RESULTS, {
        variables: {
          first: itemsPerPage,              // How many results to fetch
          skip: page * itemsPerPage,        // How many to skip
          orderBy: 'blockTimestamp',        // Sort by time
          orderDirection: 'desc',           // Newest first
        },
      });

The `useQuery` function is set to `loading: true` while fetching `data` and the `data` contains the query results when successful.

### 

Handle Query States

Copy
    
    
    // Show loading spinner while fetching
      if (loading) {
        return <div className="text-center py-8 text-gray-500">Loading...</div>;
      }
      
      // Show error message if query failed
      if (error) {
        return (
          <div className="text-center py-8 text-red-500">
            Error: {error.message}
          </div>
        );
      }
      
      // Check if we have results
      if (!data?.flipResults?.length) {
        return <div className="text-center py-8 text-gray-500">No flips found</div>;
      }

This prevents rendering errors and andles edge cases gracefully

### 

Render the Table View

AllFlips.tsx - Table View

Copy
    
    
    return (
        <div className="space-y-4">
          <div className="overflow-x-auto">  {/* Makes table scrollable on mobile */}
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Player</th>
                  <th className="text-left py-2">Bet</th>
                  <th className="text-left py-2">Choice</th>
                  <th className="text-left py-2">Result</th>
                  <th className="text-left py-2">Payout</th>
                  <th className="text-left py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {data.flipResults.map((flip: any) => (
                  <tr key={flip.id} className="border-b">
                    {/* Player address - truncated for readability */}
                    <td className="py-2 font-mono text-xs">
                      {truncateHash(flip.player)}
                    </td>
                    
                    {/* Bet amount - converted from wei to ether */}
                    <td className="py-2">
                      {formatEther(flip.betAmount)} STT
                    </td>
                    
                    {/* Player's choice - color coded */}
                    <td className="py-2">
                      <span className={
                        flip.choice === 'HEADS' 
                          ? 'text-blue-600'    // Blue for heads
                          : 'text-purple-600'  // Purple for tails
                      }>
                        {flip.choice}
                      </span>
                    </td>
                    
                    {/* Actual result - same color coding */}
                    <td className="py-2">
                      <span className={
                        flip.result === 'HEADS' 
                          ? 'text-blue-600' 
                          : 'text-purple-600'
                      }>
                        {flip.result}
                      </span>
                    </td>
                    
                    {/* Payout - green if won, gray if lost */}
                    <td className="py-2">
                      <span className={
                        flip.payout !== '0' 
                          ? 'text-green-600'   // Won
                          : 'text-gray-400'    // Lost
                      }>
                        {flip.payout !== '0' 
                          ? `+${formatEther(flip.payout)}` 
                          : '0'
                        } STT
                      </span>
                    </td>
                    
                    {/* Timestamp - converted to readable date */}
                    <td className="py-2 text-xs text-gray-500">
                      {formatTime(flip.blockTimestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between">
            {/* Previous button */}
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-4 py-2 text-sm bg-gray-100 rounded disabled:opacity-50"
            >
              Previous
            </button>
            
            {/* Current page indicator */}
            <span className="py-2 text-sm text-gray-600">
              Page {page + 1}
            </span>
            
            {/* Next button */}
            <button
              onClick={() => setPage(page + 1)}
              disabled={data.flipResults.length < itemsPerPage}
              className="px-4 py-2 text-sm bg-gray-100 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      );
    }

## 

Build the Live Feed Component

Now let's build the Live Feed component that automatically refreshes to show new flips.

### 

Set Up the Component

In the `components` directory create a `LiveFeed.tsx` file and update the imports.

Copy
    
    
    'use client';
    import { useQuery } from '@apollo/client';
    import { GET_RECENT_FLIPS } from '@/lib/queries';

### 

Create Utility Functions

Copy
    
    
    const truncateHash = (hash: string) => {
      return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    };
    
    const formatEther = (wei: string) => {
      return (parseFloat(wei) / 1e18).toFixed(4);
    };

### 

Component Function with Auto-Refresh

Copy
    
    
    export default function LiveFeed() {
      // Execute query with automatic polling
      const { loading, error, data } = useQuery(GET_RECENT_FLIPS, {
        variables: { 
          first: 10  // Get 10 most recent flips
        },
        pollInterval: 5000,  // Refresh every 5 seconds (5000ms)
      });

The `pollInterval` automatically re-executes the query every 5 seconds. New flips appear without user interaction with Apollo Client handling the refresh logic. You can set to 0 or remove to disable auto-refresh

### 

Handle Query States

Copy
    
    
    // Same loading/error handling as AllFlips
      if (loading) {
        return <div className="text-center py-8 text-gray-500">Loading...</div>;
      }
      
      if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;
      }
      
      if (!data?.flipResults?.length) {
        return <div className="text-center py-8 text-gray-500">No recent flips</div>;
      }
    

### 

Complete Live Feed Component

LiveFeed.tsx

Copy
    
    
    'use client';
    import { useQuery } from '@apollo/client';
    import { GET_RECENT_FLIPS } from '@/lib/queries';
    
    const truncateHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    const formatEther = (wei: string) => (parseFloat(wei) / 1e18).toFixed(4);
    
    export default function LiveFeed() {
      const { loading, error, data } = useQuery(GET_RECENT_FLIPS, {
        variables: { first: 10 },
        pollInterval: 5000,
      });
    
      if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;
      if (error) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;
      if (!data?.flipResults?.length) return <div className="text-center py-8 text-gray-500">No recent flips</div>;
    
      return (
        <div className="space-y-2">
          {data.flipResults.map((flip: any) => {
            const won = flip.payout !== '0';
            return (
              <div key={flip.id} className={`p-3 rounded border ${won ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-mono text-sm">{truncateHash(flip.player)}</span>
                    <span className="text-sm text-gray-500 ml-2">bet {formatEther(flip.betAmount)} STT</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      <span className={flip.choice === 'HEADS' ? 'text-blue-600' : 'text-purple-600'}>
                        {flip.choice}
                      </span>
                      <span className="mx-1">→</span>
                      <span className={flip.result === 'HEADS' ? 'text-blue-600' : 'text-purple-600'}>
                        {flip.result}
                      </span>
                    </div>
                    <div className={`text-sm font-semibold ${won ? 'text-green-600' : 'text-gray-400'}`}>
                      {won ? `Won ${formatEther(flip.payout)} STT` : 'Lost'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <p className="text-center text-xs text-gray-500 pt-2">Auto-refreshing every 5 seconds</p>
        </div>
      );
    }

The key differences from the AllFlips page are that there is no pagination (shows most recent only), and it auto-refreshes with pollInterval, with a visual emphasis on win/loss status.

## 

Update the Main Page.tsx

page.tsx

Copy
    
    
    'use client';
    import { useState } from 'react';
    import AllFlips from '@/components/AllFlips';
    import LiveFeed from '@/components/LiveFeed';
    
    export default function Home() {
      const [activeTab, setActiveTab] = useState('allFlips');
      return (
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">SomFlip</h1>
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab('allFlips')}
              className={`pb-2 px-1 ${
                activeTab === 'allFlips'
                  ? 'border-b-2 border-black font-semibold'
                  : 'text-gray-500'
              }`}
            >
              All Flips
            </button>
            <button
              onClick={() => setActiveTab('liveFeed')}
              className={`pb-2 px-1 ${
                activeTab === 'liveFeed'
                  ? 'border-b-2 border-black font-semibold'
                  : 'text-gray-500'
              }`}
            >
              Live Feed
            </button>
          </div>
          {/* Conditional Rendering Based on Active Tab */}
          {activeTab === 'allFlips' ? <AllFlips /> : <LiveFeed />}
        </div>
      );
    }

## 

Run Your Application

Copy
    
    
    npm run dev

Visit `http://localhost:3000` to see your UI in action.

[PreviousBuilding Subgraph UIs (NextJS/Fetch)](/developer/building-dapps/data-indexing-and-querying/building-subgraph-uis-nextjs-fetch)[NextUsing Data APIs (Ormi)](/developer/building-dapps/data-indexing-and-querying/using-data-apis-ormi)

Last updated 3 months ago
