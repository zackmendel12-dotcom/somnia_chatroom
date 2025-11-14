# Smart Contract Security 101 | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Security](/developer/security)



# Smart Contract Security 101

Smart contract vulnerabilities can lead to devastating financial losses and compromise user trust. This guide examines three critical vulnerability categories with hands-on examples that demonstrate both vulnerable patterns and secure implementations.

Learn to identify and prevent the most critical security vulnerabilities in smart contracts through practical examples. This section covers real attack vectors with vulnerable and secure code implementations, along with comprehensive prevention strategies.

What you'll achieve: Recognize vulnerable code patterns, understand attack mechanisms, and learn to implement secure alternatives.

## 

Prerequisites

✅ Required:

  * Understanding of Solidity function execution

  * Basic knowledge of EVM call mechanics




✅ Recommended:

  * Access to Remix IDE for testing examples

  * Somnia Testnet setup for deployment testing




## 

Vulnerability Overview

The following table categorizes vulnerabilities by severity and implementation difficulty:

Vulnerability Type

Severity

Frequency

Detection Difficulty

Financial Impact

Reentrancy

Critical

High

Medium

Very High

Access Control

Critical

Medium

Low

High

Integer Overflow

High

Low

Low

Medium

* * *

## 

1\. Reentrancy Vulnerabilities

#### 

Understanding the Attack

Reentrancy occurs when a contract calls an external contract before updating its internal state, allowing the external contract to call back and exploit the inconsistent state.

#### 

Vulnerable Implementation Analysis

ReentrancyVulnerable Contract

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.18;
    
    /**
     * @title ReentrancyVulnerable
     * @notice Classic vulnerable withdraw pattern for tutorial exploitation in Remix.
     * @dev Demonstrates why updating state after external calls is dangerous.
     *
     * WARNING: Use only in local/Remix test environments. Do NOT deploy vulnerable contracts with real funds on mainnet.
     */
    contract ReentrancyVulnerable {
        mapping(address => uint256) public deposits;
    
        event Deposited(address indexed who, uint256 amount);
        event Withdrawn(address indexed who, uint256 amount);
    
        function deposit() external payable {
            require(msg.value > 0, "zero deposit");
            deposits[msg.sender] += msg.value;
            emit Deposited(msg.sender, msg.value);
        }
    
        function withdraw(uint256 amount) external {
            require(deposits[msg.sender] >= amount, "insufficient balance");
    
            // INTERACTION before EFFECTS -> vulnerable to reentrancy
            (bool sent, ) = msg.sender.call{value: amount}("");
            require(sent, "transfer failed");
    
            // EFFECTS: update balance after external call -> attacker can re-enter here
            deposits[msg.sender] -= amount;
            emit Withdrawn(msg.sender, amount);
        }
    
        function contractBalance() external view returns (uint256) {
            return address(this).balance;
        }
    }

Why This Contract Is Vulnerable:

  * Interaction (external call) occurs before updating internal state.

  * No reentrancy guard or checks-effects-interactions.

  * Attackers can re-enter withdraw() during the external call and drain funds.




#### 

Attack Mechanism

1

#### 

Attack contract & setup

Attacker contract:

Copy
    
    
    contract Attacker {
        ReentrancyVulnerable target;
        uint256 public constant ATTACK_AMOUNT = 1 ether;
    
        constructor(address _target) {
            target = ReentrancyVulnerable(_target);
        }
    
        function attack() external payable {
            require(msg.value >= ATTACK_AMOUNT, "need at least 1 ETH");
            target.deposit{value: ATTACK_AMOUNT}();
            target.withdraw(ATTACK_AMOUNT);
        }
    
        receive() external payable {
            if (address(target).balance >= ATTACK_AMOUNT) {
                target.withdraw(ATTACK_AMOUNT);
            }
        }
    }

Initial state example:

  * Vulnerable contract has 10 ETH from other users

  * Attacker deposits 1 ETH




2

#### 

First withdraw and reentry

  * Attacker calls `target.withdraw(1 ether)`.

  * Contract sends 1 ETH via `call` to attacker -> triggers attacker's `receive()`.

  * Because deposits were not updated yet, `deposits[attacker]` still equals 1 ETH.

  * In `receive()`, attacker calls `target.withdraw(1 ether)` again.




3

#### 

Recursive drain and final impact

  * Reentrancy repeats until contract balance < attack amount.

  * Attacker drains nearly all ETH while only depositing 1 ETH.

  * Final state: contract drained, attacker profit huge, other users lose funds.




#### 

Secure Implementation

Secure Reentrancy Contract

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.18;
    
    contract ReentrancySecure {
        mapping(address => uint256) private _deposits;
    
        uint256 private constant _NOT_ENTERED = 1;
        uint256 private constant _ENTERED = 2;
        uint256 private _status = _NOT_ENTERED;
    
        event Deposited(address indexed who, uint256 amount);
        event Withdrawn(address indexed who, uint256 amount);
    
        modifier nonReentrant() {
            require(_status == _NOT_ENTERED, "reentrant");
            _status = _ENTERED;
            _;
            _status = _NOT_ENTERED;
        }
    
        function deposit() external payable {
            require(msg.value > 0, "zero deposit");
            _deposits[msg.sender] += msg.value;
            emit Deposited(msg.sender, msg.value);
        }
    
        function withdraw(uint256 amount) external nonReentrant {
            uint256 bal = _deposits[msg.sender];
            require(bal >= amount, "insufficient balance");
    
            // EFFECTS
            _deposits[msg.sender] = bal - amount;
    
            // INTERACTIONS
            (bool sent, ) = msg.sender.call{value: amount}("");
            require(sent, "transfer failed");
    
            emit Withdrawn(msg.sender, amount);
        }
    
        function depositOf(address who) external view returns (uint256) {
            return _deposits[who];
        }
    
        function contractBalance() external view returns (uint256) {
            return address(this).balance;
        }
    }

This secure contract uses a reentrancy guard to prevent recursive calls:

**Key Components:**

  1. **Reentrancy Guard Variables:**

     * `_NOT_ENTERED = 1` and `_ENTERED = 2`: Lock states

     * `_status`: Tracks if function is currently executing

  2. **nonReentrant Modifier:**

     * Checks if function is already running (`_status == _NOT_ENTERED`)

     * Sets lock before execution (`_status = _ENTERED`)

     * Releases lock after completion (`_status = _NOT_ENTERED`)

  3. **Secure withdraw() Function:**

     * Uses `nonReentrant` modifier to block recursive calls

     * Updates balance BEFORE making external call (checks-effects-interactions pattern)

     * External call cannot trigger another withdrawal due to the guard




**How It Prevents Attacks:**

  * First call sets `_status = _ENTERED`

  * Any reentrant call fails the `require(_status == _NOT_ENTERED)` check

  * Transaction reverts with "reentrant" error

  * Only one withdrawal per transaction is possible




**Security Features:**

  * Reentrancy protection through state locking

  * State updates before external calls

  * Automatic revert on attack attempts




Security fixes:

  * Checks-Effects-Interactions: state updated before external calls.

  * Reentrancy guard (mutex) via nonReentrant modifier.

  * Double protection: both CEI and guard prevent recursive drains.




#### 

Prevention Strategies (summary)

Strategy

Implementation

Effectiveness

Gas Cost

CEI Pattern

Update state before external calls

High

Low

Reentrancy Guard

Mutex-style protection

Very High

Medium

Pull Payment

Users withdraw instead of push

High

Low

OpenZeppelin ReentrancyGuard

Battle-tested implementation

Very High

Medium

* * *

## 

2\. Access Control Vulnerabilities

#### 

Understanding the Flaw

Poor access control allows unauthorized users to execute privileged functions, leading to complete contract compromise.

#### 

Vulnerable Implementation Analysis

Access Control Vulnerable Contract

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.18;
    
    contract AccessControlVulnerable {
        mapping(bytes32 => mapping(address => bool)) public roles;
    
        bytes32 public constant ADMIN = keccak256("ADMIN");
        bytes32 public constant WRITER = keccak256("WRITER");
    
        string public data;
    
        constructor() {
            roles[ADMIN][msg.sender] = true;
            roles[WRITER][msg.sender] = true;
        }
    
        function grantRole(bytes32 role, address account) external {
            require(account != address(0), "zero account");
            require(roles[role][msg.sender], "only role-holder");
            roles[role][account] = true;
        }
    
        function revokeRole(bytes32 role, address account) external {
            require(roles[role][msg.sender], "only role-holder");
            roles[role][account] = false;
        }
    
        function write(string calldata newData) external {
            require(roles[WRITER][msg.sender], "not writer");
            data = newData;
        }
    
        function emergencyReset() external {
            require(roles[ADMIN][msg.sender], "not admin");
            data = "";
        }
    
        function hasRole(bytes32 role, address account) external view returns (bool) {
            return roles[role][account];
        }
    }solid

Critical issues:

  * Any role-holder can grant the same role to others → role escalation.

  * No owner/admin separation.

  * No events emitted for role changes (no audit trail).




#### 

Attack Mechanism

1

#### 

Setup & initial compromise

Initial state:

  * Deployer has ADMIN and WRITER.

  * Legitimate user Alice has WRITER.

  * Attacker Bob has no roles.




Attacker compromises Alice or Alice becomes malicious.

2

#### 

Role escalation sequence

  * Alice calls `grantRole(WRITER, bob)` → Bob becomes WRITER.

  * Bob (now a role-holder) calls `grantRole(ADMIN, bob)` if the model allows it.

  * Because the contract lets role-holders grant roles, escalation to ADMIN can occur.




3

#### 

Final state & impact

  * Bob gains ADMIN powers: can grant/revoke roles and perform privileged actions.

  * No events: attack may be undetected.

  * Complete contract compromise possible.




#### 

Secure Implementation

Secure Access Control Contract

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.18;
    
    contract AccessControlSecure {
        mapping(bytes32 => mapping(address => bool)) private _roles;
    
        bytes32 public constant ADMIN = keccak256("ADMIN");
        bytes32 public constant WRITER = keccak256("WRITER");
    
        address public immutable owner;
    
        string public data;
    
        event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
        event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
        event DataWritten(address indexed sender, string newData);
    
        constructor() {
            owner = msg.sender;
            _roles[ADMIN][msg.sender] = true;
            emit RoleGranted(ADMIN, msg.sender, msg.sender);
        }
    
        modifier onlyOwner() {
            require(msg.sender == owner, "only owner");
            _;
        }
    
        modifier onlyAdmin() {
            require(_roles[ADMIN][msg.sender], "only admin");
            _;
        }
    
        function grantRole(bytes32 role, address account) external {
            require(account != address(0), "zero address");
            if (role == ADMIN) {
                require(msg.sender == owner, "only owner can grant admin");
            } else {
                require(_roles[ADMIN][msg.sender], "only admin can grant");
            }
            if (!_roles[role][account]) {
                _roles[role][account] = true;
                emit RoleGranted(role, account, msg.sender);
            }
        }
    
        function revokeRole(bytes32 role, address account) external {
            require(account != address(0), "zero address");
            if (role == ADMIN) {
                require(msg.sender == owner, "only owner can revoke admin");
            } else {
                require(_roles[ADMIN][msg.sender], "only admin can revoke");
            }
            if (_roles[role][account]) {
                _roles[role][account] = false;
                emit RoleRevoked(role, account, msg.sender);
            }
        }
    
        function write(string calldata newData) external {
            require(_roles[WRITER][msg.sender], "not writer");
            data = newData;
            emit DataWritten(msg.sender, newData);
        }
    
        function hasRole(bytes32 role, address account) external view returns (bool) {
            return _roles[role][account];
        }
    }

This secure contract implements proper role hierarchy:

**Key Security Features:**

  1. **Immutable Owner:**

     * Owner address cannot be changed after deployment

     * Only owner can grant/revoke ADMIN roles

  2. **Role Hierarchy:**

     * Owner > Admin > Writer

     * Only ADMIN can grant WRITER roles

     * WRITER cannot grant any roles

  3. **Secure Role Management:**

     * Different permissions for granting ADMIN vs other roles

     * Input validation prevents zero address assignments

     * Events log all role changes for audit trail




**How it prevents attacks:**

  * WRITER cannot escalate to ADMIN (only owner can grant ADMIN)

  * Clear separation of permissions

  * Complete audit trail of all role changes




**How Security Works:**

**Attack Prevention:**

  * Alice (WRITER) tries to grant ADMIN to Bob → Fails (only owner can grant ADMIN)

  * Bob tries to grant himself ADMIN → Fails (only owner can grant ADMIN)

  * Role escalation is impossible




**Legitimate Operations:**

  * Owner can grant ADMIN roles

  * ADMIN can grant WRITER roles

  * All changes are logged with events




**Result:**

  * Clear hierarchy prevents unauthorized escalation

  * Complete audit trail of all role changes

  * Attack is blocked by proper permission checks




#### 

Best Practices (summary)

Practice

Purpose

Implementation

Role Hierarchy

Prevent privilege escalation

Owner > Admin > User

Immutable Owner

Prevent ownership takeover

Set in constructor

Event Logging

Enable audit trails

Emit on all role changes

Zero Address Check

Prevent accidental locks

Validate addresses

* * *

## 

3\. Integer Overflow/Underflow

#### 

Understanding the Issue

Integer overflow/underflow occurs when arithmetic operations exceed the maximum or minimum values for the data type, potentially causing unexpected behavior or security vulnerabilities in financial calculations.

#### 

Vulnerable Implementation Analysis

Integer Overflow Vulnerable Contract

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.18;
    
    contract IntegerOverflowVulnerable {
        mapping(address => uint256) public balance;
        uint256 public totalSupply;
    
        function mint(address to, uint256 amount) external {
            require(to != address(0), "zero address");
            balance[to] += amount;
            totalSupply += amount;
        }
    
        function transfer(address from, address to, uint256 amount) external {
            require(to != address(0), "zero address");
            // Missing check: require(balance[from] >= amount)
            balance[from] -= amount; // may revert in 0.8+; would underflow silently pre-0.8
            balance[to] += amount;
        }
    
        function batchAdd(address[] calldata recipients, uint256[] calldata amounts) external {
            require(recipients.length == amounts.length, "length mismatch");
            for (uint256 i = 0; i < recipients.length; i++) {
                require(recipients[i] != address(0), "zero addr in batch");
                balance[recipients[i]] += amounts[i];
                totalSupply += amounts[i];
            }
        }
    
        function balanceOf(address who) external view returns (uint256) {
            return balance[who];
        }
    }

Critical vulnerabilities:

  * Unchecked addition (overflow) on balances and totalSupply.

  * Unchecked subtraction (underflow) in transfer.

  * Batch operations amplify overflow risks.

  * No access control on minting.




#### 

Attack Mechanisms

1

#### 

Overflow via mint()

Initial state:

  * totalSupply = expected supply

  * Attacker computes amount = max_uint256 - totalSupply + 1

  * Calling mint(attacker, amount) causes totalSupply and balance to wrap to 0 (pre-0.8 behavior).

  * State becomes corrupted.




2

#### 

Underflow via transfer() (pre-0.8 behavior)

  * Attacker with 0 balance attempts to transfer a huge amount.

  * balance[attacker] -= amount underflows to near max uint256.

  * Attacker ends up with immense balance.




3

#### 

Batch amplification

  * Attacker uses many entries with large but individually safe amounts.

  * Cumulative additions overflow totalSupply or balances.

  * Economic model breaks.




#### 

Secure Implementation

Secure Integer Overflow Contract

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;
    
    contract IntegerOverflowSecure {
        mapping(address => uint256) public balances;
        address public owner;
        uint256 public totalSupply;
        uint256 public constant MAX_SUPPLY = type(uint256).max; // example
    
        constructor() {
            owner = msg.sender;
        }
    
        modifier onlyOwner() {
            require(msg.sender == owner, "Not owner");
            _;
        }
    
        function mint(address to, uint256 amount) external onlyOwner {
            require(to != address(0), "Zero address");
            require(amount > 0, "Zero amount");
    
            require(balances[to] + amount >= balances[to], "Balance overflow");
            require(totalSupply + amount >= totalSupply, "Total supply overflow");
            require(totalSupply + amount <= MAX_SUPPLY, "exceeds max supply");
    
            balances[to] += amount;
            totalSupply += amount;
        }
    
        function transfer(address to, uint256 amount) external {
            require(to != address(0), "Zero address");
            require(amount > 0, "Zero amount");
    
            require(balances[msg.sender] >= amount, "Insufficient balance");
            require(balances[to] + amount >= balances[to], "Balance overflow");
    
            balances[msg.sender] -= amount;
            balances[to] += amount;
        }
    
        function batchAdd(uint256[] calldata amounts) external {
            uint256 currentBalance = balances[msg.sender];
    
            for (uint256 i = 0; i < amounts.length; i++) {
                require(currentBalance + amounts[i] >= currentBalance, "Overflow in batch");
                currentBalance += amounts[i];
            }
    
            balances[msg.sender] = currentBalance;
        }
    
        function balanceOf(address account) external view returns (uint256) {
            return balances[account];
        }
    }

This secure contract prevents overflow/underflow attacks:

**Key Security Features:**

  1. **Overflow/Underflow Checks:**

     * `require(a + b >= a, "overflow")` \- detects addition overflow

     * `require(a >= b, "underflow")` \- prevents subtraction underflow

     * Checks happen BEFORE arithmetic operations

  2. **Supply Cap Enforcement:**

     * Actually enforces `MAX_SUPPLY` limit

     * Prevents unlimited token creation

  3. **Access Control:**

     * Only owner can mint tokens

     * Prevents unauthorized token creation

  4. **Input Validation:**

     * Checks for zero addresses and amounts

     * Batch size limits prevent gas attacks




**How it prevents attacks:**

  * All arithmetic operations are validated before execution

  * Supply limits prevent economic manipulation

  * Access controls prevent unauthorized minting

  * Batch limits prevent gas-based attacks




**How Security Works:**

**Attack Prevention:**

  * Overflow/underflow checks prevent arithmetic attacks

  * Supply cap enforcement prevents unlimited token creation

  * Access control restricts minting to owner only

  * Input validation prevents edge cases




**Result:**

  * All arithmetic operations are safe

  * Economic model is protected

  * Attacks are blocked before execution




#### 

Protection Methods (summary)

Method

Solidity Version

Effectiveness

Gas Cost

Built-in Protection

0.8+

Very High

Low

SafeMath Library

<0.8

High

Medium

Manual Checks

Any

High

Low

Unchecked Blocks

0.8+ (when safe)

N/A

Very Low

* * *

## 

Prevention Strategies (Consolidated)

  1. Reentrancy Prevention

     * Primary: Checks-Effects-Interactions pattern

     * Secondary: Reentrancy guards (e.g., OpenZeppelin ReentrancyGuard)

     * Additional: Pull payments, limit gas forwarded, prefer transfer() for simple ETH sends

  2. Access Control Best Practices

     * Use battle-tested libraries: OpenZeppelin AccessControl, Ownable

     * Implement clear role hierarchy and immutable owner

     * Emit events for role changes and use multisig for critical roles

  3. Integer Overflow Protection

     * Use Solidity 0.8+ (automatic checks)

     * Add explicit pre-operation checks where appropriate

     * Enforce supply caps and input limits

     * For legacy code, use SafeMath

  4. General Principles

     * Defense in depth: stack protections

     * Fail securely: default to safe state on errors

     * Principle of least privilege: minimal necessary permissions

     * Thorough testing and professional audits before mainnet deployment




* * *

## 

Testing Vulnerabilities

Use these commands and steps to test examples in Remix (manual steps):

Copy
    
    
    # Deploy vulnerable contract in Remix
    # Deploy attacker contract and execute attack
    # Observe behavior and balances
    # Deploy secure version and verify attack fails

Verification steps:

  1. Deploy vulnerable contract on testnet (Somnia Testnet recommended).

  2. Attempt exploit using attacker contract.

  3. Observe vulnerability in action.

  4. Deploy secure version with protections.

  5. Verify exploit fails against secure implementation.




You can successfully identify and exploit vulnerabilities in a controlled test environment and verify mitigations on secure contracts.

* * *

## 

Common Vulnerability Patterns

Red flags in code review:

  * External calls before state updates

  * Missing access control modifiers

  * Unchecked arithmetic operations

  * Missing input validation

  * No event emissions for critical actions

  * Hardcoded addresses or values

  * Complex inheritance hierarchies

  * Missing reentrancy protection




Security scanning tools:

Tool

Type

Effectiveness

Cost

Slither

Static Analysis

High

Free

MythX

Comprehensive

Very High

Paid

Securify

Academic

Medium

Free

Manticore

Symbolic Execution

High

Free

* * *

## 

Additional Resources

  * [SWC Registry](https://swcregistry.io/) \- Smart Contract Weakness Classification

  * [Consensys Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)




* * *

✅ Verification: You can identify vulnerable patterns and understand how attacks work.

🎉 Congratulations! You've mastered the most critical smart contract vulnerabilities, prevention strategies and secure coding patterns.

[PreviousBuilding a Simple DEX on Somnia](/developer/building-dapps/example-applications/building-a-simple-dex-on-somnia)[NextAudit Checklist](/developer/security/audit-checklist)

Last updated 26 days ago
