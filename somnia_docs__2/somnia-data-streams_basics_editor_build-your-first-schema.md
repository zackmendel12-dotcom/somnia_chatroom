# Build Your First Schema | Somnia Data Streams | Somnia Docs

Copy

  1. [Basics](/somnia-data-streams/basics)
  2. [Introduction](/somnia-data-streams/basics/editor)



# Build Your First Schema

Before you can publish or read structured data on the Somnia Network using Somnia Data Streams, you must first define a Schema. A schema acts as the blueprint or data contract between your publisher and all subscribers who wish to interpret your data correctly.

In the Somnia Data Streams system, every schema is expressed as a canonical string. A strict, ordered list of fields with Solidity compatible types.

For example, a chat application schema:

Copy
    
    
    uint64 timestamp, bytes32 roomId, string content, string senderName, address sender

This simple definition:

  * Establishes how data should be encoded and decoded on-chain.

  * Produces a unique schemaId derived from its exact string representation.

  * Enables multiple publishers and readers to exchange data consistently, without needing to redeploy contracts or agree on custom ABIs.




Each schema you define becomes a typed, reusable data model, similar to a table definition in a database or an ABI for events, but far simpler. Once created, schemas can be:

  * Reused across many applications.

  * Extended to create hierarchical data definitions (e.g., “GPS coordinates” → “Vehicle telemetry”).

  * Versioned by creating new schemas when structure changes occur. 




This tutorial will walk you through building, registering, and validating your first schema step by step.

## 

Prerequisites

Before continuing, ensure you have the following:

  1. Node.js 18+ (with npm or yarn)

  2. TypeScript configured in your project

  3. `.env.local` file for environment variables

Add your credentials to .env.local:

Copy
         
         RPC_URL=https://dream-rpc.somnia.network
         PRIVATE_KEY=0xYOUR_FUNDED_PRIVATE_KEY

  4. A Funded Testnet Account. You’ll need an address with test tokens on the Somnia Testnet to register schemas or publish data. 




NOTE: The Private Key is only required if connecting a Private Key via a Viem wallet account. Important: Never expose your private key to a client-side environment. Keep it in server scripts or backend environments only.

* * *

## 

What You’ll Build

In this tutorial, you will:

  * Create a canonical schema string (your “data ABI”)

  * Compute the schema ID

  * Register your schema on-chain (idempotently)

  * Validate your schema with a simple encode/decode test 




We’ll use a chat message schema as a running example:

Copy
    
    
    uint64 timestamp, bytes32 roomId, string content, string senderName, address sender

This schema represents a single chat message, which can be used later to build a full on-chain chat application.

* * *

## 

Project Setup

### 

Install dependencies

Copy
    
    
    npm i @somnia-chain/streams viem
    npm i -D @types/node

### 

Define Chain configuration

Copy
    
    
    // src/lib/chain.ts
    import { defineChain } from 'viem'
    
    export const somniaTestnet = defineChain({
      id: 50312,
      name: 'Somnia Testnet',
      network: 'somnia-testnet',
      nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
      rpcUrls: {
        default: { http: ['https://dream-rpc.somnia.network'] },
        public:  { http: ['https://dream-rpc.somnia.network'] },
      },
    })

### 

Set up your clients

Copy
    
    
    // src/lib/clients.ts
    import { createPublicClient, createWalletClient, http } from 'viem'
    import { privateKeyToAccount } from 'viem/accounts'
    import { somniaTestnet } from './chain'
    
    function need(key: 'RPC_URL' | 'PRIVATE_KEY') {
      const v = process.env[key]
      if (!v) throw new Error(`Missing ${key} in .env.local`)
      return v
    }
    
    export const publicClient = createPublicClient({
      chain: somniaTestnet,
      transport: http(need('RPC_URL')),
    })
    
    export const walletClient = createWalletClient({
      account: privateKeyToAccount(need('PRIVATE_KEY') as `0x${string}`),
      chain: somniaTestnet,
      transport: http(need('RPC_URL')),
    })

* * *

## 

Define the Schema String

Copy
    
    
    // src/lib/chatSchema.ts
    export const chatSchema =
      'uint64 timestamp, bytes32 roomId, string content, string senderName, address sender'

Field order matters, and ensure to always use Solidity-compatible types. It is important to keep the `string` fields short to minimize gas. Note that changing type or order creates a new schema ID. 

* * *

## 

Compute the schemaId

Copy
    
    
    // scripts/compute-schema-id.ts
    import 'dotenv/config'
    import { SDK } from '@somnia-chain/streams'
    import { publicClient } from '../src/lib/clients'
    import { chatSchema } from '../src/lib/chatSchema'
    
    async function main() {
      const sdk = new SDK({ public: publicClient })
      const id = await sdk.streams.computeSchemaId(chatSchema)
      console.log('Schema ID:', id)
    }
    
    main().catch((e) => {
      console.error(e)
      process.exit(1)
    })

The SDK computes a unique hash of the schema string. This `schemaId` is your permanent identifier. Anyone using the same schema string will derive the same ID _[confirm with Vincent for correctness]_. 

* * *

## 

Register the Schema

Registration makes your schema discoverable and reusable by others. _[confirm with Vincent for correctness]_.

Copy
    
    
    // scripts/register-schema.ts
    import 'dotenv/config'
    import { SDK, zeroBytes32 } from '@somnia-chain/streams'
    import { publicClient, walletClient } from '../src/lib/clients'
    import { chatSchema } from '../src/lib/chatSchema'
    import { waitForTransactionReceipt } from 'viem/actions'
    
    async function main() {
      const sdk = new SDK({ public: publicClient, wallet: walletClient })
      const id = await sdk.streams.computeSchemaId(chatSchema)
    
      const isRegistered = await sdk.streams.isSchemaRegistered(id)
      if (isRegistered) {
        console.log('Schema already registered.')
        return
      }
    
      const txHash = await sdk.streams.registerDataSchemas({ id: "chat", schema: chatSchema })
      console.log('Register tx:', txHash)
    
      const receipt = await waitForTransactionReceipt(publicClient, { hash: txHash })
      console.log('Registered in block:', receipt.blockNumber)
    }
    
    main().catch((e) => {
      console.error(e)
      process.exit(1)
    })

`isSchemaRegistered()` checks chain state. `registerSchema()` publishes the schema definition to Streams. Thus, the transaction is idempotent, meaning that it is safe to re-run.

* * *

## 

Encode and Decode a Sample Payload

Test your schema locally before publishing any data.

Copy
    
    
    // scripts/encode-decode.ts
    import 'dotenv/config'
    import { SchemaEncoder } from '@somnia-chain/streams'
    import { toHex, type Hex } from 'viem'
    import { chatSchema } from '../src/lib/chatSchema'
    
    const encoder = new SchemaEncoder(chatSchema)
    
    const encodedData: Hex = encoder.encodeData([
      { name: 'timestamp',  value: Date.now().toString(),     type: 'uint64' },
      { name: 'roomId',     value: toHex('general', { size: 32 }), type: 'bytes32' },
      { name: 'content',    value: 'Hello Somnia!',           type: 'string' },
      { name: 'senderName', value: 'Victory',                 type: 'string' },
      { name: 'sender',     value: '0x0000000000000000000000000000000000000001', type: 'address' },
    ])
    
    console.log('Encoded:', encodedData)
    console.log('Decoded:', encoder.decodeData(encodedData))

`encodeData()` serializes the payload according to the schema definition. `decodeData()` restores readable field values from the encoded hex. This step ensures your schema fields align correctly.

* * *

## 

Conclusion

You’ve just built and registered your first schema on Somnia Data Streams.

Your schema now acts as a public data contract between any publisher and subscriber that wants to communicate using this structure. 

[PreviousIntroduction to Somnia Data Streams](/somnia-data-streams/basics/editor/introduction-to-somnia-data-streams)[NextUnderstanding Schemas, Schema IDs, Data IDs, and Publisher](/somnia-data-streams/basics/editor/understanding-schemas-schema-ids-data-ids-and-publisher)

Last updated 11 days ago
