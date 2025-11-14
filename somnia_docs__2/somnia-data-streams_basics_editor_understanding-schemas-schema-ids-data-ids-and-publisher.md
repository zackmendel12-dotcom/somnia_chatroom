# Understanding Schemas, Schema IDs, Data IDs, and Publisher | Somnia Data Streams | Somnia Docs

Copy

  1. [Basics](/somnia-data-streams/basics)
  2. [Introduction](/somnia-data-streams/basics/editor)



# Understanding Schemas, Schema IDs, Data IDs, and Publisher

Somnia Data Streams uses a schema-driven architecture to store and manage blockchain data. Every piece of information stored on the network, whether it’s a chat message, leaderboard score, or todo item, follows a structured schema, is identified by a Schema ID, written with a Data ID, and associated with a Publisher.

In this guide, you’ll learn the difference between Schemas and Schema IDs, how Data IDs uniquely identify records, and how Publishers own and manage their data streams.

  * Schemas define the structure of your data.

  * Data IDs uniquely identify individual records.

  * Publisher determines who owns or controls the data stream.




By the end, you’ll understand how to organize, reference, and manage your application’s data on Somnia.

## 

What Are Schemas?

A Schema defines the structure and types of the data you want to store onchain. It’s like a blueprint for how your application’s data is encoded, stored, and decoded. A Schema ID, on the other hand, is a unique deterministic hash computed from that schema definition.

When you register or compute a schema, the SDK automatically generates a unique hash (Schema ID) that permanently represents that schema definition.

A schema describes the structure of your data, much like a table in a relational database defines its columns.

#### 

Example: Defining a Schema

Copy
    
    
    const userSchema = `
      uint64 timestamp,
      string username,
      string bio,
      address owner
    `

This schema tells the Somnia Data Streams system how your data is structured and typed. 

## 

Schema ID: The Unique Identifier

A Schema ID is derived from your schema using a hashing algorithm. It uniquely represents this structure onchain, ensuring consistency and integrity. You can compute its Schema ID before even deploying it onchain.

Copy
    
    
    import { SDK } from '@somnia-chain/streams'
    import { getSdk } from './clients'
    
    const sdk = getSdk()
    const schemaId = await sdk.streams.computeSchemaId(userSchema)
    
    console.log("Computed Schema ID:", schemaId)

Example Output:

Copy
    
    
    Computed Schema ID: 0x5e4bce54a39b42b5b8a235b5d9e27e7031e39b65d7a42a6e0ac5e8b2c79e17b0
    

This hash (schemaId) uniquely identifies the schema onchain. If you change even one character in the schema definition, the Schema ID will change.

The Schema ID is the hash that ensures the same structure is used everywhere, preventing mismatched or corrupted data.

## 

Registering a Schema

To make the schema usable onchain, it has to be registered by calling the `registerDataSchemas()` method. This ensures other nodes and apps can decode your data correctly:

Copy
    
    
    import { zeroBytes32 } from '@somnia-chain/streams'
    
    const ignoreExistingSchemas = true
    await sdk.streams.registerDataSchemas([
      { id: "MySchema", schema: userSchema, parentSchemaId: zeroBytes32 }
    ], ignoreExistingSchemas)

`id` is a string. human human-readable identifier`ignoreExistingSchemas` is for telling the SDK not to worry about already registered schemas. Once registered, any publisher can use this Schema ID to store or retrieve data encoded according to this structure. The schema defines structure. The Schema ID becomes its permanent onchain reference.

Concept

Database Equivalent

Description

Schema

Table Definition

Defines data fields and types

Schema ID

Table Hash

Uniquely identifies that schema definition

For instance:

`Schema → CREATE TABLE Users (id INT, name TEXT)`

`Schema ID → 0x9f3a...a7c (hash of the above definition)`

## 

What Are Data IDs?

Every record written to Somnia (e.g., a single message, transaction, or post) must have a Data ID, a unique key representing that entry. It uniquely identifies a specific record (or row). The Data ID ensures that:

  * Each entry can be updated or replaced deterministically.

  * Developers can reference or fetch a specific record by key.

  * Duplicate writes can be prevented.




#### 

Example: Creating a Data ID

A Data ID can be created by hashing a string, typically by combining context and timestamp.

Copy
    
    
    import { toHex } from 'viem'
    
    const dataId = toHex(`username-${Date.now()}`, { size: 32 })
    console.log("Data ID:", dataId)

Example Output:

Copy
    
    
    Data ID: 0x757365726e616d652d31373239303239323435

You can now use this ID to publish structured data to the blockchain. A Data ID ensures every record written is unique and can be referenced or updated deterministically.

#### 

Example: Writing Data with a Schema and Data ID

Copy
    
    
    import { SchemaEncoder } from '@somnia-chain/streams'
    
    const encoder = new SchemaEncoder(userSchema)
    const encodedData = encoder.encodeData([
      { name: 'timestamp', value: Date.now().toString(), type: 'uint64' },
      { name: 'username', value: 'Victory', type: 'string' },
      { name: 'bio', value: 'Blockchain Developer', type: 'string' },
      { name: 'owner', value: '0xYourWalletAddress', type: 'address' },
    ])
    
    await sdk.streams.set([
      { id: dataId, schemaId, data: encodedData }
    ])

Think of a Data ID like a primary key in a SQL table.

Data ID (Primary Key)

username

bio

0x1234abcd...

Emmanuel

Blockchain Developer

If you write another record with the same Data ID, it updates the existing entry rather than duplicating it, thereby maintaining data integrity. `schemaId` defines how to encode/decode the data, and `dataId` identifies which record this is. The data itself is encoded and written to the blockchain

## 

What Are Publishers?

A Publisher is any wallet address that sends data to Somnia Streams. Each publisher maintains its own isolated namespace for all schema-based data it writes. This means:

  * Data from two different publishers never conflict.

  * Apps can filter or query data from a specific publisher.

  * Publishers serve as the data owners for all records they create.




#### 

Example: Getting a Publisher Address

If you’re using a connected wallet, your publisher is automatically derived using the `createWalletClient` from viem:

Copy
    
    
    const {
        ...
        createWalletClient,
    } = require("viem");
    
    const { privateKeyToAccount } = require("viem/accounts");
    
    // Create wallet client
    const walletClient = createWalletClient({
        account: privateKeyToAccount(process.env.PRIVATE_KEY),
        chain: dreamChain,
        transport: http(dreamChain.rpcUrls.default.http[0]),
    });
    
    // Initialize SDK
    const sdk = new SDK({
        ...
        wallet: walletClient,
    });
    
    const encodedData = schemaEncoder.encodeData([
           ...
        { name: "sender", value: wallet.account.address, type: "address" },
    ]);

Where `publisher = wallet.account.address`

When reading data, you can specify which publisher’s records to fetch:

Copy
    
    
    const messages = await sdk.streams.getAllPublisherDataForSchema(schemaId, publisherAddress)

Example Output:

Copy
    
    
    [
      { timestamp: 1729302920, username: "Victory", bio: "Blockchain Developer" }
    ]

This retrieves all data published under that schema by that particular address.

Think of Publishers like individual database owners. Each one maintains their own “tables” (schemas) and “records” (data entries) under their unique namespace.

Publisher (Wallet)

Schema ID

Data ID

Description

0x123...abc

Schema A

Data 1

Paul’s todos

0x789...def

Schema A

Data 2

Emmanuel’s todos

## 

Putting It All Together

When you publish data on Somnia, three identifiers always work together:

Concept

Role

Example

Schema ID

Identifies schema hash

0x5e4bce54...

Data ID

Identifies record

0x75736572...

Publisher

Identifies sender

0x3dC360e038...

These three make your data verifiable, queryable, and uniquely name-spaced across the blockchain. These form the foundation of the Somnia Data Streams architecture:

  * The Schema tells the system what kind of data this is.

  * The Schema ID ensures it’s stored consistently across the network.

  * The Data ID identifies which record this is.

  * The Publisher records who wrote it.




## 

Example Use Case: Chat Messages

Here’s how they interact in a real-world scenario, a decentralized chat room.

### 

Step 1: Define Schema

Copy
    
    
    const chatSchema = `
      uint64 timestamp,
      bytes32 roomId,
      string content,
      string senderName,
      address sender
    `

### 

Step 2: Compute Schema ID

Copy
    
    
    const schemaId = await sdk.streams.computeSchemaId(chatSchema)

### 

Step 3: Generate Data ID for each message

Copy
    
    
    const dataId = toHex(`${roomName}-${Date.now()}`, { size: 32 })

### 

Step 4: Publish Message

Copy
    
    
    const encoded = encoder.encodeData([
      { name: 'timestamp', value: Date.now().toString(), type: 'uint64' },
      { name: 'roomId', value: toHex(roomName, { size: 32 }), type: 'bytes32' },
      { name: 'content', value: 'Hello world!', type: 'string' },
      { name: 'senderName', value: 'Victory', type: 'string' },
      { name: 'sender', value: publisherAddress, type: 'address' }
    ])
    
    await sdk.streams.set([{ id: dataId, schemaId, data: encoded }])

Now each message:

  * Conforms to a schema

  * Is identified by a Schema ID

  * Is stored under a unique Data ID

  * Is published by a specific Publisher




### 

Common Pitfalls

Mistake

Description

Fix

Reusing Data IDs incorrectly

Causes overwrites of older records

Use unique IDs like title-timestamp

Forgetting to register schema

Data won’t decode properly

Always call registerDataSchemas() once

Mixing publisher data

Leads to incomplete reads

Query by the correct publisher address

### 

Conclusion

Now that you understand Schemas, Data IDs, and Publishers, you’re ready to build your own data model for decentralized apps and query live data across multiple publishers

[PreviousBuild Your First Schema](/somnia-data-streams/basics/editor/build-your-first-schema)[NextExtending and composing data schemas](/somnia-data-streams/basics/extending-and-composing-data-schemas)

Last updated 6 days ago
