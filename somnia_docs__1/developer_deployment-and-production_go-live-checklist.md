# Go-Live Checklist | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [DEPLOYMENT AND PRODUCTION](/developer/deployment-and-production)



# Go-Live Checklist

This page provides a **checklist for deploying Somnia applications to production (Mainnet)**. It ensures that all necessary environment variables, contract addresses, allowlists, and rollback strategies are correctly configured before launch.

Never commit secrets to git. Use encrypted secret storage or CI secret managers for production deployments.

* * *

### 

Environment Variables

  * Store RPC URLs, private keys, and API keys in `.env` files (never commit to git).

  * Define `SOMNIA_RPC_MAINNET` and `SOMNIA_RPC_TESTNET` for switching between environments.

  * Configure block explorer API keys (for contract verification).

  * Separate `.env.production` vs `.env.development`.

  * Double-check secrets with `printenv | grep SOMNIA`.




Example `.env.production`:

.env.production

Copy
    
    
    SOMNIA_RPC_MAINNET=https://api.infra.mainnet.somnia.network/
    PRIVATE_KEY=0xabc123...
    EXPLORER_API_KEY=...
    ALLOWED_ORIGIN=https://yourapp.com

* * *

### 

Contract Addresses

  * Verify all **core Somnia system contracts** (e.g., wrapped SOMI, multicall, registry).

  * Update deployed contract addresses in `.env` or config files.

  * Confirm that addresses match **Mainnet deployments** (not testnet).

  * Cross-check with block explorer for correct bytecode & verification.




Example `config/addresses.json`:

config/addresses.json

Copy
    
    
    {
      "network": "mainnet",
      "dao": "0x1234...",
      "token": "0xabcd...",
      "subgraph": "https://subgraph.somnia.network/dashboard/subgraph/..."
    }

* * *

### 

Allowlists

  * Maintain allowlists for admin roles, multisigs, and privileged addresses.

  * Use multisig wallets ([Safe](https://safe.somnia.network/welcome)) for critical roles (owner, pauser, upgrader).

  * Double-check allowlist in contracts (no dev/test keys).

  * Store allowlist in version control (JSON/YAML).




Example `allowlist.json`:

allowlist.json

Copy
    
    
    {
      "admins": ["0xAdmin1...", "0xAdmin2..."],
      "oracles": ["0xOracle1..."],
      "relayers": ["0xRelayer1..."]
    }

* * *

### 

Rollback Plan

Having a clear rollback strategy is essential if something goes wrong during or after deployment. This should include both **technical measures** and **operational procedures**.

#### 

Technical Rollback Steps

  * **Pause contracts** – ensure critical contracts implement a `pause()` function for emergencies.

  * **Feature flags** – enable/disable risky features without redeployment.

  * **Upgradable contracts** – if using proxies, keep previous implementation verified and ready.

  * **Role revocation** – remove compromised keys or revoke admin privileges quickly.

  * **Migration scripts** – maintain scripts to redeploy or roll forward to a safe version.




#### 

Operational Rollback Steps

  * **Communication plan** – inform users immediately via Discord, Twitter, or status page.

  * **Validator coordination** – notify Somnia infra providers/validators in case of critical incidents.

  * **Emergency access** – keep a secure list of multisig signers available for urgent transactions.

  * **Data backups** – keep copies of config files, [subgraph](https://subgraph.somnia.network/) schemas, and off-chain DBs.

  * **Post-mortem process** – document the issue, resolution, and future prevention steps.




* * *

### 

Best Practices

  * Always test on **Shannon Testnet** before mainnet deployment.

  * Pin dependencies & compiler versions for reproducibility.

  * Run **audit checklist** (see Smart Contract Security 101).

  * Monitor deployed contracts with logging & health checks.

  * Communicate launch windows to your community in advance.




[PreviousResponsible Disclosure Policy](/developer/security/responsible-disclosure-policy)[NextExplorer API Health and Monitoring](/developer/deployment-and-production/explorer-api-health-and-monitoring)

Last updated 28 days ago
