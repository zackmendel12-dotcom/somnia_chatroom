# Deploy with Thirdweb | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Development Workflow](/developer/development-workflow)
  3. [Development Environment](/developer/development-workflow/development-environment)



# Deploy with Thirdweb

[Thirdweb](https://thirdweb.com/) is a complete web3 development framework that offers everything you need to connect your apps or games to the Somnia network. Its service allows developers to build, manage, and analyze their Web3 applications.

This tutorial will guide you through deploying a Smart contract to the Somnia Devnet using Thirdweb’s command-line tool (`thirdweb deploy`). Thirdweb simplifies deployment and interaction with smart contracts on Somnia.

## 

Prerequisites

  * This guide is not an introduction to Solidity Programming; you are expected to understand Basic Solidity Programming.

  * To complete this guide, you will need MetaMask installed and the Somnia DevNet added to the list of Networks. If you have yet to install MetaMask, please follow this guide to Connect Your Wallet.

  * Thirdweb CLI: Install globally with: 




Copy
    
    
    npm thirdweb install

## 

Set Up the Project

First, create a new folder for your project and initialize it.

Copy
    
    
    mkdir somnia-thirdweb-example
    cd somnia-thirdweb-example

## 

Write the Smart Contract

You can write your Smart Contract using the [Remix IDE](/developer/development-workflow/development-environment/deploy-with-remixide) to ensure it works. Create a file `**OpenGreeter.sol**` and add the following code:

OpenGreeter.sol

Copy
    
    
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.28;
    
    contract OpenGreeter {
        string public name;
        address public owner;
    
        event NameChanged(string oldName, string newName);
    
        constructor(string memory _initialName) {
            name = _initialName;
            owner = msg.sender;
               }
    
        function changeName(string memory _newName) public {
            string memory oldName = name;
            name = _newName;
            emit NameChanged(oldName, _newName);
        }
    
        function greet() external view returns (string memory) {
            return string(abi.encodePacked("Hello, ", name, "!"));
        }
    }

This is a simple Greeter Smart Contract that any address can call the `**changeName**` function. The Smart Contract has two functions: `**changeName**` \- This function allows anyone to change the name variable. It stores the old name, updates the name variable, and emits the `**NameChanged**` event with the old and new names.

`**greet**` \- This function returns a greeting message that includes the current name. It uses abi.encodePacked to concatenate strings efficiently.

## 

Deploy the Smart Contract using Thirdweb.

First, go to Thirdweb and create a profile. After you have completed the onboarding process, create a Project.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252Fu9gOGCPPoSlIjfJuC1Zw%252Fthirdweb1.png%3Falt%3Dmedia%26token%3Ddff88e99-035e-4c73-b436-2a466bd44d60&width=768&dpr=4&quality=100&sign=892469d0&sv=2)

Go to the project **settings.**

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252FXVHbePUtYbJknW7QN7iR%252Fthirdweb2.png%3Falt%3Dmedia%26token%3Dc25bdefa-6641-49f7-bf6a-f1bf2eb8af96&width=768&dpr=4&quality=100&sign=5fe901d2&sv=2)

**C** opy your secret key, and keep it safe. The secret key will be used to deploy the Smart Contract.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252FTILjmzz4OzFHDnBZK2kv%252FThirdweb3.png%3Falt%3Dmedia%26token%3De6f5c61f-0f70-482a-a4e2-4e92bdc2f1c7&width=768&dpr=4&quality=100&sign=cb59bd8b&sv=2)

Go to the terminal and paste the following command to deploy the Smart Contract:

Copy
    
    
    npx thirdweb deploy -k your_secret_key

Select the `**solc**` option to be `**true**` in the prompts on Terminal.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252FvXFViXZTG6BkZqil6k4J%252FThirdweb4.png%3Falt%3Dmedia%26token%3D33616b54-cb0a-4613-afff-55a368ca4976&width=768&dpr=4&quality=100&sign=4893772&sv=2)

Click the link to open the User Interface in your Browser to deploy the Smart Contract.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252FXxSQyhItIF4aZ9kOMiT0%252FThirdweb5.png%3Falt%3Dmedia%26token%3D0c09ee56-d67c-41a6-bdbd-cb692880754a&width=768&dpr=4&quality=100&sign=b359cd53&sv=2)

Enter an initialName. Select the Network as Somnia Devnet. Check the option to import it to the list of Contracts in your Thirdweb Dashboard. Click on `**Deploy Now**` and approve the Metamask prompts.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252F0OW54Q2s1vPVFab1onbx%252FThirdweb6.png%3Falt%3Dmedia%26token%3D9f3ee7f7-8c8e-4943-bf10-d87df11ff83b&width=768&dpr=4&quality=100&sign=a719ef39&sv=2)

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252FhqmD2JWR9VzDUU4utLaG%252FThirdweb7.png%3Falt%3Dmedia%26token%3D8cc44893-b356-4a21-89de-ac768441dbb5&width=768&dpr=4&quality=100&sign=68ad98f6&sv=2)

Your Smart Contract is deployed, and you can view it on your Thirdweb Dashboard.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252FgM5hUd8zY2McGaA39jRu%252FThirdweb8.png%3Falt%3Dmedia%26token%3Dc345e5aa-bf2d-491b-bc98-9238a0eeac43&width=768&dpr=4&quality=100&sign=b7b77859&sv=2)

Visit the Explorer section to simulate interactions with your deployed Smart Contract and carry out actual transactions.

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F2122549367-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FkYErT9t3BJtpPfejLO6I%252Fuploads%252FO8BaWj5O3A1sqAd9UghX%252FThirdweb9.png%3Falt%3Dmedia%26token%3D50477081-fda6-43c1-9d08-7e470e53b33a&width=768&dpr=4&quality=100&sign=cb35813e&sv=2)

Congratulations. 🎉 You have deployed your Smart Contract to the Somnia Network using Thirdweb. 🎉

[PreviousDeploy with Foundry](/developer/development-workflow/development-environment/deploy-with-foundry)[NextVerifying via Explorer](/developer/development-workflow/development-environment/verifying-via-explorer)

Last updated 1 month ago
