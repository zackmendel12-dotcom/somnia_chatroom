# Ormi Subgraph | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Building DApps](/developer/building-dapps)
  3. [Data Indexing and Querying](/developer/building-dapps/data-indexing-and-querying)



# Ormi Subgraph

The Graph is a decentralized indexing protocol that allows developers to query blockchain data using GraphQL. Instead of parsing complex raw logs and events directly from smart contracts, developers can build subgraphs that transform onchain activity into structured, queryable datasets.

This tutorial demonstrates how to deploy a subgraph on the Somnia Testnet using [Ormi](https://ormilabs.com), a powerful gateway that simplifies subgraph deployment through a hosted Graph Node and IPFS infrastructure.

## 

Prerequisites

  * GraphQL is installed and set up on your local machine.

  * A verified smart contract address deployed on Somnia.

  * An Ormi account and Private Key.




## 

Install Graph CLI globally

Copy
    
    
    npm install -g @graphprotocol/graph-cli

## 

Initialize Your Subgraph

The Graph services rely on the existence of a deployed Smart Contract with onchain activity. The subgraph will be created based on indexing the events emitted from the Smart Contract. To set up a subgraph service for an example contract called `**MyToken**` run the following command to scaffold a new subgraph project:

Copy
    
    
    graph init --contract-name MyToken --from-contract 0xYourTokenAddress --network somnia-testnet mytoken

`**mytoken**`**** is the folder that contains the subgraph files. Replace `0xYourTokenAddress` with your actual deployed Smart Contract address on Somnia.

This command will generate the following files:

  * `subgraph.yaml`Defines the data sources and events to index

  * `schema.graphql` Structure of your data

  * `src/mytoken.ts`TypeScript logic to handle events




## 

Define the Subgraph Schema

For the example`MyToken` Contract, which is an ERC20 Token, Edit `schema.graphql` to index all the Transfer events emitted from the Smart Contract.

Copy
    
    
    type Transfer @entity(immutable: true) {
      id: Bytes!
      from: Bytes!
      to: Bytes!
      value: BigInt!
      blockNumber: BigInt!
      blockTimestamp: BigInt!
      transactionHash: Bytes!
    }

## 

Build the Subgraph

After customizing your schema and mapping logic, build the subgraph by running the command:

Copy
    
    
    graph codegen && graph build

This will generate the necessary `artifacts` for deployment.

## 

Deploy Using Ormi

Open the Somnia Ormi website <https://subgraph.somnia.network/>[](https://subgraph.somnia.network/) and create an account.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252FAm7Rs07ZpEQcTVVmaI4q%252FOrmi-Login.png%3Falt%3Dmedia%26token%3D7e677985-72ea-446a-8697-8dc96ac2371c&width=768&dpr=4&quality=100&sign=a60c831f&sv=2)

On the left navigation menu, click the "key" icon to access your `privateKey.`

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252FOxEJLWk2vP58mYRizSZh%252FOrmi-pKey.png%3Falt%3Dmedia%26token%3D2cf1a5d2-fbe7-4c0a-b27c-89d8950c909d&width=768&dpr=4&quality=100&sign=c7b45bde&sv=2)

Deploy your subgraph to Ormi’s hosted infrastructure with the following command:

Copy
    
    
    graph deploy mytoken --node https://api.subgraph.somnia.network/deploy --ipfs https://api.subgraph.somnia.network/ipfs --deploy-key yourORMIPrivateKey

Replace yourPrivateKey with your Somnia Ormi account private key.

Once deployed, Ormi will return a GraphQL endpoint where you can begin querying your subgraph.

Return to the dashboard to find your list of deployed subgraphs.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252F9oMGwE0EgK52fFmIQeZm%252FOrmi-dash.png%3Falt%3Dmedia%26token%3D549aaf6c-5999-4fc5-be3b-10de24c9dc74&width=768&dpr=4&quality=100&sign=ec5b46c4&sv=2)

Open the deployed subgraph in the explorer to interact with it:

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252FMzzQXDCRdUcvrpiLQkW4%252Formi-explorer.png%3Falt%3Dmedia%26token%3D8b9f0dcf-7424-49c1-a3d1-510d6a89e324&width=768&dpr=4&quality=100&sign=bee5bc55&sv=2)

## 

Conclusion

You have successfully deployed a subgraph to index events emitted from your Smart Contract. To challenge yourself even further, you can extend your build:

  * Expand your schema and mapping logic to cover more events.

  * Connect your subgraph to a frontend UI or analytics dashboard. 




For more information, visit the Ormi [docs](https://docs.ormilabs.com/dedicated-env/somnia/subgraphs/overview).

[PreviousData Indexing and Querying](/developer/building-dapps/data-indexing-and-querying)[NextProtofire Subgraph](/developer/building-dapps/data-indexing-and-querying/protofire-subgraph)

Last updated 1 month ago
