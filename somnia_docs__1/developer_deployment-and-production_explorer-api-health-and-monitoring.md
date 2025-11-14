# Explorer API Health and Monitoring | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [DEPLOYMENT AND PRODUCTION](/developer/deployment-and-production)



# Explorer API Health and Monitoring

A comprehensive guide for integrating Somnia Network explorer APIs with production-ready logging and health monitoring systems.

This guide demonstrates how to build robust applications on Somnia Network using Blockscout's explorer APIs, implement enterprise-grade logging, and set up comprehensive health monitoring for your dApps.

**What You'll Learn**

  * Somnia Network explorer API integration

  * Production logging with Winston

  * Health monitoring systems

  * Error handling and debugging

  * Performance optimization




## 

**Prerequisites**

  * Node.js (v16+)

  * TypeScript/JavaScript knowledge

  * Blockchain/EVM concepts

  * Funded Somnia wallet

  * REST API experience




## 

**Explorer Endpoints**

Somnia Network uses Blockscout as its blockchain explorer infrastructure:

Network

Explorer URL

API Endpoint

**Testnet**

https://shannon-explorer.somnia.network

`/api`

**Mainnet**

https://explorer.somnia.network

`/api`

### 

**Available APIs**

Blockscout provides multiple API interfaces:

  * **REST API** \- Primary interface for UI operations

  * **RPC API** \- Etherscan-compatible endpoints

  * **ETH RPC API** \- Standard JSON-RPC methods

  * **GraphQL** \- Advanced querying capabilities




## 

Quick Start

Initialize your Somnia integration project:

Copy
    
    
    mkdir somnia-explorer-integration
    cd somnia-explorer-integration
    npm init -y

### 

**Dependencies**

Install required packages:

Copy
    
    
    # Core dependencies
    npm install axios winston express helmet cors dotenv ethers
    
    # Development dependencies
    npm install --save-dev @types/node typescript ts-node nodemon @types/express @types/cors

### 

**Core Dependencies:**

  * `axios` \- Promise-based HTTP client used for making API requests to Somnia Network's Blockscout explorer APIs with automatic request/response logging and error handling

  * `winston` \- Comprehensive logging library used for creating structured JSON logs with timestamps, component-specific loggers (API, explorer, health), and automatic log rotation

  * `express` \- Minimal web framework used for creating health monitoring endpoints and serving the application

  * `helmet` \- Security middleware used for setting HTTP security headers to protect against XSS, clickjacking, and other common web vulnerabilities

  * `cors` \- Cross-Origin Resource Sharing middleware used for enabling secure cross-origin requests from frontend applications

  * `dotenv` \- Environment variable loader used for managing configuration settings and sensitive information like API keys and network settings

  * `ethers` \- Ethereum library used for blockchain interactions, RPC connections, and retrieving network information




### 

**Project Structure**

Copy
    
    
    mkdir src/{config,services,utils} logs

### 

**Package Configuration**

Update `package.json` with build scripts:

Copy
    
    
    {
      "name": "somnia-explorer-integration",
      "version": "1.0.0",
      "description": "Somnia Network explorer integration with logging and health checks",
      "main": "dist/app.js",
      "scripts": {
        "build": "tsc",
        "start": "node dist/app.js",
        "dev": "nodemon --exec ts-node src/app.ts",
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": ["somnia", "blockchain", "explorer", "blockscout"],
      "author": "Your Name",
      "license": "MIT"
    }

### 

Configuration

**Network Settings**

Create a configuration file for Somnia Network settings to:

  * Consolidate all Somnia Network endpoints (testnet/mainnet) in one location

  * Enable automatic environment-based network switching

  * Provide TypeScript interfaces for type safety

  * Make it easy to update endpoints without changing multiple files




Copy
    
    
    // src/config/network.ts
    export const SOMNIA_CONFIG = {
      testnet: {
        name: 'Somnia Testnet',
        rpcUrl: 'https://dream-rpc.somnia.network',
        chainId: 50312,
        explorerUrl: 'https://shannon-explorer.somnia.network',
        explorerApiUrl: 'https://shannon-explorer.somnia.network/api'
      },
      mainnet: {
        name: 'Somnia Mainnet',
        rpcUrl: 'https://somnia-json-rpc.stakely.io',
        chainId: 5031,
        explorerUrl: 'https://explorer.somnia.network',
        explorerApiUrl: 'https://explorer.somnia.network/api'
      }
    };
    
    export const getCurrentNetwork = () => {
      return process.env.NODE_ENV === 'production' 
        ? SOMNIA_CONFIG.mainnet 
        : SOMNIA_CONFIG.testnet;
    };

### 

**Environment Variables**

Why create a .env file:

  * Keeps sensitive information out of source code

  * Useful when using third-party RPC API Keys

  * Enables different configurations for development/production environments

  * Controls which Somnia network to use (testnet/mainnet) via `NODE_ENV`

  * Allows easy modification of settings without code changes




Copy
    
    
    # .env
    NODE_ENV=development
    PORT=3000
    LOG_LEVEL=info

#### 

## 

API Integration

### 

**Explorer Service**

This service provides comprehensive logging for all API interactions and follows Blockscout's REST API patterns.

src/services/somniaExplorerService.ts

Copy
    
    
    // src/services/somniaExplorerService.ts
    import axios, { AxiosInstance } from 'axios';
    import { getCurrentNetwork } from '../config/network';
    import { logger } from '../utils/logger';
    
    export interface TransactionData {
      hash: string;
      blockNumber: number;
      from: string;
      to: string;
      value: string;
      gasUsed: string;
      status: string;
      timestamp: string;
    }
    
    export interface BlockData {
      number: number;
      hash: string;
      timestamp: number;
      transactions: string[];
      gasUsed: string;
      gasLimit: string;
      miner: string;
    }
    
    export class SomniaExplorerService {
      private api: AxiosInstance;
      private network = getCurrentNetwork();
    
      constructor() {
        this.api = axios.create({
          baseURL: this.network.explorerApiUrl,
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Somnia-Explorer-Client/1.0',
            'Cache-Control': 'no-cache' // Ensure fresh data for health checks
          }
        });
    
        // Add request interceptor for comprehensive logging
        this.api.interceptors.request.use(
          (config) => {
            logger.info('Somnia Explorer API Request', {
              method: config.method?.toUpperCase(),
              url: config.url,
              baseURL: config.baseURL,
              timestamp: new Date().toISOString(),
              network: this.network.name
            });
            return config;
          },
          (error) => {
            logger.error('Somnia Explorer API Request Error', {
              error: error.message,
              timestamp: new Date().toISOString(),
              network: this.network.name
            });
            return Promise.reject(error);
          }
        );
    
        // Add response interceptor for logging
        this.api.interceptors.response.use(
          (response) => {
            logger.info('Somnia Explorer API Response', {
              status: response.status,
              url: response.config.url,
              responseTime: response.headers['x-response-time'] || 'unknown',
              timestamp: new Date().toISOString(),
              network: this.network.name
            });
            return response;
          },
          (error) => {
            logger.error('Somnia Explorer API Response Error', {
              status: error.response?.status,
              statusText: error.response?.statusText,
              url: error.config?.url,
              message: error.message,
              timestamp: new Date().toISOString(),
              network: this.network.name
            });
            return Promise.reject(error);
          }
        );
      }
    
      async getTransaction(txHash: string): Promise<TransactionData | null> {
        try {
          const response = await this.api.get(`/v2/transactions/${txHash}`);
          logger.info('Successfully retrieved transaction', {
            txHash,
            blockNumber: response.data.block,
            network: this.network.name
          });
          return response.data;
        } catch (error: any) {
          logger.error('Failed to fetch transaction', {
            txHash,
            error: error.message,
            network: this.network.name
          });
          return null;
        }
      }
    
      async getBlock(blockNumber: number): Promise<BlockData | null> {
        try {
          const response = await this.api.get(`/v2/blocks/${blockNumber}`);
          logger.info('Successfully retrieved block', {
            blockNumber,
            hash: response.data.hash,
            txCount: response.data.tx_count,
            network: this.network.name
          });
          return response.data;
        } catch (error: any) {
          logger.error('Failed to fetch block', {
            blockNumber,
            error: error.message,
            network: this.network.name
          });
          return null;
        }
      }
    
      async getAddressTransactions(address: string, page = 1, limit = 20): Promise<TransactionData[]> {
        try {
          const response = await this.api.get(`/v2/addresses/${address}/transactions`, {
            params: { page, limit }
          });
          logger.info('Retrieved address transactions', {
            address,
            count: response.data.items?.length || 0,
            page,
            limit,
            network: this.network.name
          });
          return response.data.items || [];
        } catch (error: any) {
          logger.error('Failed to fetch address transactions', {
            address,
            error: error.message,
            network: this.network.name
          });
          return [];
        }
      }
    }

This `SomniaExplorerService` class provides comprehensive logging for all API interactions and follows Blockscout's REST API patterns. The service includes:

  * **Type-safe interfaces** for transaction and block data

  * **Axios interceptors** for automatic request/response logging

  * **Error handling** with detailed logging for debugging

  * **Network-aware configuration** that adapts to different Somnia environments




Tip: The service automatically logs all API requests and responses, making it easy to debug issues and monitor performance.

### 

Logging System

src/utils/logger.ts

Copy
    
    
    // src/utils/logger.ts
    import winston from 'winston';
    import path from 'path';
    
    // Custom log format for Somnia applications
    const somniaLogFormat = winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return JSON.stringify({
          timestamp,
          level,
          message,
          service: 'somnia-explorer-client',
          network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet',
          ...meta
        });
      })
    );
    
    // Create logger instance with Somnia-specific configuration
    export const logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: somniaLogFormat,
      defaultMeta: {
        service: 'somnia-explorer-integration',
        version: '1.0.0',
        chain: 'somnia'
      },
      transports: [
        // Console transport for development
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        }),
        
        // File transport for all logs
        new winston.transports.File({
          filename: path.join('logs', 'somnia-explorer.log'),
          maxsize: 5242880, // 5MB
          maxFiles: 5
        }),
        
        // Separate file for API-specific logs
        new winston.transports.File({
          filename: path.join('logs', 'api-requests.log'),
          level: 'info',
          maxsize: 5242880,
          maxFiles: 3,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        }),
        
        // Separate file for errors
        new winston.transports.File({
          filename: path.join('logs', 'error.log'),
          level: 'error',
          maxsize: 5242880,
          maxFiles: 3
        })
      ],
      
      // Handle uncaught exceptions
      exceptionHandlers: [
        new winston.transports.File({
          filename: path.join('logs', 'exceptions.log')
        })
      ],
      
      // Handle unhandled promise rejections
      rejectionHandlers: [
        new winston.transports.File({
          filename: path.join('logs', 'rejections.log')
        })
      ]
    });
    
    // Create specialized loggers for different components
    export const apiLogger = logger.child({ component: 'api' });
    export const explorerLogger = logger.child({ component: 'explorer' });
    export const healthLogger = logger.child({ component: 'health' });

**Winston Configuration**

This Winston configuration provides several enterprise-grade features that make it production-ready:

  * **Structured JSON logs** : logs are formatted as JSON objects with consistent fields like `timestamp`, `level`, `message`, and `metadata`. This makes it easy to parse logs programmatically, search for specific events, and integrate with log analysis tools like ELK Stack or Splunk.

  * **File rotation** : Automatically manages log file sizes by creating new files when they reach 5MB and keeping only the 5 most recent files.

  * **Component-specific loggers** : Creates separate logger instances for different parts of your application (API, Explorer, Health) using `logger.child()`.

  * **Error tracking with stack traces** : Captures complete error information including stack traces using `winston.format.errors({ stack: true })`.

  * **Performance metrics** : Logs response times and request metadata, allowing monitoring of API performance.

  * **Separate log files by purpose** : Different files for general logs, API requests, errors, exceptions, and promise rejections.




**Warning** : Ensure the `logs` directory exists before starting your application, or Winston will fail to write log files.

### 

Usage Examples

**Structured Logging Output**

Copy
    
    
    {
      "timestamp": "2024-01-15 10:30:45",
      "level": "info",
      "message": "Somnia Explorer API Request",
      "service": "somnia-explorer-integration",
      "network": "testnet",
      "component": "explorer",
      "method": "GET",
      "url": "/v2/transactions/0x1234...",
      "baseURL": "https://shannon-explorer.somnia.network/api",
      "chain": "somnia"
    }

**API Service Usage**

Copy
    
    
    // Initialize the explorer service
    const explorerService = new SomniaExplorerService();
    
    // Get transaction data
    const txData = await explorerService.getTransaction('0x1234...');
    if (txData) {
      console.log('Transaction found:', txData.hash);
    }
    
    // Get block data
    const blockData = await explorerService.getBlock(12345);
    if (blockData) {
      console.log('Block transactions:', blockData.transactions.length);
    }
    
    // Get address transactions
    const addressTxs = await explorerService.getAddressTransactions(
      '0xabcd...',
      1, // page
      10 // limit
    );
    console.log('Address transactions:', addressTxs.length);

## 

Troubleshooting

If API requests fail

  * Verify Somnia Network explorer endpoints are accessible

  * Check network connectivity to shannon-explorer.somnia.network or explorer.somnia.network

  * Ensure correct API endpoint format matches Blockscout v2 schema




If logging doesn't work

  * Ensure the logs directory exists: `mkdir logs`

  * Check file permissions for log files

  * Verify Winston configuration matches your environment




You've successfully implemented:

  * **Comprehensive API integration** with the Somnia Explorer using type-safe interfaces

  * **Enterprise-grade logging** with Winston, including structured JSON output and file rotation

  * **Error handling and monitoring** for production-ready applications

  * **Performance tracking** with request/response logging and timing metrics




Your application now has robust blockchain data access with proper logging infrastructure that will help you monitor, debug, and maintain your Somnia-based applications in production.

[Sample Project](https://github.com/PromiseGameFi/Somnia-sample-project/tree/main/somnia-explorer-integration)

[PreviousGo-Live Checklist](/developer/deployment-and-production/go-live-checklist)[NextSomnia Gas Differences To Ethereum](/developer/deployment-and-production/somnia-gas-differences-to-ethereum)

Last updated 18 days ago
