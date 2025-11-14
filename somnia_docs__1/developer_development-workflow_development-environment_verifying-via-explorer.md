# Verifying via Explorer | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Development Workflow](/developer/development-workflow)
  3. [Development Environment](/developer/development-workflow/development-environment)



# Verifying via Explorer

This documentation provides complete guidance for verifying your smart contracts using our web interface, API endpoints, Hardhat, and Foundry.

### 

How It Works

Somnia Explorer operates a comprehensive API server that includes **all stable Solidity compiler versions** (excluding nightly builds). Our verification system supports multiple methods to accommodate different development workflows:

  * Single File Verification: For simple contracts contained in one source file

  * Multi-Part File Verification: For complex contracts with multiple dependencies

  * Standard JSON Input: The recommended method with complete compilation metadata

  * API Verification: Submit verification requests programmatically through REST endpoints

  * Hardhat Verification: Verify contracts directly from your Hardhat environment using the Somnia Explorer API

  * Foundry Verification: Verify contracts from the command line with Foundry’s `forge verify-contract` command




### 

Verification Process

  1. Input Processing: We receive your contract information through web interface or API

  2. Compilation: Our system compiles your source code using the specified compiler version

  3. Response Generation: Verification results are returned with contract details




Recommendation: We strongly recommend using Standard JSON Input as it provides the most comprehensive information about your code, including optimizer settings and complete compilation metadata.

### 

1\. Explorer UI

The Somnia Explorer web interface provides an intuitive way to verify your smart contracts. The verification process is designed to be user-friendly while maintaining technical accuracy.

#### 

Getting Started

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F1861192046-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FFxD3cqyyFDzHJ0nfCPfy%252Fuploads%252FMXuYXhu4mR2Zugzgqo8e%252Fimage.png%3Falt%3Dmedia%26token%3Dba4b6612-a486-4724-9579-ccf8b8a9b5a9&width=768&dpr=4&quality=100&sign=dc3bbf4b&sv=2)

  * Navigate to the Verify Contract page on Somnia Explorer

  * Enter the contract address you want to verify

  * Select the appropriate compiler type from the available options




#### 

Solidity (Single File)

Perfect for simple contracts that don't have external dependencies or complex import structures.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F1861192046-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FFxD3cqyyFDzHJ0nfCPfy%252Fuploads%252FFjPOSJht0mt8ZTyTqPsE%252Fimage%25201.png%3Falt%3Dmedia%26token%3D203de58e-982d-49a4-9682-d9bab270505d&width=768&dpr=4&quality=100&sign=70145639&sv=2)

1

#### 

Single-file verification — Steps

  * Contract Code: Copy and paste your complete smart contract source code into the text area

  * Compiler version: Choose the Solidity compiler version used during development

  * Optimization Settings:

    * Enable optimization if it was used during compilation (default: disabled)

    * Set the optimization runs value (default: 200)

  * EVM Version: Select the appropriate EVM version (default: Prague)

  * License Type: Specify the open source license type for your contract

  * Constructor Arguments: Enter constructor parameters if your contract was deployed with initialization arguments

  * Submit: Click "Verify and Publish" to complete verification




#### 

Solidity (Multi-Part Files)

Ideal for complex contracts with multiple source files, libraries, and dependencies.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F1861192046-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FFxD3cqyyFDzHJ0nfCPfy%252Fuploads%252Fg3gvdQDAbnj6gookKVjV%252Fimage%25202.png%3Falt%3Dmedia%26token%3D2d3ad116-1511-46d5-a6c3-3a1aa0ad0ece&width=768&dpr=4&quality=100&sign=e95c30c3&sv=2)

1

#### 

Multi-file verification — Steps

  * File Upload: Upload all source files required for compilation

    * Supported formats: `.sol`, `.json`

    * Include all imported contracts and dependencies

  * Compiler version: Choose the Solidity compiler version used during development

  * Optimization Settings:

    * Enable optimization if it was used during compilation (default: disabled)

    * Set the optimization runs value (default: 200)

  * EVM Version: Select the appropriate EVM version (default: Prague)

  * License Type: Specify the open source license type for your contract

  * Constructor Arguments: Enter constructor parameters if your contract was deployed with initialization arguments

  * Submit: Click "Verify and Publish" to complete verification




#### 

Solidity (Standard-JSON-Input)

The most comprehensive verification method, recommended for production contracts.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F1861192046-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FFxD3cqyyFDzHJ0nfCPfy%252Fuploads%252FjX91luBTLBEvbDNa0pba%252Fimage%25203.png%3Falt%3Dmedia%26token%3Dbb65a698-3352-432b-b939-86c0c1a8a879&width=768&dpr=4&quality=100&sign=e3311242&sv=2)

1

#### 

Standard JSON input — Steps

  * JSON File Upload: Upload your complete Standard JSON input file

    * Supported formats: `.json`

    * Should include all compilation settings, optimizer configuration, and source mappings

  * Compiler version: Choose the Solidity compiler version used during development

  * License Type: Specify the open source license type for your contract

  * Constructor Arguments: Enter constructor parameters if your contract was deployed with initialization arguments

  * Submit: Click "Verify and Publish" to complete verification




### 

2\. API Verification

#### 

Base Configuration

API Base URL <https://explorer-somnia.api.xangle.io>[](https://explorer-somnia.api.xangle.io)

Required Header `X-Chain: SOMNIA`

#### 

Endpoints

**Single File Contract Verification**

POST `/api/contract/verify/single-file`

Content Type: `application/json`

Description: Verify a smart contract using a single Solidity source file.

Request Body

Copy
    
    
    {
      "mainNetType": "SOMNIA",
      "evmVersion": "string",
      "contractAddress": "string",
      "solcVersion": "string",
      "optimizationEnabled": boolean,
      "runs": number,
      "viaIR": boolean,
      "constructorArgs": "string",
      "sourceCode": "string"
    }

Response

Copy
    
    
    {
      "STS": "Y",
      "CTRTADDR": "string",
      "MSG": "string",
      "VA": number,
      "NM": "string",
      "BTCD": "string",
      "ABI": "string"
    }

**Multi-File Contract Verification**

POST `/api/contract/verify/multi-file`

Content Type: `multipart/form-data`

Description: Verify a smart contract using multiple source files.

Request Body

Copy
    
    
    {
      "mainNetType": "SOMNIA",
      "evmVersion": "string",
      "contractAddress": "string",
      "solcVersion": "string",
      "optimizationEnabled": boolean,
      "runs": number,
      "viaIR": boolean,
      "constructorArgs": "string",
      "sourceFileList": [
        "string($binary)"
      ]
    }

Response

Copy
    
    
    {
      "STS": "Y",
      "CTRTADDR": "string",
      "MSG": "string",
      "VA": number,
      "NM": "string",
      "BTCD": "string",
      "ABI": "string"
    }

**JSON Input Contract Verification**

POST `/api/contract/verify/json`

Content Type: `multipart/form-data`

Description: Verify a smart contract using multiple source files (Standard JSON input).

Request Body

Copy
    
    
    {
      "mainNetType": "SOMNIA",
      "evmVersion": "string",
      "contractAddress": "string",
      "solcVersion": "string",
      "optimizationEnabled": boolean,
      "runs": number,
      "viaIR": boolean,
      "constructorArgs": "string",
      "sourceFileList": [
        "string($binary)"
      ]
    }

Response

Copy
    
    
    {
      "STS": "Y",
      "CTRTADDR": "string",
      "MSG": "string",
      "VA": number,
      "NM": "string",
      "BTCD": "string",
      "ABI": "string"
    }

### 

3\. Hardhat Verification

Hardhat provides a convenient way to verify smart contracts directly from your development environment. By integrating with the Somnia Explorer API, you can submit your contract source code and metadata without leaving your workflow.

Base Configuration

In your `hardhat.config.js` (or `hardhat.config.ts`), configure the Somnia mainnet settings:

Copy
    
    
    const config: HardhatUserConfig = {
      solidity: "v0.8.30", // replace if necessary
      networks: {
        'somnia-mainnet': {
          url:  {public rpc or your own rpc url} 
        },
      },
      etherscan: {
        apiKey: {
          'somnia-mainnet': 'empty'
        },
        customChains: [
          {
            network: "somnia-mainnet",
            chainId: 5031,
            urls: {
              apiURL: "https://verify-contract.xangle.io/somnia/api",
              browserURL: "https://somnia-explorer.xangle.io"
            }
          }
        ]
      }
    };

  * `networks`: Use public RPC or a private RPC you manage for Somnia mainnet

  * `etherscan.apiKey`: Normally used for Etherscan, but for Somnia an empty value is sufficient

  * `customChains`: Points Hardhat to the Somnia Explorer API and browser endpoints




Verification Command

Copy
    
    
    npx hardhat verify \
      --network somnia-mainnet \
      <address> \
      [...constructorArgs]

  * `<contractAddress>`: The address of your deployed contract

  * `[constructorArgs...]`: Any constructor parameters passed during deployment




1

#### 

Hardhat example workflow

  1. Deploy your contract on Somnia mainnet using Hardhat

  2. Copy the deployed address from the deployment output

  3. Run the verify command with the address and constructor arguments

  4. The verified source code will appear on Somnia Explorer




### 

4\. Foundry Verification

Foundry offers a streamlined way to verify your smart contracts directly from the command line. By using the built-in `forge verify-contract` command, you can connect to Somnia Explorer and publish your contract’s source code automatically.

Verification Command

Copy
    
    
    forge verify-contract \
      --rpc-url {public rpc or your own rpc url} \
      --verifier etherscan \
      --verifier-url ‘https://verify-contract.xangle.io/somnia/api’ \
      <address> \
      [contractFile]:[contractName]

  * `-rpc-url`: Use public RPC or a private RPC you manage for Somnia mainnet

  * `-verifier`: Use Etherscan

  * `-verifier-url`: API endpoint of Somnia Explorer contract verification

  * `<address>`: The deployed contract address

  * `[contractFile]:[contractName]`: The Solidity file and the specific contract name to verify




1

#### 

Foundry example workflow

  1. Deploy your contract to Somnia mainnet using Foundry or another deployment method

  2. Copy the deployed address from the deployment output

  3. Run the verify command with the contract address, source file, and contract name

  4. Once complete, your verified source code will be visible on Somnia Explorer




[PreviousDeploy with Thirdweb](/developer/development-workflow/development-environment/deploy-with-thirdweb)[NextLocal Testing and Forking](/developer/development-workflow/development-environment/local-testing-and-forking)

Last updated 28 days ago
