# Node/Infra Security | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Security](/developer/security)



# Node/Infra Security

## 

Secure RPC Key Management and Environment Configuration for Somnia Developers

This comprehensive guide teaches developers how to securely manage RPC keys, private keys, and environment variables when building applications on the Somnia blockchain. If you're deploying smart contracts, building dApps, or integrating with Somnia. Proper security practices are essential to protect your assets and maintain service reliability. By following this tutorial, you'll implement industry-standard security measures with practical code examples that seamlessly integrate into your development workflow.

## 

Prerequisites

Before starting this guide, ensure you have:

  * Basic knowledge of blockchain development and EVM concepts

  * Node.js (v16 or higher) installed

  * A code editor (VS Code recommended)

  * A Somnia wallet with Somnia Token (STT) for testing

  * Familiarity with environment variables and package managers (npm/yarn)

  * Basic understanding of Git and version control




## 

RPC Key Security Fundamentals

RPC (Remote Procedure Call) keys and endpoints allow your application to interact with the blockchain. Using them securely is paramount.

A publicly accessible key, especially one with write permissions, can be exploited by an attacker to drain wallets or cause network congestion.

#### 

Using Ankr Provider

❌ **Bad Practice:**

Copy
    
    
    // Do not call your api Provider directly in your script with the api-keys!
    
    // Setup provider AnkrProvider
    const provider = new AnkrProvider('https://rpc.ankr.com/somnia_testnet/your-private-key');

✅ **Good Practice:**

Copy
    
    
    // Create a .env file
    SOMNIA_ANKR_RPC_URL=https://rpc.ankr.com/somnia_testnet/your-private-key
    
    // Use environment variables
    // Setup provider AnkrProvider
    const provider = new AnkrProvider(process.env.SOMNIA_ANKR_RPC_URL);

## 

Environment Variable Management

#### 

Private RPC Endpoints

While public endpoints are convenient for basic queries, they are prone to unreliability and congestion during high-traffic events. **Private RPCs are premium services and perform significantly better than the public RPC** , offering more speed and reliability through dedicated connections.

Copy
    
    
    // Example configuration for private endpoint
    const config = {
      testnet: {
        url: process.env.SOMNIA_TESTNET_RPC_URL,
        accounts: [process.env.TESTNET_PRIVATE_KEY]
      }
    };

#### 

Environment Variable Best Practices

A .env file is a standard way to manage environment-specific configuration:

Copy
    
    
    # .env file
    SOMNIA_TESTNET_RPC_URL=https://rpc.ankr.com/somnia_testnet/your-private-key
    TESTNET_PRIVATE_KEY=your_private_key_here
    NODE_ENV=development

#### 

Never Commit .env Files

The .env file should be added to your .gitignore file.

Copy
    
    
    # .gitignore
    .env
    .env.local
    .env.*.local
    node_modules/
    dist/

#### 

Create Separate Environment Files

Use separate configuration files for different environments.

Copy
    
    
    # Project structure
    ├── .env.example          # Template file (safe to commit)
    ├── .env.development      # Development secrets
    ├── .env.test            # Test environment
    ├── .env.staging         # Staging environment
    └── .env.production      # Production secrets (never commit)

Copy
    
    
    // config/environment.js
    const dotenv = require('dotenv');
    const path = require('path');
    
    const environment = process.env.NODE_ENV || 'development';
    const envFile = `.env.${environment}`;
    
    dotenv.config({ path: path.resolve(process.cwd(), envFile) });
    
    module.exports = {
      rpcUrl: process.env.SOMNIA_RPC_URL,
      privateKey: process.env.PRIVATE_KEY,
      environment
    };

#### 

Reference Keys in Code

Always reference environment variables rather than hardcoding sensitive keys.

Copy
    
    
    // utils/blockchain.js
    const { ethers } = require('ethers');
    const config = require('../config/environment');
    
    class BlockchainService {
      constructor() {
        this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
        this.wallet = new ethers.Wallet(config.privateKey, this.provider);
      }
      
      async getBalance(address) {
        return await this.provider.getBalance(address);
      }
      
      async sendTransaction(to, value) {
        const tx = {
          to,
          value: ethers.parseEther(value.toString())
        };
        
        return await this.wallet.sendTransaction(tx);
      }
    }
    
    module.exports = BlockchainService;

#### 

Environment Variable Testing for Applications

**Note:** This testing approach is designed for application projects only, not system-wide configurations.

Copy
    
    
    // test-env.js - For application projects only
    require('dotenv').config();
    
    const testEnvironmentVariables = () => {
      const requiredVars = [
        'SOMNIA_TESTNET_RPC_URL',
        'TESTNET_PRIVATE_KEY'
      ];
      
      const missing = requiredVars.filter(varName => !process.env[varName]);
      
      if (missing.length > 0) {
        console.error('Missing required environment variables:', missing);
        process.exit(1);
      }
      
      console.log('All required environment variables are loaded');
    };
    
    testEnvironmentVariables();

## 

Implementation Examples

#### 

Complete Project Setup

Copy
    
    
    # 1. Initialize project
    npm init -y
    npm install ethers dotenv
    npm install -D nodemon
    
    # 2. Create environment template
    echo "SOMNIA_RPC_URL=https://rpc.ankr.com/somnia_testnet/your-key-here" > .env.example
    echo "PRIVATE_KEY=your-private-key-here" >> .env.example
    echo "CONTRACT_ADDRESS=0x..." >> .env.example
    
    # 3. Add to .gitignore
    echo ".env*" >> .gitignore
    echo "!.env.example" >> .gitignore

#### 

Secure Contract Interaction

Copy
    
    
    // contracts/SomniaContract.js
    const { ethers } = require('ethers');
    const config = require('../config/environment');
    
    class SomniaContract {
      constructor(contractAddress, abi) {
        this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
        this.wallet = new ethers.Wallet(config.privateKey, this.provider);
        this.contract = new ethers.Contract(contractAddress, abi, this.wallet);
      }
      
      async safeCall(methodName, ...args) {
        try {
          // Estimate gas first
          const gasEstimate = await this.contract[methodName].estimateGas(...args);
          
          // Add 20% buffer
          const gasLimit = gasEstimate * 120n / 100n;
          
          const tx = await this.contract[methodName](...args, { gasLimit });
          console.log(`Transaction sent: ${tx.hash}`);
          
          const receipt = await tx.wait();
          console.log(`Transaction confirmed: ${receipt.transactionHash}`);
          
          return receipt;
        } catch (error) {
          console.error('Transaction failed:', error.message);
          throw error;
        }
      }
    }
    
    module.exports = SomniaContract;

## 

RPC Key Management

#### 

IP Whitelisting

If your RPC provider supports it, restrict access to your API key by creating an allowlist of trusted IP addresses.

Copy
    
    
    # Example: Configure IP allowlist in your provider dashboard
    # Allowed IPs: 203.0.113.1, 203.0.113.2
    # This ensures only requests from your servers can use the key

#### 

Key Rotation and Expiration

Regularly rotate your RPC keys and immediately revoke any that are no longer in use.

Manual key rotation implementation

Copy
    
    
    // Manual key rotation implementation
    // Note: RPC providers typically require manual key generation through their dashboard
    // This implementation helps manage the rotation process once you have new keys
    
    const updateEnvironmentVariable = async (key, value) => {
      // Update .env file or environment configuration
      const fs = require('fs').promises;
      const envPath = '.env';
      
      try {
        let envContent = await fs.readFile(envPath, 'utf8');
        const regex = new RegExp(`^${key}=.*$`, 'm');
        
        if (regex.test(envContent)) {
          envContent = envContent.replace(regex, `${key}=${value}`);
        } else {
          envContent += `\n${key}=${value}`;
        }
        
        await fs.writeFile(envPath, envContent);
        console.log(`Updated ${key} in environment file`);
      } catch (error) {
        console.error('Failed to update environment variable:', error);
        throw error;
      }
    };
    
    // Manual key rotation helper
    const rotateApiKey = async (newKey) => {
      try {
        // Validate the new key format
        if (!newKey || typeof newKey !== 'string') {
          throw new Error('Invalid API key provided');
        }
        
        // Store old key for reference
        const oldKey = process.env.SOMNIA_TESTNET_RPC_URL;
        console.log('Rotating API key...');
        
        // Update environment variable
        await updateEnvironmentVariable('SOMNIA_TESTNET_RPC_URL', newKey);
        
        console.log('API key rotated successfully');
        console.log('Please manually revoke the old key in your RPC provider dashboard');
        console.log('Old key (first 10 chars):', oldKey?.substring(0, 10) + '...');
        
      } catch (error) {
        console.error('Key rotation failed:', error);
      }
    };
    
    // Key rotation reminder system
    const setupRotationReminder = () => {
      const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;
      
      setInterval(() => {
        console.log('\n🔑 SECURITY REMINDER: Consider rotating your RPC API keys');
        console.log('1. Generate new key in your RPC provider dashboard');
        console.log('2. Call rotateApiKey(newKey) with the new key');
        console.log('3. Manually revoke old key in provider dashboard\n');
      }, NINETY_DAYS);
    };
    
    // Usage example:
    // rotateApiKey('https://rpc.ankr.com/somnia_testnet/your-new-private-key');
    // setupRotationReminder();

#### 

Secrets Management for Production

For production environments, use a dedicated secrets management platform.

Copy
    
    
    // AWS Secrets Manager example
    const AWS = require('aws-sdk');
    const secretsManager = new AWS.SecretsManager();
    
    const getRpcKey = async () => {
      const secret = await secretsManager.getSecretValue({
        SecretId: 'somnia-rpc-key'
      }).promise();
      
      return JSON.parse(secret.SecretString).rpcUrl;
    };

## 

Private Key Security

Private keys authorize all transactions on a blockchain and should be protected with the utmost vigilance.

#### 

Secure Key Generation

Use reputable tools that follow industry standards for cryptographically random key generation.

Copy
    
    
    // Example: Secure key generation with ethers.js
    const { Wallet } = require('ethers');
    const { randomBytes } = require('crypto');
    
    // Generate cryptographically secure random wallet
    const generateSecureWallet = () => {
      const randomWallet = Wallet.createRandom();
      return {
        address: randomWallet.address,
        privateKey: randomWallet.privateKey,
        mnemonic: randomWallet.mnemonic.phrase
      };
    };

#### 

Access Control

Private keys should never be shared. For team access, use multisig wallets or role-based access control.

Copy
    
    
    // Example: Role-based access pattern
    class SecureWalletManager {
      constructor() {
        this.roles = new Map();
        this.permissions = {
          'admin': ['deploy', 'transfer', 'read'],
          'developer': ['deploy', 'read'],
          'viewer': ['read']
        };
      }
      
      assignRole(address, role) {
        this.roles.set(address, role);
      }
      
      canExecute(address, action) {
        const role = this.roles.get(address);
        return this.permissions[role]?.includes(action) || false;
      }
    }

## 

Error Handling and Logging

Proper error handling and logging are crucial for maintaining security and debugging issues in production environments. When implementing logging for blockchain applications, it's essential to balance transparency with security, ensuring that sensitive information like private keys and API secrets are never exposed in logs.

#### 

Secure Logging Practices

Secure logging implementation

Copy
    
    
    // Secure logging implementation
    const winston = require('winston');
    
    // Create logger with security considerations
    const logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        // Custom format to redact sensitive information
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          // Redact sensitive data
          const sanitized = JSON.stringify(meta).replace(
            /(private_key|api_key|secret)":\s*"[^"]+"/gi,
            '$1": "[REDACTED]"'
          );
          return `${timestamp} [${level}]: ${message} ${sanitized}`;
        })
      ),
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
      ]
    });
    
    // Error handling for RPC calls
    const safeRpcCall = async (provider, method, params) => {
      try {
        const result = await provider.send(method, params);
        logger.info('RPC call successful', { method, success: true });
        return result;
      } catch (error) {
        // Log error without exposing sensitive information
        logger.error('RPC call failed', {
          method,
          error: error.message,
          code: error.code
        });
        throw new Error(`RPC call failed: ${error.message}`);
      }
    };

#### 

Error Recovery Strategies

Copy
    
    
    // Implement retry logic with exponential backoff
    const retryRpcCall = async (provider, method, params, maxRetries = 3) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await safeRpcCall(provider, method, params);
        } catch (error) {
          if (attempt === maxRetries) {
            logger.error('Max retries exceeded', { method, attempts: attempt });
            throw error;
          }
          
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          logger.warn('Retrying RPC call', { method, attempt, delay });
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    };

## 

Security Checklist

  * Store all sensitive keys in environment variables

  * Use private RPC endpoints for better performance and reliability

  * Implement IP whitelisting where supported

  * Set up regular key rotation schedules

  * Use hardware wallets for high-value operations

  * Implement proper error handling and logging

  * Never commit secrets to version control

  * Use role-based access control for team environments

  * Monitor and audit key usage regularly

  * Test environment variable loading in application context




## 

Conclusion

By following these security practices, you'll significantly reduce the risk of key compromise and ensure your Somnia blockchain applications operate securely and reliably. Security is an ongoing process, and you should regularly review and update your practices as new threats emerge and best practices evolve.

[PreviousAudit Checklist](/developer/security/audit-checklist)[NextResponsible Disclosure Policy](/developer/security/responsible-disclosure-policy)

Last updated 26 days ago
