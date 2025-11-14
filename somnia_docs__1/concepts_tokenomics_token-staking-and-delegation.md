# Token Staking and Delegation | Concepts | Somnia Docs

Copy

  1. [Tokenomics](/concepts/tokenomics)



# Token Staking and Delegation

There are four main entities that play a part in the tokenomics of the Network: Application Owners, Validators, Content Creators and Token Holders.

Validators are required to time-lock a fixed amount of Tokens at a designated blockchain address in order to secure their place on the Somnia Network/provide validator nodes as described in the Staking section below. 

Token Holders can choose to participate in staking, in order to receive rewards from the Fees and/or from the Treasury. These rewards are only available to “staked” Tokens and not to Tokens generally held by Token Holders. 

This section explores the staking and delegation options under discussion with the Network. 

## 

Staking: Validators

  * In the Somnia Blockchain, validators must stake Tokens to provide nodes for computation to the network.

  * Validators must provide a certain level of hardware in order to participate in the network.

  * The amount of Tokens required to provide a validation node is 5,000,000 SOMI Tokens.

  * They will be rewarded from gas fees and treasury-based incentives.




When Validators cover their staking requirement fully, they earn 100% of the rewards that their service generates. However, Validators can also choose to only partially cover their locking requirements. In this scenario, Validators can delegate the provision of the remaining Token requirement to third-party Token Holders. These third-party Token Holders will be given a percentage of the validator's rewards. This is set by the validator (the delegation rate). 

Validators can choose to delegate part of the Tokens they are required to fulfill their locking requirements into either the General Validator Pool, or into a Validator-Specific Pool. 

### 

**Delegated Staking Specific Pool: Validators**

  * Validators can choose to enable the Tokens required to provide a specific Validator’s node to other Token Holders.

  * Token holders can choose to provide their Tokens to Validators in exchange for a percentage share of the validator's rewards.

    * The validator sets this percentage called the delegation rate.

  * When providing their Tokens to Validators, Token Holders must wait 28 days before unstaking, essentially locking their Tokens.

  * They can choose to emergency unstake at the cost of 50% of their staked Tokens. The forfeited Tokens will then flow back to the Treasury.




### 

**Delegated Staking General Pool: Validators**

  * Token Holders can choose to delegate to the general Validator pool.

  * This will allocate their Tokens to all validators currently offering delegated staking.

  * The Token Holders will receive a percentage of rewards across all Validators.

  * This spreads the risk of delegation at the cost of potentially less yield.

  * When staking in the general pool there is no locking period.

  * The general pool will cover understaked validators first. 




**What if a validator can’t meet the minimum staking requirements?**

In the event that a validator fails to meet the minimum staking requirements, a cooldown period will be provided to the validator to fulfil the staking obligations, typically lasting for one month. 

**What if a validator has more tokens staked than needed?**

Through the general pool and the delegation mechanism, it is possible for a validator to overstake. This means that more Tokens are staked than are required to operate the validator being supplied to the network. In this case, it means there is no time lock to unlock such additional Tokens for that validator. Any user can instantly unlock until the required level of Tokens is reached. As a result of this, the reward split will be further diluted but at the benefit of increased liquidity.

## 

**Staking rewards**

  * 50% of all gas fees are distributed to validators as rewards

  * Validators can offer to share these rewards with delegated stakers.

  * They do this by setting a delegation rate percentage

    * Example

      * Validator has a delegation rate of 80%

      * The validator gets 100 SOMI in rewards for the Epoch

      * You are delegating 1M out of the 5M tokens delegated to the validator. This means you have a staking ratio of 0.2 (20%)

      * The formula to calulate your rewards for the epoch is:




epochrewards∗delegationrate∗stakingratioepoch rewards * delegation rate * staking ratioepochrewards∗delegationrate∗stakingratio

so in this case:

100(epochrewards)∗0.8(delegationrate)∗0.2(stakingratio)=16tokens100 (epoch rewards) * 0.8 (delegation rate) * 0.2 (staking ratio) = 16 tokens100(epochrewards)∗0.8(delegationrate)∗0.2(stakingratio)=16tokens

[PreviousOverview](/concepts/tokenomics/overview)[NextGas Fees](/concepts/tokenomics/gas-fees)

Last updated 2 months ago
