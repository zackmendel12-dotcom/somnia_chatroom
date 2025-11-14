# DAO Smart Contract | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Building DApps](/developer/building-dapps)
  3. [Example Applications](/developer/building-dapps/example-applications)



# DAO Smart Contract

Decentralized Autonomous Organizations (DAOs) are an innovative way to organize communities where decisions are made collectively without centralized authority. In this tutorial, we’ll explore a simple DAO implemented in Solidity. By the end, you’ll understand how to deploy and interact with this contract.

Somnia Mainnet is LIVE. To deploy on Somnia Mainnet, you will need SOMI Tokens. Please refer to the [guide](/get-started/getting-started-for-mainnet) on Moving from Testnet to Mainnet.

## 

Example Use Case: DAO Implementation in Gaming

DAOs can be particularly impactful in gaming environments. Imagine a massive multiplayer online game (MMO) with a shared in-game economy. A DAO can be used to manage a treasury funded by player contributions, allowing players to propose and vote on game updates, community events, or rewards.

For example:

  1. In-Game Treasury Management: Players deposit some of their in-game earnings into a DAO treasury. Proposals for using these funds—such as hosting tournaments or funding new content—are created and voted on.

  2. Player-Driven Governance: Gamers vote on new features like maps, characters, or weapons, giving them a direct say in the game's evolution.

  3. Community Rewards: DAOs could allocate funds to reward top-performing players or teams, enhancing engagement and competition.




This decentralized approach ensures that game updates align with player interests, creating a more engaging and community-driven gaming experience.

## 

Prerequisites

Before starting, ensure you have:

  1. This guide is not an introduction to Solidity Programming; you are expected to understand Basic Solidity Programming.

  2. To complete this guide, you will need MetaMask installed and the Somnia Network added to the list of Networks. If you have yet to install MetaMask, please follow this guide to Connect Your Wallet.

  3. You can deploy the Smart Contracts using our Hardhat or Foundry guides.




## 

Overview of the DAO Contract

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Flh7-rt.googleusercontent.com%2Fdocsz%2FAD_4nXdJhAoATXHidSpCiF3u9C42iFnofuVqoMNCc3QyfzWhFAlxRCtwFtPbxfDexiWAdKTjUprX56sA5e3YtxI-jwfmVsTPkDoucVvkCCpQKLJHPTSD6uGa1xkioMbOfbSjy0IO_ERmeQ%3Fkey%3D96mDMjIvPGrXt0Tzk68UXspT&width=768&dpr=4&quality=100&sign=23ad0fa6&sv=2)

The provided DAO contract allows users to:

  1. Deposit funds to gain voting power.

  2. Create proposals.

  3. Vote on proposals.

  4. Execute proposals if they pass.




The key features of the contract include:

  * Proposal Struct: Stores details of proposals.

  * Voting Mechanism: Allows weighted voting based on deposited funds.

  * Execution Logic: Ensures proposals are executed only if approved.




## 

Setting Up the Development Environment

Follow the [Hardhat](/developer/development-workflow/development-environment/deploy-with-hardhat) or [Foundry](/developer/development-workflow/development-environment/deploy-with-foundry) guides.

## 

Create the Smart Contract

Create a new file named DAO.sol in the contracts folder and copy the provided contract code. 

DAO.sol

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.28;
    
    contract DAO {
        struct Proposal {
            string description; // Proposal details
            uint256 deadline;   // Voting deadline
            uint256 yesVotes;   // Votes in favor
            uint256 noVotes;    // Votes against
            bool executed;      // Whether the proposal has been executed
            address proposer;   // Address of the proposer
        }
    
        mapping(uint256 => Proposal) public proposals;
        mapping(address => uint256) public votingPower;
        mapping(uint256 => mapping(address => bool)) public hasVoted;
    
        uint256 public totalProposals;
        uint256 public votingDuration = 10 minutes;
        address public owner;
    
        modifier onlyOwner() {
            require(msg.sender == owner, "Not the owner");
            _;
        }
    
        constructor() {
            owner = msg.sender;
        }
    
        function deposit() external payable {
            require(msg.value == 0.001 ether, "Must deposit STT");
            votingPower[msg.sender] += msg.value;
        }
    
        function createProposal(string calldata description) external {
            require(votingPower[msg.sender] > 0, "No voting power");
    
            proposals[totalProposals] = Proposal({
                description: description,
                deadline: block.timestamp + votingDuration,
                yesVotes: 0,
                noVotes: 0,
                executed: false,
                proposer: msg.sender
            });
    
            totalProposals++;
        }
    
        function vote(uint256 proposalId, bool support) external {
            Proposal storage proposal = proposals[proposalId];
    
            require(block.timestamp < proposal.deadline, "Voting has ended");
            require(!hasVoted[proposalId][msg.sender], "Already voted");
            require(votingPower[msg.sender] > 0, "No voting power");
    
            hasVoted[proposalId][msg.sender] = true;
    
            if (support) {
                proposal.yesVotes += votingPower[msg.sender];
            } else {
                proposal.noVotes += votingPower[msg.sender];
            }
        }
    
        function executeProposal(uint256 proposalId) external {
            Proposal storage proposal = proposals[proposalId];
    
            require(block.timestamp >= proposal.deadline, "Voting still active");
            require(!proposal.executed, "Proposal already executed");
            require(proposal.yesVotes > proposal.noVotes, "Proposal did not pass");
    
            proposal.executed = true;
    
            // Logic for proposal execution
            // Example: transfer STT to proposer as a reward for successful vote pass
            payable(proposal.proposer).transfer(0.001 ether);
        }
    }
    

Let’s break down the contract into its main components:

#### 

Mappings

Mappings are used to store structured data efficiently:

  1. `**proposals**`




Copy
    
    
    mapping(uint256 => Proposal) public proposals;

  * Stores all proposals created in the DAO.

  * It represents the Proposal `struct` containing details like description, deadline, votes, and proposer.




Copy
    
    
    struct Proposal {
            string description; // Proposal details
            uint256 deadline;   // Voting deadline
            uint256 yesVotes;   // Votes in favor
            uint256 noVotes;    // Votes against
            bool executed;      // Whether the proposal has been executed
            address proposer;   // Address of the proposer
        }

  1. `**votingPower**`




Copy
    
    
    mapping(address => uint256) public votingPower;

  * Tracks the voting power of each address.

  * Voting power increases when users deposit funds into the DAO.



  1. `**hasVoted**`




Copy
    
    
    mapping(uint256 => mapping(address => bool)) public hasVoted;

  * Tracks whether a specific address has voted on a specific proposal.

  * Prevents double voting.




#### 

Functions

The contract includes several key functions:

  1. `**Constructor**`




Copy
    
    
    constructor() {
        owner = msg.sender;
    }

  * Sets the deployer as the owner of the contract. 



  1. `**deposit**`




Copy
    
    
    function deposit() external payable {
        require(msg.value >= 0.001 ether, "Minimum deposit is 0.001 STT");
        votingPower[msg.sender] += msg.value;
    }

  * Allows users to deposit STT Tokens to gain voting power.

  * Increases their votingPower by the amount deposited.



  1. `**createProposal**`




Copy
    
    
    function createProposal(string calldata description) external {
        require(votingPower[msg.sender] > 0, "No voting power");
        proposals[totalProposals] = Proposal({
            description: description,
            deadline: block.timestamp + votingDuration,
            yesVotes: 0,
            noVotes: 0,
            executed: false,
            proposer: msg.sender
        });
        totalProposals++;
    }    

  * Allows users with voting power to create new proposals.

  * Adds the proposal to the proposals mapping.



  1. `**vote**`




Copy
    
    
    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
    
    
        require(block.timestamp < proposal.deadline, "Voting has ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        require(votingPower[msg.sender] > 0, "No voting power");
    
    
        hasVoted[proposalId][msg.sender] = true;
    
    
        if (support) {
            proposal.yesVotes += votingPower[msg.sender];
        } else {
            proposal.noVotes += votingPower[msg.sender];
        }
    }

  * Allows users to cast a vote on a proposal.

  * Updates the `**yesVotes**` or `**noVotes**` in the Proposal struct based on the user's choice.

  * Prevents double voting by using the `**hasVoted**` mapping.



  1. `**executeProposal**`




Copy
    
    
    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
    
        require(block.timestamp >= proposal.deadline, "Voting still active");
        require(!proposal.executed, "Proposal already executed");
        require(proposal.yesVotes > proposal.noVotes, "Proposal did not pass");
        
        proposal.executed = true;
        payable(proposal.proposer).transfer(0.001 ether);
    }

  * Executes a proposal if it passes (more yes votes than no votes).

  * Transfers a fixed amount of ETH to the proposer as an example of execution logic.

  * Ensures proposals cannot be executed multiple times.




#### 

Key Variables

  1. `**totalProposals**`




Copy
    
    
    uint256 public totalProposals;

  * Tracks the total number of proposals created.



  1. `**votingDuration**`




Copy
    
    
    uint256 public votingDuration = 10 minutes;

  * Sets the default duration for voting on proposals.



  1. `**owner**`




Copy
    
    
    address public owner;

  * Stores the address of the contract owner.

  * Used for functions that require administrative control.




Understanding these components shows how the DAO enables decentralized governance while maintaining transparency and fairness.

## 

Deploy the Smart Contract to Somnia

Follow the [Hardhat](/developer/development-workflow/development-environment/deploy-with-hardhat) or [Foundry](/developer/development-workflow/development-environment/deploy-with-foundry) guides. First, compile the Smart Contract to Bytecode by running the Hardhat or Foundry compile instructions.

This is an example deployment script using Hardhat. Create a file in the `**/ignition/module**` folder and name it `**deploy.js**`

Copy
    
    
    import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
    
    const dao = buildModule("DAO", (m) => {
      const contract = m.contract("DAO");
      return { contract };
    });
    
    module.exports = dao;

Before running the deploy command, add Somnia Network to the `**hardhat.config.js**` file:

Copy
    
    
    const config = {
      solidity: "0.8.28",
      networks: {
        somnia: {
          url: "https://dream-rpc.somnia.network",
          accounts: ["YOUR_PRIVATE_KEY"],
        },
      },
    };

Ensure that the deploying address has enough STT Tokens. You can get STT Tokens from the [Faucet](https://devnet.somnia.network/).

Run the deployment script:

Copy
    
    
    npx hardhat ignition deploy ./ignition/modules/deploy.ts --network somnia

Congratulations. 🎉 You have successfully deployed the DAO Smart Contract. 🎉

## 

Interacting with the Contract

Use the Hardhat console or scripts to interact with the contract.

#### 

1\. Deposit Funds

Call the deposit function to gain voting power:

Copy
    
    
    await dao.deposit({ value: ethers.utils.parseEther("0.001") });

#### 

2\. Create a Proposal

Create a new proposal by calling createProposal:

Copy
    
    
    await dao.createProposal("Fund development of new feature");

#### 

3\. Vote on a Proposal

Vote on a proposal by specifying its ID and your support (true for yes, false for no):

Copy
    
    
    await dao.vote(0, true); // Vote ‘yes’ on proposal 0

#### 

4\. Execute a Proposal

After the voting deadline, execute the proposal if it has majority votes:

Copy
    
    
    await dao.executeProposal(0);

## 

Testing the Contract

#### 

Writing Tests

Create a test file DAO.test.js in the test folder. 

Copy
    
    
    const { expect } = require("chai");
    const { ethers } = require("hardhat");
    
    
    describe("DAO", function () {
      let dao;
      let owner, addr1;
    
    
      beforeEach(async function () {
        const DAO = await ethers.getContractFactory("DAO");
        dao = await DAO.deploy();
        [owner, addr1] = await ethers.getSigners();
      });
    
    
      it("Should allow deposits and update voting power", async function () {
        await dao.connect(addr1).deposit({ value: ethers.utils.parseEther("0.001") });
        expect(await dao.votingPower(addr1.address)).to.equal(ethers.utils.parseEther("0.001"));
      });
    
    
      it("Should allow proposal creation", async function () {
        await dao.connect(addr1).deposit({ value: ethers.utils.parseEther("0.001") });
        await dao.connect(addr1).createProposal("Test Proposal");
        const proposal = await dao.proposals(0);
        expect(proposal.description).to.equal("Test Proposal");
      });
    });

Run the tests:

Copy
    
    
    npx hardhat test

## 

Enhance the DAO

You can expand this DAO contract by:

  1. Adding Governance Tokens: Reward participants with tokens for voting or executing proposals. Follow the ERC20 Token Guide here.

  2. Implementing Quorums: Require a minimum number of votes for proposals to pass.

  3. Flexible Voting Power: Allow dynamic voting power allocation.




## 

Conclusion

This tutorial provided a foundational understanding of building and deploying a simple DAO on Somnia. Experiment with enhancements to create more complex governance structures. DAOs are a powerful tool for decentralized decision-making, and the possibilities for innovation are limitless!

[PreviousExample Applications](/developer/building-dapps/example-applications)[NextDAO UI Tutorial p1](/developer/building-dapps/example-applications/dao-ui-tutorial-p1)

Last updated 2 months ago
