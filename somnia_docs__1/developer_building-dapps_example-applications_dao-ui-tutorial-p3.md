# DAO UI Tutorial p3 | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [Building DApps](/developer/building-dapps)
  3. [Example Applications](/developer/building-dapps/example-applications)



# DAO UI Tutorial p3

This guide focuses exclusively on implementing Write Operations—interacting with your smart contract to perform actions such as depositing funds, creating proposals, voting, and executing proposals for the [DAO Smart Contract](/developer/building-dapps/example-applications/dao-smart-contract). By the end of this article, you’ll be able to:

  1. Understand the Write Operations necessary for the DAO.

  2. Implement these operations within the existing [WalletContext](/developer/building-dapps/example-applications/dao-ui-tutorial-p1).

  3. Integrate these operations into your Next.js pages with intuitive UI components.

  4. Handle transaction states and provide user feedback.




Prerequisite: Ensure you’ve completed [Part 2](/developer/building-dapps/example-applications/dao-ui-tutorial-p2) of this series, where you set up the WalletContext for global state management and added a global NavBar.

* * *

## 

Overview of Write Operations

Write Operations in a DAO involve actions that modify the blockchain state. These include:

  * Depositing Funds: Adding 0.001 STT to the DAO to gain voting power.

  * Creating Proposals: Submitting new proposals for the DAO to consider.

  * Voting on Proposals: Casting votes (Yes/No) on existing proposals.

  * Executing Proposals: Finalizing and implementing approved proposals.




These operations require users to sign transactions, incurring gas fees. Proper handling of these interactions is crucial for a smooth user experience.

* * *

## 

Expand WalletContext with Write Functions

We’ll enhance the existing WalletContext by adding functions to handle the aforementioned write operations. This centralized approach ensures that all blockchain interactions are managed consistently.

### 

Implement deposit

Allows users to deposit a fixed amount of ETH (e.g., 0.001 ETH) into the DAO contract to gain voting power.

contexts/walletContext.js

Copy
    
    
    import { parseEther } from "viem";
    
    export function WalletProvider({ children }) {
      // ...existing state and actions
      
      // Deposit Function
      const deposit = async () => {
        if (!client || !address) {
          alert("Please connect your wallet first!");
          return;
        }
        try {
          const tx = await client.writeContract({
            address: "0x7be249A360DB86E2Cf538A6893f37aFd89C70Ab4", // Your DAO contract address
            abi: ABI,
            functionName: "deposit",
            value: parseEther("0.001"), // 0.001 STT
          });
          console.log("Deposit Transaction:", tx);
          alert("Deposit successful! Transaction hash: " + tx.hash);
        } catch (error) {
          console.error("Deposit failed:", error);
          alert("Deposit failed. Check console for details.");
        }
      };
      // ...other functions
      return (
        <WalletContext.Provider
          value={{
            // ...existing values
            deposit,
            // ...other write functions
          }}
        >
          {children}
        </WalletContext.Provider>
      );
    }

`**parseEther("0.001")**`: Converts 0.001 STT to Wei, the smallest denomination of Ether.

`**writeContract**`: Sends a transaction to call the deposit function on the DAO contract, transferring 0.001 STT.

### 

Implement createProposal

Allows users to create a new proposal by submitting a description.

contexts/walletContext.js

Copy
    
    
    export function WalletProvider({ children }) {
      // ...existing state and actions
      
      // Create Proposal Function
      const createProposal = async (description) => {
        if (!client || !address) {
          alert("Please connect your wallet first!");
          return;
        }
        try {
          const tx = await client.writeContract({
            address: "0x7be249A360DB86E2Cf538A6893f37aFd89C70Ab4", // Your DAO contract address
            abi: ABI,
            functionName: "createProposal",
            args: [description],
          });
          console.log("Create Proposal Transaction:", tx);
          alert("Proposal created! Transaction hash: " + tx.hash);
        } catch (error) {
          console.error("Create Proposal failed:", error);
          alert("Failed to create proposal. Check console for details.");
        }
      };
      // ...other functions
      return (
        <WalletContext.Provider
          value={{
            // ...existing values
            createProposal,
            // ...other write functions
          }}
        >
          {children}
        </WalletContext.Provider>
      );
    }

`**createProposal(description)**`: Takes a proposal description as an argument and sends a transaction to the DAO contract to create the proposal.

### 

Implement voteOnProposal

Allows users to vote on a specific proposal by its ID, supporting either a Yes or No vote.

contexts/walletContext.js

Copy
    
    
    export function WalletProvider({ children }) {
    // ...existing state and actions
      // Vote on Proposal Function
      const voteOnProposal = async (proposalId, support) => {
        if (!client || !address) {
          alert("Please connect your wallet first!");
          return;
        }
        try {
          const tx = await client.writeContract({
            address: "0x7be249A360DB86E2Cf538A6893f37aFd89C70Ab4", // Your DAO contract address
            abi: ABI,
            functionName: "vote",
            args: [parseInt(proposalId), support],
          });
          console.log("Vote Transaction:", tx);
          alert(`Voted ${support ? "YES" : "NO"} on proposal #${proposalId}! Transaction hash: ${tx.hash}`);
        } catch (error) {
          console.error("Vote failed:", error);
          alert("Voting failed. Check console for details.");
        }
      };
      // ...other functions
      return (
        <WalletContext.Provider
          value={{
            // ...existing values
            voteOnProposal,
            // ...other write functions
          }}
        >
          {children}
        </WalletContext.Provider>
      );
    }

`**voteOnProposal(proposalId, support)**`: Takes a proposal ID and a boolean indicating support (`**true for Yes, false for No**`). Sends a transaction to cast the vote.

### 

Implement executeProposal

Allows users to execute a proposal if it meets the necessary conditions (e.g., quorum reached).

contexts/walletContext.js

Copy
    
    
    export function WalletProvider({ children }) {
      // ...existing state and actions
      // Execute Proposal Function
      const executeProposal = async (proposalId) => {
        if (!client || !address) {
          alert("Please connect your wallet first!");
          return;
        }
        try {
          const tx = await client.writeContract({
            address: "0x7be249A360DB86E2Cf538A6893f37aFd89C70Ab4", // Your DAO contract address
            abi: ABI,
            functionName: "executeProposal",
            args: [parseInt(proposalId)],
          });
          console.log("Execute Proposal Transaction:", tx);
          alert(`Proposal #${proposalId} executed! Transaction hash: ${tx.hash}`);
        } catch (error) {
          console.error("Execute Proposal failed:", error);
          alert("Execution failed. Check console for details.");
        }
      };
      // ...other functions
      return (
        <WalletContext.Provider
          value={{
            // ...existing values
            executeProposal,
            // ...other write functions
          }}
        >
          {children}
        </WalletContext.Provider>
      );
    }

`**executeProposal(proposalId)**`: Takes a proposal ID and sends a transaction to execute the proposal.

* * *

## 

Integrate Write Operations

With the write functions added to WalletContext, the next step is to integrate these operations into your Next.js pages, providing users with interactive UI components to perform actions.

### 

Create-Proposal Page

Allow users to submit new proposals by entering a description.

pages/create-proposal.js

Copy
    
    
    import { useState } from "react";
    import { useRouter } from "next/router";
    import { useWallet } from "../contexts/walletContext";
    import { Label, TextInput, Button, Alert } from "flowbite-react";
    
    export default function CreateProposalPage() {
      const [description, setDescription] = useState("");
      const [loading, setLoading] = useState(false);
      const [success, setSuccess] = useState("");
      const [error, setError] = useState("");
      
      const { connected, createProposal } = useWallet();
      const router = useRouter();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!connected) {
          setError("You must connect your wallet first!");
          return;
        }
        if (!description.trim()) {
          setError("Proposal description cannot be empty!");
          return;
        }
        setLoading(true);
        try {
          await createProposal(description.trim());
          setSuccess("Proposal created successfully!");
          setDescription("");
          // Optionally redirect to home or another page
          // router.push("/");
        } catch (err) {
          console.error("Error creating proposal:", err);
          setError("Failed to create proposal. Check console for details.");
        } finally {
          setLoading(false);
        }
      };
      
      return (
        <div className="max-w-2xl mx-auto mt-20 p-4">
          <h1 className="text-2xl font-bold mb-4">Create Proposal</h1>
          
          {error && (
            <Alert color="failure" className="mb-4">
              <span>
                <span className="font-medium">Error!</span> {error}
              </span>
            </Alert>
          )}
          
          {success && (
            <Alert color="success" className="mb-4">
              <span>
                <span className="font-medium">Success!</span> {success}
              </span>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="proposal-description" value="Proposal Description" />
              <TextInput
                id="proposal-description"
                type="text"
                placeholder="Enter proposal description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <Button type="submit" color="purple" disabled={loading}>
              {loading ? "Submitting..." : "Submit Proposal"}
            </Button>
          </form>
        </div>
      );
    }

State Variables:

  * **description** : Stores the user's input for the proposal description.

  * **loading** : Indicates whether the submission is in progress.

  * **success** **& error**: Handle user feedback messages.




The `**handleSubmit**` function undergoes validation, ensuring that the user is connected and has entered a description. It then calls the `**createProposal**` from `**WalletContext**`. It displays success or error messages based on the outcome.

The return statement contains the UI Components:

  * Label & TextInput: For user input.

  * Button: Triggers the submission. Disabled and shows a loading state when processing.

  * Alert: Provides visual feedback for success and error messages.




### 

Fetch-Proposal Page: Vote and Execution

Allow users to fetch proposal details, vote on them, and execute if eligible.

pages/fetch-proposal.js

Copy
    
    
    import { useState } from "react";
    import { useWallet } from "../contexts/walletContext";
    import { Button, Card, Label, TextInput, Spinner, Alert } from "flowbite-react";
    
    export default function FetchProposalPage() {
      const [proposalId, setProposalId] = useState("");
      const [proposalData, setProposalData] = useState(null);
      const [loading, setLoading] = useState(false);
      const [voting, setVoting] = useState(false);
      const [executing, setExecuting] = useState(false);
      const [error, setError] = useState("");
      const [success, setSuccess] = useState("");
      
      const { connected, fetchProposal, voteOnProposal, executeProposal } = useWallet();
      
      const handleFetch = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setProposalData(null);
        if (!connected) {
          setError("You must connect your wallet first!");
          return;
        }
        if (!proposalId.trim()) {
          setError("Please enter a proposal ID.");
          return;
        }
        setLoading(true);
        try {
          const data = await fetchProposal(proposalId);
          setProposalData(data);
        } catch (err) {
          console.error("Error fetching proposal:", err);
          setError("Failed to fetch proposal. Check console for details.");
        } finally {
          setLoading(false);
        }
      };
      const handleVote = async (support) => {
        setError("");
        setSuccess("");
        setVoting(true);
        try {
          await voteOnProposal(proposalId, support);
          setSuccess(`Successfully voted ${support ? "YES" : "NO"} on proposal #${proposalId}.`);
          // Optionally, refresh the proposal data
          const updatedData = await fetchProposal(proposalId);
          setProposalData(updatedData);
        } catch (err) {
          console.error("Error voting:", err);
          setError("Voting failed. Check console for details.");
        } finally {
          setVoting(false);
        }
      };
      const handleExecute = async () => {
        setError("");
        setSuccess("");
        setExecuting(true);
        try {
          await executeProposal(proposalId);
          setSuccess(`Proposal #${proposalId} executed successfully.`);
          // Optionally, refresh the proposal data
          const updatedData = await fetchProposal(proposalId);
          setProposalData(updatedData);
        } catch (err) {
          console.error("Error executing proposal:", err);
          setError("Execution failed. Check console for details.");
        } finally {
          setExecuting(false);
        }
      };
      return (
        <div className="max-w-2xl mx-auto mt-20 p-4">
          <h1 className="text-2xl font-bold mb-4">Fetch a Proposal</h1>
          {/* Form to input Proposal ID */}
          <form onSubmit={handleFetch} className="space-y-4">
            <div>
              <Label htmlFor="proposal-id" value="Proposal ID" />
              <TextInput
                id="proposal-id"
                type="number"
                placeholder="Enter proposal ID"
                value={proposalId}
                onChange={(e) => setProposalId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" color="blue" disabled={loading}>
              {loading ? <Spinner aria-label="Loading" /> : "Fetch Proposal"}
            </Button>
          </form>
          {/* Display Errors */}
          {error && (
            <Alert color="failure" className="mt-4">
              <span>
                <span className="font-medium">Error!</span> {error}
              </span>
            </Alert>
          )}
          {/* Display Success Messages */}
          {success && (
            <Alert color="success" className="mt-4">
              <span>
                <span className="font-medium">Success!</span> {success}
              </span>
            </Alert>
          )}
          {/* Display Proposal Details */}
          {proposalData && (
            <Card className="mt-8">
              <h2 className="text-xl font-bold mb-2">Proposal #{proposalId}</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Description:</strong> {proposalData[0]}
                </li>
                <li>
                  <strong>Deadline:</strong> {new Date(proposalData[1] * 1000).toLocaleString()}
                </li>
                <li>
                  <strong>Yes Votes:</strong> {proposalData[2].toString()}
                </li>
                <li>
                  <strong>No Votes:</strong> {proposalData[3].toString()}
                </li>
                <li>
                  <strong>Executed:</strong> {proposalData[4] ? "Yes" : "No"}
                </li>
                <li>
                  <strong>Proposer:</strong> {proposalData[5]}
                </li>
              </ul>
              {/* Voting Buttons */}
              <div className="mt-4 flex space-x-4">
                <Button
                  color="green"
                  onClick={() => handleVote(true)}
                  disabled={voting || executing}
                >
                  {voting ? <Spinner aria-label="Loading" size="sm" /> : "Vote YES"}
                </Button>
                <Button
                  color="red"
                  onClick={() => handleVote(false)}
                  disabled={voting || executing}
                >
                  {voting ? <Spinner aria-label="Loading" size="sm" /> : "Vote NO"}
                </Button>
              </div>
              {/* Execute Button */}
              {!proposalData[4] && (
                <div className="mt-4">
                  <Button
                    color="purple"
                    onClick={handleExecute}
                    disabled={executing || voting}
                  >
                    {executing ? <Spinner aria-label="Loading" size="sm" /> : "Execute Proposal"}
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      );
    }

State Variables:

  * **proposalId** : User input for the proposal ID.

  * **proposalData** : Stores fetched proposal details.

  * **loading, voting, executing** : Manage the loading states for different operations.

  * **error & success**: Handle feedback messages.




The `**handleFetch**` function ensures the user is connected and has entered a valid proposal ID. It calls `**fetchProposal**` to retrieve proposal details, and displays error messages if fetching fails.

The `**handleVote**` function has the parameters for indicating the Voter support (**true** for **Yes** , **false** for **No**). The function processes Vote, by calling `**voteOnProposal**` with the provided `**proposalId**` and `**support**`parameter`. `It returns success or error messages based on the outcome. It re-fetches the proposal to reflect updated vote counts.

The `**handleExecute**` function processes execution by calling `**executeProposal**` with the provided ~~**proposalId**~~. It returns success or error messages based on the outcome, and re-fetches the proposal to reflect execution status.

The return statement contains the UI Components:

  * Label & TextInput: For inputting the proposal ID.

  * Button: Triggers fetching, voting, and executing actions. Disabled and shows a spinner during processing.

  * Alert: Provides visual feedback for success and error messages.

  * Card: Displays the fetched proposal details in a structured format.

  * Voting & Execution Buttons: Allow users to interact with the proposal directly from the details view.




* * *

## 

Transaction States and User Feedback

Clear feedback during and after transactions enhances user experience and trust in your dApp. Consider using libraries like[ react-toastify](https://github.com/fkhadra/react-toastify) for non-intrusive notifications. Example with Toast Notifications:

Install react-toastify

Copy
    
    
    npm install react-toastify

Inside the `_app.js`

Copy
    
    
    import 'react-toastify/dist/ReactToastify.css';
    import { ToastContainer } from 'react-toastify';
    function MyApp({ Component, pageProps }) {
      return (
        <WalletProvider>
          <NavBar />
          <main className="pt-16">
            <Component {...pageProps} />
            <ToastContainer />
          </main>
        </WalletProvider>
      );
    }
    export default MyApp;

In your WalletContext or Pages

Copy
    
    
    import { toast } from 'react-toastify';
    // Replace alert with toast
    toast.success("Deposit successful! Transaction hash: " + tx.hash);
    toast.error("Deposit failed. Check console for details.");

The benefits of React Toastify are that it is **non-intrusive** and**** modal alerts don't block users. It is also customizable, which allows developers to style and position as needed.

* * *

## 

Test Write Operations

Thorough testing ensures the reliability and trustworthiness of your dApp. Here's how to effectively test your write operations:

#### 

Connect to a Test Network

Run your application using the command:

Copy
    
    
    npm run dev

Your application will be running on `**localhost:3000**` in your web browser.

#### 

Obtain STT from the [Faucet.](https://devnet.somnia.network/)

#### 

Perform Write Operations

Deposit Funds:

  * Navigate to the Home page.

  * Click the Deposit button.

  * Confirm the transaction in MetaMask.

  * Verify that the deposit is reflected in the contract's state.




Create a Proposal:

  * Go to the Create Proposal page.

  * Enter a proposal description and submit.

  * Confirm the transaction in MetaMask.

  * Check that the proposal count increments and the new proposal is retrievable.




Vote on a Proposal:

  * Access the Fetch-Proposal page.

  * Enter a valid proposal ID and fetch details.

  * Click Vote YES or Vote NO.

  * Confirm the transaction in MetaMask.

  * Verify that vote counts update accordingly.




Execute a Proposal:

  * After a proposal meets the execution deadline, execute it.

  * Confirm the transaction in MetaMask.

  * Ensure that the proposal's execution status is updated.

  * Monitor the browser console for any errors or logs that aid in debugging.




* * *

## 

Conclusion and Next Steps

In Part 3, you successfully implemented Write Operations in your DAO front end:

  * `**deposit**`: Allowed users to deposit ETH into the DAO.

  * `**createProposal**`: Enabled users to submit new proposals.

  * `**voteOnProposal**`: Provided functionality to cast votes on proposals.

  * `**executeProposal**`: Facilitated the execution of approved proposals.




* * *

Congratulations! Using Next.js and React Context, you’ve built a fully functional set of Write Operations for your DAO’s front end. This foundation empowers users to interact with your DAO seamlessly, fostering a decentralized, community-driven governance model. 

Continue refining and expanding your dApp to cater to your community’s evolving needs.

[PreviousDAO UI Tutorial p2](/developer/building-dapps/example-applications/dao-ui-tutorial-p2)[NextBuilding a Simple DEX on Somnia](/developer/building-dapps/example-applications/building-a-simple-dex-on-somnia)

Last updated 1 month ago
