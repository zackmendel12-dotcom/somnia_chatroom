# Extending and composing data schemas | Somnia Data Streams | Somnia Docs

Copy

  1. [Basics](/somnia-data-streams/basics)



# Extending and composing data schemas

The best blockchain primitives are composable and schemas are no exception. Promoting re-use is a priority

New schemas can extend other schemas by setting a parent schema ID. Remember, you can take any raw schema string and compute a schema ID from it. When registering a new schema that builds upon and extends another, you would specify the raw schema string for the new schema as well as specifying the optional parent schema ID. The parent schema ID will be critical later for deserialising data written to chain. For schemas that do not extend other schemas (when nothing is available), then one does not need to specify a parent schema ID or can optionally specify the zero value for the bytes32 solidity type. For maximum composability, all schemas should be public.

### 

Extension in practice (Example 1)

Copy
    
    
    import { SDK } from "@somnia-chain/streams"
    const sdk = new SDK({
        public: getPublicClient(),
        wallet: getWalletClient(),
    })
    
    // The parent schema here will be the GPS schema from the quick start guide
    const gpsSchema = `uint64 timestamp, int32 latitude, int32 longitude, int32 altitude, uint32 accuracy, bytes32 entityId, uint256 nonce`
    const parentSchemaId = await sdk.streams.computeSchemaId(gpsSchema)
    
    // Lets extend the gps schema and add F1 data since every car will have a gps position
    const formulaOneSchema = `uint256 driverNumber`
    
    // We can also extend the gps schema for FR data i.e. aircraft identifier
    const flightRadarSchema = `bytes32 ICAO24`
    
    await sdk.streams.registerDataSchemas([
        { id: "gps", schema: gpsSchema },
        { id: "f1", schema: formulaOneSchema, parentSchemaId }, // F1 extends GPS
        { id: "FR", schema: flightRadarSchema, parentSchemaId },// FR extends GPS
    ])

The typescript code shows how two new schemas re-use the GPS schema in order to append an additional field 

### 

Extension in practice (Example 2)

Versioned schemas

Copy
    
    
    import { SDK } from "@somnia-chain/streams"
    const sdk = new SDK({
        public: getPublicClient(),
        wallet: getWalletClient(),
    })
    
    const versionSchema = `uint16 version`
    const parentSchemaId = await sdk.streams.computeSchemaId(versionSchema)
    
    // Now lets register a person schema with expectation there will be many versions of the person schema
    const personSchema = `uint8 age` 
    await sdk.streams.registerDataSchemas([
        { id: "version", schema: versionSchema },
        { id: "person", schema: personSchema, parentSchemaId }
    ])

Client's that are reading data associated with the derived schemas, use the SDK to get the fully decoded data since data is retrieved by schema ID (See `getByKey` from the quick start guide). Essentially the SDK does a number of the following pseudo steps:

  1. Fetch schema and recursively fetch parent schema until the end of the chain is reached

  2. Join all schemas together seperated by comma

  3. Spin up the decoder and pass through the raw data stored on-chain

  4. Return the decoded data to the caller




[PreviousUnderstanding Schemas, Schema IDs, Data IDs, and Publisher](/somnia-data-streams/basics/editor/understanding-schemas-schema-ids-data-ids-and-publisher)[NextSomnia Data Streams Reactivity](/somnia-data-streams/basics/somnia-data-streams-reactivity)

Last updated 11 days ago
