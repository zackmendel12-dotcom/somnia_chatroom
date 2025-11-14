# Responsible Disclosure Policy | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Security](/developer/security)



# Responsible Disclosure Policy

This page serves as the unified communication hub for **Somnia developers, contributors, and security researchers**. It combines two essential areas:

  * **Developer Contact and Support:** How to reach the Somnia DevRel and technical teams.

  * **Responsible Disclosure:** How to report security vulnerabilities, contribute improvements, and participate in the future bounty ecosystem.




* * *

## 

Developer Contact and Support

The Somnia developer community operates across several communication channels to provide quick technical assistance, feedback exchange, and support for integrations or bug reports.

#### 

Active Support Channels

  * **Telegram (DevRel Team):**

    * [@emreyeth](https://t.me/emreyeth)

    * [@PromiseGameFi](https://t.me/PromiseGameFi)

    * [@emmaodia](https://t.me/emmaodia)

  * **Discord:**

    * Join the official [Somnia ](https://discord.gg/somnia)server.

    * For technical questions, use the `#dev-support` or `#dev-chat` channel.

    * To report issues privately, open a **support ticket** under “Bug Reports”

  * **Email:** Send an email to [**[email protected]**](/cdn-cgi/l/email-protection#c8acadbeada4a7b8adbabb88bba7a5a6a1a9e6a6adbcbfa7baa3) for official inquiries, integration help, or collaboration requests.




Response time varies based on the request type, but DevRel aims to reply within **24 hours**.

#### 

Types of Support Requests

Category

Description

Preferred Channel

**Integration Help**

RPC, SDK, and Smart Contract setup assistance

Discord / Email

**Docs Contribution**

Reporting outdated or missing developer docs

GitHub PR / Email

**Bug Report**

Contract, SDK, or explorer bugs

Discord Ticket / Email

**Partnership Inquiry**

Technical collaborations or integration ideas

Email

* * *

## 

Responsible Disclosure

Somnia encourages ethical researchers and contributors to responsibly disclose vulnerabilities or security risks found in the ecosystem. Even though a formal bounty system is not yet live, this framework ensures findings are handled safely and recognized appropriately.

* * *

## 

Technical Disclosure Guidelines

All vulnerability reports should follow a clear, reproducible structure for fast triage and validation.

#### 

**Required Report Template**

Vulnerability Report Template

Copy
    
    
    # Vulnerability Report — Somnia Network
    
    ## Summary
    Brief description of the issue.
    
    ## Impact
    Potential risks if exploited.
    
    ## Steps to Reproduce
    1. Step-by-step actions.
    2. Include RPC endpoint, contract address, and network (Mainnet or Shannon Testnet).
    
    ## Expected vs Actual Behavior
    Explain the difference in observed vs intended behavior.
    
    ## Proof of Concept (PoC)
    Include transaction hash, minimal code snippet, or call trace.
    
    ## Suggested Fix (Optional)
    Provide insights or improvement recommendations.
    
    ## Contact
    Telegram / Discord handle / Email.

Example

Example Vulnerability Report

Copy
    
    
    # Vulnerability Report — Somnia Bridge Contract
    
    ## Summary
    Bridge contract mishandles token decimals in cross-chain conversion.
    
    ## Impact
    Potential underflow on tokens with decimals < 18.
    
    ## Steps to Reproduce
    1. Deploy ERC20 with 6 decimals.
    2. Execute `bridgeToSomnia(token, 1000000)`.
    3. Observe incorrect amount on destination.
    
    ## Expected vs Actual
    Expected: normalized 1 token.
    Actual: 0.000001 tokens received.
    
    ## Suggested Fix
    Add decimal normalization logic.
    
    ## Proof of Concept
    Testnet Tx: `0x92b...4fe1`
    
    ## Contact
    @emreyeth (Telegram)

* * *

## 

Contribution Pathways for Developers

Somnia invites developers to contribute beyond bug reporting. Follow these pathways to get involved.

1

#### 

Documentation Contributions

  * Suggest edits or add missing examples in tutorials.

  * Create new pages under categories like _Debugging_ , _Testing_ , or _Security_.




2

#### 

Testing Best Practices

  * Always test exploits or stress scenarios on **Shannon Testnet** , not on Mainnet.

  * Use local forks with Hardhat or Foundry for reproducibility.




* * *

## 

Somnia Report Lifecycle

1

#### 

Submission

Researcher submits a report via email, Discord, or Telegram.

2

#### 

Verification

Somnia DevRel reproduces the issue and collects context.

3

#### 

Escalation

Valid issues are passed to Somnia Core Security.

4

#### 

Patch Deployment

Fix rolled out to Shannon Testnet, then Mainnet. (Based on where is it.)

5

#### 

Acknowledgment

Researcher credited publicly in Somnia Docs and Discord.

For multi-party vulnerabilities (e.g., involving validators or external oracles), coordinated disclosure will be handled privately.

* * *

## 

Ethical Rules

  * Do **not** exploit vulnerabilities on Mainnet.

  * Do **not** disrupt network services or RPC endpoints.

  * Do **not** engage in social engineering or phishing.

  * Always disclose vulnerabilities privately and responsibly.




Researchers acting in good faith will **not face any penalties** and will be publicly recognized for their ethical contributions.

* * *

## 

Summary

  * Use **Telegram, Discord, or Email** to reach Somnia’s DevRel and security teams.

  * Follow the **Responsible Disclosure template** for structured vulnerability reports.

  * Contribute improvements via **Pull Requests** or documentation updates.

  * Future bounty and recognition programs will expand as Somnia Mainnet evolves.




[PreviousNode/Infra Security](/developer/security/node-infra-security)[NextGo-Live Checklist](/developer/deployment-and-production/go-live-checklist)

Last updated 25 days ago
