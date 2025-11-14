# Create ERC20 Tokens | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Building DApps](/developer/building-dapps)
  3. [Tokens and NFTs](/developer/building-dapps/tokens-and-nfts)



# Create ERC20 Tokens

The Somnia mission is to enable the development of mass-consumer real-time applications. To achieve this as a developer, you will need to build applications that are Token enabled, as this is a requirement for many Blockchain applications. This guide will teach you how to connect to and deploy your ERC20 Smart Contract to the Somia Network using the [Remix IDE](https://remix.ethereum.org/).

Somnia Mainnet is LIVE. To deploy on Somnia Mainnet, you will need SOMI Tokens. Please refer to the [guide](/get-started/getting-started-for-mainnet) on Moving from Testnet to Mainnet.

## 

Pre-requisite

  1. This guide is not an introduction to Solidity Programming; you are expected to understand Basic Solidity Programming.

  2. To complete this guide, you will need MetaMask installed and the Somnia Network added to the list of Networks. If you have yet to install MetaMask, please follow this guide to [Connect Your Wallet](/get-started/connect-your-wallet-to-mainnet).




Somnia Network is an EVM-compatible Layer 1 Blockchain. This means that critical implementation on Ethereum is available on Somnia, with higher throughput and faster finality. Smart Contract that follows the [ERC-20 standard](https://eips.ethereum.org/EIPS/eip-20) is an ERC-20 token; these Smart Contracts are often referred to as Token Contracts.

ERC-20 tokens provide functionality to

  * Transfer tokens

  * Allow others to transfer tokens on behalf of the token holder




It is important to note that ERC20 Smart Contracts are different from the Native Somnia Contracts, which are used to pay gas fees when transacting on Somnia. In the following steps, we will create an ERC20 Token by following the EIP Standard and also demonstrate the option to use a Library to create the ERC20 Token.

## 

IERC-20

According to the EIP Standard, certain Smart Contract methods must be implemented adhering to the standard so that other Smart Contracts can interact with the deployed Smart Contracts and call the method. To achieve this, we will use the Solidity Interface Type to create the Smart Contract standard. 

In Solidity, an interface is a special contract that defines a set of function signatures without implementation. It acts as a "blueprint" for other contracts, ensuring they adhere to a specific structure. Interfaces are crucial for creating standards, such as the ERC-20 token standards, allowing different contracts to interact seamlessly within the EVM ecosystem.

Create an Interface for the ERC20 Token. Copy and paste the code below into a file named `IERC20.sol`

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.22;
    
    interface IERC20 {
        function totalSupply() external view returns (uint256);
        function balanceOf(address account) external view returns (uint256);
        function transfer(address recipient, uint256 amount)
            external
            returns (bool);
        function allowance(address owner, address spender)
            external
            view
            returns (uint256);
        function approve(address spender, uint256 amount) external returns (bool);
        function transferFrom(address sender, address recipient, uint256 amount)
            external
            returns (bool);
    }

## 

ERC-20 Token Contract

With the Interface created and all the Token standard methods implemented, the next step is to import the Interface into the ERC20 Smart Contract implementation.

Create a file called `ERC20.sol` and paste the code below into it.

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.22;
    
    import "./IERC20.sol";
    
    contract ERC20 is IERC20 {
        event Transfer(address indexed from, address indexed to, uint256 value);
        event Approval(
            address indexed owner, address indexed spender, uint256 value
        );
    
        uint256 public totalSupply;
        mapping(address => uint256) public balanceOf;
        mapping(address => mapping(address => uint256)) public allowance;
        string public name;
        string public symbol;
        uint8 public decimals;
    
        constructor(string memory _name, string memory _symbol, uint8 _decimals) {
            name = _name;
            symbol = _symbol;
            decimals = _decimals;
        }
    
        function transfer(address recipient, uint256 amount)
            external
            returns (bool)
        {
            balanceOf[msg.sender] -= amount;
            balanceOf[recipient] += amount;
            emit Transfer(msg.sender, recipient, amount);
            return true;
        }
    
        function approve(address spender, uint256 amount) external returns (bool) {
            allowance[msg.sender][spender] = amount;
            emit Approval(msg.sender, spender, amount);
            return true;
        }
    
        function transferFrom(address sender, address recipient, uint256 amount)
            external
            returns (bool)
        {
            allowance[sender][msg.sender] -= amount;
            balanceOf[sender] -= amount;
            balanceOf[recipient] += amount;
            emit Transfer(sender, recipient, amount);
            return true;
        }
    
        function _mint(address to, uint256 amount) internal {
            balanceOf[to] += amount;
            totalSupply += amount;
            emit Transfer(address(0), to, amount);
        }
    
        function _burn(address from, uint256 amount) internal {
            balanceOf[from] -= amount;
            totalSupply -= amount;
            emit Transfer(from, address(0), amount);
        }
    
        function mint(address to, uint256 amount) external {
            _mint(to, amount);
        }
    
    
        function burn(address from, uint256 amount) external {
            _burn(from, amount);
        }
    }

We have implemented the various requirements for the ERC20 Token Standard:

`**constructor**`: Initializes the token's basic properties.

Accepts the token's `name`, `symbol`, and the number of `decimals` as parameters and sets these values as the token's immutable metadata.

Example: `ERC20("MyToken", "MTK", 18)` initializes a token named `MyToken` with the symbol 

`MTK` and 18 decimal places (the standard for ERC-20).

### 

Functions

`**transfer**`: Moves a specified `amount` of tokens from the _sender_ to a _recipient_.

It checks if the sender has enough balance and deducts the amount from the sender's balance, and adds it to the recipient's. It also **emits a Transfer event** to log the transaction and returns `**true** ` if the transfer is successful.

`**approve**`: It allows a _spender_ to spend up to a certain amount of tokens on behalf of the _owner_. It sets the `allowance` for the _spender_ to the specified `amount`. **The spender is usually another Smart Contract**. It then **emits an Approval event** to record the spender's `allowance`. It returns **true** if the `approval` is successful. A common use case is to enable spending through third-party contracts like decentralized exchanges (DEXs).

`**transferFrom**`: It allows a _spender_ to transfer tokens on behalf of another account.

It checks if the _sender_ has an approved `allowance` for the spender and ensures it is sufficient for the _amount_ and deducts the amount from the `allowance` and the sender's _balance_ and adds the _amount_ to the recipient's balance. It also **emits a Transfer event** to log the transaction. It returns `**true** ` if the transfer is successful. A common use case is DEXs or smart contracts to handle token transactions on behalf of users.

`**_mint**`: Creates new tokens and adds them to a specified account's _balance_.

Calling the method increases the recipient's `**balanceOf**` by the specified amount. It also increases the `**totalSupply**` of the ERC20 Tokens by the same amount. A transfer event with the from address as address(0) (indicating tokens are created).

`**_burn**`: Destroys a specified number of _tokens_ from an account's _balance_.

It reduces the account's `**balanceOf**` and decreases the `**totalSupply**` by the amount. It emits a Transfer event with the to address as address(0) (indicating tokens are burned).

It is typically implemented in token-burning mechanisms to reduce supply, increasing scarcity.

`**mint**`: Public wrapper for `**_mint**`. It calls `**_mint**` to create new tokens for a specified to address. Allows the contract owner or authorized accounts to mint new tokens.

`**burn**`: Public wrapper for `**_burn**`. Calls _burn to destroy tokens from a specified from address.

### 

Events

`**Transfer**`:

Logs token transfers, including minting and burning events. Parameters: from (sender), to (recipient), value (amount).

`**Approval**`:

Logs approvals of allowances for spenders. Parameters: owner, spender, value (allowance amount).

## 

Compile Smart Contract

The ERC20 Token is now ready to be deployed to the Somnia Blockchain.

On the left tab, click the “Solidity Compiler” menu item and then the “ Compile ERC20.sol” button. This will compile the Solidity file and convert the Solidity code into machine-readable bytecode.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252FySYqHAeTuffcUc6GyICA%252FERC20-1.png%3Falt%3Dmedia%26token%3Dcafc024f-0b65-4a57-ad4b-a572e0f101f7&width=768&dpr=4&quality=100&sign=26bc40cc&sv=2)

## 

Deploy Smart Contract

The Smart Contract has been created and compiled into ByteCode, and the ABI has also been created. The next step is to deploy the Smart Contract to the Somnia DevNet so that you can perform READ and WRITE operations.

On the left tab, click the “Deploy and run transactions” menu item. To deploy the Smart Contract, we will require a wallet connection. In the Environment dropdown, select the option: “Injected Provider - MetaMask”. Then select the MetaMask account where you have STT Tokens. 

In the “DEPLOY” field, enter the property values for the ERC20 Token:

  * “_NAME” - type string

  * “_SYMBOL” - type string

  * “_DECIMALS” - type uint8




Click Deploy. 

When prompted, approve the Contract deployment on your MetaMask. 

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252F7Bnmh0xRi9fTFDuYwZ1u%252FERC20-2.png%3Falt%3Dmedia%26token%3D68d16050-9d93-4da7-9581-6a9d5943c762&width=768&dpr=4&quality=100&sign=54bbd915&sv=2)

Look at the terminal for the response and the deployed Smart Contract address. You can interact with the Smart Contract via the Remix IDE. Send a transaction to change the name.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252FY6AD65aY4S9Sjhm1jMZX%252FERC20-3.png%3Falt%3Dmedia%26token%3D056082b4-b772-4da9-b855-f07cf6c60a2b&width=768&dpr=4&quality=100&sign=87857390&sv=2)

Congratulations. 🎉 You have deployed an ERC20 Smart Contract to the Somnia Network. 🎉

* * *

### 

OpenZeppelin

As was mentioned at the beginning of this Tutorial, there is the option to use a Library to create the ERC20 Token. The OpenZeppelin Smart Contract Library can be used to create an ERC20 Token, and developers can rely on the Smart Contracts wizard to specify particular properties for the created Token. See an example below: 

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.22;
    
    
    import "@openzeppelin/[[email protected]](/cdn-cgi/l/email-protection)/token/ERC20/ERC20.sol";
    import "@openzeppelin/[[email protected]](/cdn-cgi/l/email-protection)/token/ERC20/extensions/ERC20Burnable.sol";
    import "@openzeppelin/[[email protected]](/cdn-cgi/l/email-protection)/access/Ownable.sol";
    
    
    contract MyToken is ERC20, ERC20Burnable, Ownable {
        constructor(address initialOwner)
            ERC20("MyToken", "MTK")
            Ownable()
        {}
    
    
        function mint(address to, uint256 amount) public onlyOwner {
            _mint(to, amount);
        }
    }

The process for deploying this Smart Contract implementation built with OpenZeppelin is the same as Steps 3 and 4 above.

[PreviousTokens and NFTs](/developer/building-dapps/tokens-and-nfts)[NextCreate ERC721 NFT Collections](/developer/building-dapps/tokens-and-nfts/create-erc721-nft-collections)

Last updated 1 month ago
