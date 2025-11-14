# Listening to Blockchain Events (WebSocket) | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Building DApps](/developer/building-dapps)
  3. [Data Indexing and Querying](/developer/building-dapps/data-indexing-and-querying)



# Listening to Blockchain Events (WebSocket)

This guide teaches developers how to create WebSocket connections to listen for smart contract events on the Somnia network in real-time. We'll use a simple Greeting contract as an example to demonstrate the core concepts.

## 

Resources

Somnia Mainnet WebSocket

<wss://api.infra.mainnet.somnia.network/ws>[](wss://api.infra.mainnet.somnia.network/ws)

Somnia Testnet WebSocket

<wss://dream-rpc.somnia.network/ws>[](wss://dream-rpc.somnia.network/ws)

## 

Example Script

websocket-listener.js

Copy
    
    
    // const { ethers } = require("ethers");
    import { ethers } from "ethers";
    // Configuration
    const wsUrl = "wss://dream-rpc.somnia.network/ws";
    const contractAddress = "0xADA7b2953E7d670092644d37b6a39BAE3237beD7"; // Replace with your contract address
    
    // Contract ABI
    const abi = [
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: "string", name: "oldGreeting", type: "string" },
          { indexed: true, internalType: "string", name: "newGreeting", type: "string" },
        ],
        name: "GreetingSet",
        type: "event",
      },
      {
        inputs: [],
        name: "getGreeting",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
    ];
    
    async function listen() {
      // Create WebSocket provider and contract
      const provider = new ethers.WebSocketProvider(wsUrl);
      await provider._waitUntilReady();
      const contract = new ethers.Contract(contractAddress, abi, provider);
    
      console.log("Listening for events...\n");
    
      // Event filter
      const filter = {
        address: contractAddress,
        topics: [ethers.id("GreetingSet(string,string)")],
      };
    
      // Listen for events
      provider.on(filter, async (log) => {
        try {
          const greeting = await contract.getGreeting();
          console.log(`New greeting: "${greeting}"`);
        } catch (error) {
          console.error("Error:", error.message);
        }
      });
    
      // Keep connection alive
      setInterval(async () => {
        try {
          await provider.getBlockNumber();
        } catch (error) {
          console.error("Connection error");
        }
      }, 30000);
    
      // Handle shutdown
      process.on("SIGINT", () => {
        provider.destroy();
        process.exit(0);
      });
    }
    
    // Start listening
    listen().catch(console.error);
    

## 

Prerequisites

  * Node.js installed (v14 or higher)

  * Basic understanding of JavaScript

  * A deployed smart contract on Somnia network




## 

What are WebSockets?

WebSockets are a communication protocol that provides bidirectional communication channels over a single TCP connection. Unlike traditional HTTP requests, WebSockets maintain a persistent connection between the client and server.

### 

**How WebSockets Work**

WebSockets begin with a connection establishment phase where the client initiates a WebSocket handshake through an HTTP upgrade request. Once established, the connection stays open as a persistent channel between client and server. This enables bidirectional communication where both client and server can send messages at any time without waiting for requests. The protocol maintains low latency since there's no need to establish new connections for each message exchange. This design is highly efficient with minimal protocol overhead compared to traditional HTTP polling approaches.

**WebSocket Connection Lifecycle**

Copy
    
    
    Client                    Server
      |                         |
      |----Connection Request-->|
      |<---Connection Accept----|
      |                         |
      |<===Open Connection====> |
      |                         |
      |----Send Message-------->|
      |<---Receive Message------|
      |<---Push Notification----|
      |----Send Message-------->|
      |                         |
      |<===Open Connection====> |
      |                         |
      |----Close Connection---->|

### 

WebSocket vs HTTP Polling

#### 

**HTTP Polling Approach**

Copy
    
    
    // Inefficient: Constantly asking "Any updates?"
    setInterval(async () => {
        const response = await fetch('https://api.example.com/events');
        const data = await response.json();
        if (data.hasNewEvents) {
            console.log('New event:', data.events);
        }
    }, 5000); // Check every 5 seconds

The problem with polling is that Polling wastes bandwidth by constantly checking for updates even when none exist, leading to unnecessary network traffic. This approach introduces delays of up to the polling interval (5 seconds in our example), meaning users might wait several seconds to see new events that have already occurred. Additionally, the server must process these unnecessary requests repeatedly, increasing computational load and infrastructure costs. For blockchain applications, this translates to higher costs for RPC providers who often charge based on the number of requests made.

#### 

**WebSocket Approach**

Copy
    
    
    // Efficient: Server pushes updates immediately
    const ws = new WebSocket('wss://api.example.com/events');
    ws.on('message', (data) => {
        console.log('New event:', data); // Instant notification
    });

WebSockets provide real-time updates measured in milliseconds rather than seconds, ensuring users receive notifications instantly when events occur. This eliminates wasted requests since the server only sends data when there are actual updates, significantly reducing bandwidth usage. The reduced request frequency leads to lower server load and better resource utilization. For users, this translates to a superior experience with immediate feedback, while developers benefit from reduced infrastructure costs.

### 

Blockchain Events and WebSockets

Smart contracts emit events when important state changes occur. These events are included in transaction receipts and stored in blockchain logs.

The event flow begins when a user calls a Smart Contract function through a Transaction. During execution, the contract updates its Internal State and emits Events containing relevant data about the changes. These Transactions and their associated Events are then included in a new block by Validators. Once the Block is finalized, Nodes across the network broadcast it to their peers. WebSocket connections instantly notify connected clients about these new events, enabling real-time reactions to Blockchain state changes.

### 

**Example Use Cases for WebSocket Event Listening**

DeFi Applications

  * Monitor price updates on DEX swaps




NFT Marketplaces

  * Live bidding updates in auctions




Gaming DApps

  * Real-time game state updates




DAOs and Governance

  * Live voting updates




Supply Chain

  * Product status updates




### 

Indexed Parameters in Events

When you mark an event parameter as `indexed` in Solidity, it becomes part of the event's topics rather than the data section. This enables efficient filtering but changes how you access the data.

Non-Indexed String (accessible directly):

Copy
    
    
    event MessageSent(string message); // Can read 'message' directly from logs

Indexed String (hashed for filtering):

Copy
    
    
    event MessageSent(string indexed message); // 'message' is hashed, cannot read directly

**Why Use Indexed Parameters?**

`Indexed` parameters enable efficient filtering by allowing nodes to quickly find specific events without scanning through all logs in a block. They provide gas optimization since topics are more gas-efficient for filtering operations compared to parsing event data. Additionally, nodes can index and search these parameters significantly faster, improving overall query performance when applications need to find specific events based on parameter values.

**The Trade-off**

For strings and bytes, indexing means:

  * Can filter events by this parameter efficiently

  * Cannot retrieve the actual value from the event log

  * Must query contract state to get the current value




This is why, in our example, when we receive a `GreetingSet` event with indexed string parameters, we call contract.getGreeting() to retrieve the actual greeting text.

> The pattern for listening to blockchain events via WebSocket follows these principles:
> 
> The process begins by establishing a connection to the blockchain node's WebSocket endpoint, ensuring a persistent communication channel. Once connected, you create a filter that defines which events from which contracts to monitor, allowing precise event targeting. Next, you set up listener functions that register callbacks to execute when specific events occur. When events are received, your handler functions process the event data according to your application's needs. Throughout the connection lifetime, you must maintain the connection with periodic activity to prevent timeouts. Finally, when your application terminates, ensure a clean shutdown by properly closing all connections and removing event listeners.

## 

Code Breakdown

### 

Connect to Somnia WebSocket

Copy
    
    
    const wsUrl = 'wss://dream-rpc.somnia.network/ws'; //change url for Mainnet
    const provider = new ethers.WebSocketProvider(wsUrl);
    await provider._waitUntilReady();

The WebSocket URL for Somnia mainnet is `wss://dream-rpc.somnia.network/ws`. This creates a persistent connection to the network.

#### 

Create Contract Instance

Copy
    
    
    const contract = new ethers.Contract(contractAddress, abi, provider);

You need:

  * `Contract address`: The deployed address on Somnia.

  * `ABI`: At minimum, include the events you want to listen for.

  * `Provider`: The WebSocket connection.




### 

Define Event Filter

Copy
    
    
    const filter = {
        address: contractAddress,
        topics: [ethers.id("GreetingSet(string,string)")]
    };

The filter specifies:

  * Which contract to monitor

  * Which event signature to listen for




### 

Set Up Event Listener

Copy
    
    
    provider.on(filter, async (log) => {
        // Handle the event
        const greeting = await contract.getGreeting();
        console.log(`New greeting: "${greeting}"`);
    });

When an event is detected:

  1. The callback receives the log data

  2. Query the contract for the current state

  3. Process/display the data as needed




### 

Maintain Connection

Copy
    
    
    setInterval(async () => {
        await provider.getBlockNumber();
    }, 30000);

This is because WebSocket connections can timeout. Send periodic requests to keep the connection alive.

### 

Update the ABI

Include only the events and functions you need:

Copy
    
    
    const abi = [
        // Your event definition
        {
            "anonymous": false,
            "inputs": [
                // Your event parameters
            ],
            "name": "YourEventName",
            "type": "event"
        },
        // Any read functions you need
        {
            "inputs": [],
            "name": "yourReadFunction",
            "outputs": [/* outputs */],
            "stateMutability": "view",
            "type": "function"
        }
    ];

### 

Update the Event Filter

Change the event signature to match your event:

Copy
    
    
    const filter = {
        address: contractAddress,
        topics: [ethers.id("YourEventName(type1,type2)")]
    };

### 

Handle Event Data

Process the event based on your needs:

Copy
    
    
    provider.on(filter, async (log) => {
        // For non-indexed parameters, you can parse the log
        const parsedLog = contract.interface.parseLog(log);
        
        // For indexed strings, query the contract state
        const currentState = await contract.yourReadFunction();
        
        // Process your data
        console.log('Event detected:', currentState);
    });

## 

Common Patterns

### 

Multiple Events

Listen for multiple events from the same contract:

Copy
    
    
    // Listen for Event1
    provider.on({
        address: contractAddress,
        topics: [ethers.id("Event1(...)")]
    }, handleEvent1);
    
    
    // Listen for Event2
    provider.on({
        address: contractAddress,
        topics: [ethers.id("Event2(...)")]
    }, handleEvent2);

### 

Error Recovery

Add reconnection logic for production applications:

Copy
    
    
    async function connectWithRetry() {
        let retries = 0;
        while (retries < 5) {
            try {
                await listen();
                break;
            } catch (error) {
                console.log(`Retry ${++retries}/5...`);
                await new Promise(r => setTimeout(r, 5000));
            }
        }
    }

### 

Event History

Get recent events on startup:

Copy
    
    
    // Get last 100 blocks of events
    const currentBlock = await provider.getBlockNumber();
    const events = await contract.queryFilter('YourEventName', currentBlock - 100, currentBlock);
    events.forEach(event => {
        console.log('Historical event:', event);
    });

## 

Test Your WebSocket Connection

  1. Deploy your Smart Contract to Somnia network.

  2. Run the listener in one terminal:




Copy
    
    
    node websocket-listener.js

  1. Trigger events from another script or dApp

  2. Observe real-time updates in your listener




### 

Conclusion

WebSocket connections provide real-time event monitoring for smart contracts on Somnia. This guide demonstrated:

  1. Connecting to Somnia's WebSocket endpoint

  2. Listening for specific contract events

  3. Handling indexed parameters correctly

  4. Maintaining stable connections

  5. Adapting the pattern for any smart contract




With this foundation, you can build responsive dApps that react instantly to blockchain events without polling.

[PreviousUsing Data APIs (Ormi)](/developer/building-dapps/data-indexing-and-querying/using-data-apis-ormi)[NextOracles](/developer/building-dapps/oracles)

Last updated 2 months ago
