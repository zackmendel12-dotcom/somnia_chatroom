# Audit Checklist | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Security](/developer/security)



# Audit Checklist

This Self-Review Audit Checklist is the mandatory, internal quality assurance process that every smart contract must undergo before deployment to any public or private blockchain environment. Its purpose is to catch common, critical, and complex security vulnerabilities early, significantly reducing the risk of exploits, financial loss, and costly post-deployment fixes.

This process consists of two primary phases: a Manual Pre-Deployment Checklist and Automated Static Analysis Tooling.

## 

Phase 1: Manual Pre-Deployment Checklist

The development team must manually review and verify that the contract adheres to the following security, logic, and best-practice requirements.

**1.1. Security Vulnerability Checks**

Item

Requirement

Verification Steps

**Reentrancy Protection**

All functions that send Ether or tokens to external addresses must follow the Checks-Effects-Interactions pattern.

Verify that state variables are updated before any external calls are made. Use `transfer`/`send` methods or reentrancy guards where necessary.

**Access Control**

Critical state-changing functions (e.g., `setOwner`, `pause`, `upgrade`, `mint`) must be guarded by proper access modifiers (e.g., `onlyOwner`, `onlyRole`).

Check that function visibility is correctly set (e.g., `internal`, `external`, `private`).

**Integer Overflow/Underflow**

All arithmetic operations, especially those based on user input, must be safe.

For Solidity >= 0.8.0, verify the compiler's default overflow checks are not disabled. For older versions, ensure the use of SafeMath libraries.

**Denial-of-Service (DoS)**

Operations must not iterate over unbounded arrays or map sizes that could be arbitrarily inflated by a malicious user, leading to excessive gas costs.

Check all loops to ensure iteration counts are fixed or restricted.

**External Call Security**

All interactions with unknown or untrusted external contracts are handled safely.

Ensure that results of external calls are checked and fail gracefully if necessary. Use call wrappers to limit reentrancy risk.

**Visibility**

State variables and functions intended for internal use must be declared `private` or `internal`.

Review all function and variable declarations for accidental public exposure.

**1.2. Logic and Functional Checks**

Item

Requirement

Verification Steps

**Functional Specification**

The contract logic precisely matches the intended business logic and all requirements documented in the functional specification.

Verify contract against all use cases and edge cases defined in the project scope.

**State Transitions**

The contract's state (e.g., token balances, operational phase) transitions correctly and predictably.

Trace critical functions (`transfer`, `claim`, `lock`) to ensure state variables update correctly.

**Error Handling**

All potential failure points are handled gracefully with clear, descriptive error messages.

Ensure that `require()` or `revert()` statements are used everywhere necessary and that custom error codes are defined and leveraged.

**Event Emission**

All critical state changes and value transfers must emit an appropriate `Event` to allow for off-chain monitoring, indexing, and UI responsiveness.

Verify that an `Event` is emitted for every action that changes a user-facing state.

## 

Phase 2: Automated Static Analysis Tools

Static analysis is a mandatory, automated review step that must be completed using approved tools before deployment.

**2.1. Mandatory Tooling**

The following static analysis tools must be executed against the final version of the smart contract code:

Tool

Purpose

Output Review Requirement

[**Slither**](https://github.com/crytic/slither)

Detects various security vulnerabilities (e.g., reentrancy, unprotected calls, misuses of `msg.sender`) and code optimization issues.

Must be executed with all security and efficiency detectors enabled.

[**Mythril**](https://github.com/ConsenSysDiligence/mythril)

Performs symbolic execution to find potential execution paths that could lead to vulnerabilities (e.g., integer overflows, assertion failures).

Must be run using its security analysis modes (e.g., full scan, execution path analysis).

[**Solhint**](https://github.com/protofire/solhint)

Enforces code style and security best practices, ensuring clean and maintainable code.

Must pass all configured security and style rulesets without warnings.

**2.2. Warning Triage and Sign-off**

High/Critical Severity Warnings

Any issue categorized as High or Critical by the static analysis tools must be fixed immediately. The deployment process cannot proceed until these are resolved and the tools run clean.

Medium/Low Severity Warnings

These must be reviewed by a lead developer. They must either be:

  * Fixed: If the issue is a genuine vulnerability or best practice deviation.

  * Justified: If the tool's warning is a false positive or the logic is intentionally implemented in that manner, a clear, documented justification must be added to a dedicated "Audit Waivers" log.




Report Retention

The final, clean static analysis reports must be saved and archived as part of the pre-deployment documentation.

**Congratulations!** You've mastered the audit checklist for both manual and automatic process. Continue to learn prevention strategies and secure coding patterns.

[PreviousSmart Contract Security 101](/developer/security/smart-contract-security-101)[NextNode/Infra Security](/developer/security/node-infra-security)

Last updated 21 days ago
