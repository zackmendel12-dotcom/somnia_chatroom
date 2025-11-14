# Streams Case Study: Formula 1 | Somnia Data Streams | Somnia Docs

Copy

  1. [Basics](/somnia-data-streams/basics)



# Streams Case Study: Formula 1

Streaming data from OpenF1 on-chain and building reactive applications

### 

Schemas

Driver schema

Copy
    
    
    uint32 number, string name, string abbreviation, string teamName, string teamColor

Cartesian 3D coordinates schema

Copy
    
    
    int256 x, int256 y, int256 z

The driver schema can extend the cartesian coordinates since the 3D coordinates will be used widely for other applications. Again this promotes re-usability of schemas.

### 

Schema registration and re-use

Copy
    
    
    const { SDK, zeroBytes32, SchemaEncoder } = require("@somnia-chain/streams");
    const {
        createPublicClient,
        http,
        createWalletClient,
        toHex,
        defineChain,
    } = require("viem");
    const { privateKeyToAccount } = require("viem/accounts");
    
    const dreamChain = defineChain({
      id: 50312,
      name: "Somnia Testnet",
      network: "testnet",
      nativeCurrency: {
        decimals: 18,
        name: "STT",
        symbol: "STT",
      },
      rpcUrls: {
        default: {
          http: [
            "https://dream-rpc.somnia.network",
          ],
        },
        public: {
          http: [
            "https://dream-rpc.somnia.network",
          ],
        },
      },
    })
    
    async function main() {
        // Connect to the blockchain to read data with the public client
        const publicClient = createPublicClient({
          chain: dreamChain,
          transport: http(),
        })
    
        const walletClient = createWalletClient({
          account: privateKeyToAccount(process.env.PRIVATE_KEY),
          chain: dreamChain,
          transport: http(),
        })
    
        // Connect to the SDK
        const sdk = new SDK({
          public: publicClient,
          wallet: walletClient,
        })
    
        // Setup the schemas
        const coordinatesSchema = `int256 x, int256 y, int256 z`
        const driverSchema = `uint32 number, string name, string abbreviation, string teamName, string teamColor`
    
        // Derive Etherbase schema metadata
        const coordinatesSchemaId = await sdk.streams.computeSchemaId(
          coordinatesSchema
        )
        if (!coordinatesSchemaId) {
          throw new Error("Unable to compute the schema ID for the coordinates schema")
        }
    
        const driverSchemaId = await sdk.streams.computeSchemaId(
          driverSchema
        )
        if (!driverSchemaId) {
          throw new Error("Unable to compute the schema ID for the driver schema")
        }
    
        const extendedSchema = `${driverSchema}, ${coordinatesSchema}`
        console.log("Schemas in use", {
          coordinatesSchemaId,
          driverSchemaId,
          coordinatesSchema,
          driverSchema,
          extendedSchema 
        })
    
        const isCoordinatesSchemaRegistered = await sdk.streams.isDataSchemaRegistered(coordinatesSchemaId)
        if (!isCoordinatesSchemaRegistered) {
          // We want to publish the driver schema but we need to publish the coordinates schema first before it can be extended
          const registerCoordinatesSchemaTxHash =
            await sdk.streams.registerDataSchemas([
              { id: "coords", schema: coordinatesSchema }
            ])
    
          if (!registerCoordinatesSchemaTxHash) {
            throw new Error("Failed to register coordinates schema")
          }
          console.log("Registered coordinates schema on-chain", {
            registerCoordinatesSchemaTxHash
          })
    
          await publicClient.waitForTransactionReceipt({ 
            hash: registerCoordinatesSchemaTxHash
          })
        }
    
        const isDriverSchemaRegistered = await sdk.streams.isDataSchemaRegistered(driverSchemaId)
        if (!isDriverSchemaRegistered) {
          // Now, publish the driver schema but extend the coordinates schema!
          const registerDriverSchemaTxHash = sdk.streams.registerDataSchemas([
            { id: "driver", schema: driverSchema, parentSchemaId: coordinatesSchemaId }
          ])
          if (!registerDriverSchemaTxHash) {
            throw new Error("Failed to register schema on-chain")
          }
          console.log("Registered driver schema on-chain", {
            registerDriverSchemaTxHash,
          })
    
          await publicClient.waitForTransactionReceipt({ 
            hash: registerDriverSchemaTxHash
          })
        }
    
        // Publish some data!! 
        const schemaEncoder = new SchemaEncoder(extendedSchema)
        const encodedData = schemaEncoder.encodeData([
            { name: "number", value: "44", type: "uint32" },
            { name: "name", value: "Lewis Hamilton", type: "string" },
            { name: "abbreviation", value: "HAM", type: "string" },
            { name: "teamName", value: "Ferrari", type: "string" },
            { name: "teamColor", value: "#F91536", type: "string" },
            { name: "x", value: "-1513", type: "int256" },
            { name: "y", value: "0", type: "int256" },
            { name: "z", value: "955", type: "int256" },
        ])
        console.log("encodedData", encodedData)
    
        const dataStreams = [{
          // Data id: DRIVER number - index will be a helpful lookup later and references ./data/f1-coordinates.js Cube 4 coordinates (driver 44) - F1 telemetry data
          id: toHex(`44-0`, { size: 32 }),
          schemaId: driverSchemaId,
          data: encodedData
        }]
    
        const publishTxHash = await sdk.streams.set(dataStreams)
        console.log("\nPublish Tx Hash", publishTxHash)
    }

[PreviousSomnia Data Streams Reactivity](/somnia-data-streams/basics/somnia-data-streams-reactivity)[NextData Provenance and Verification in Streams](/somnia-data-streams/intermediate/data-provenance-and-verification-in-streams)

Last updated 11 days ago
