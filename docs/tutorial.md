---
sidebar_position: 3
---

# Tutorial

In this tutorial, we will explain how users can create their own insurance contracts by inheriting from the `BaseInsurancePolicy` contract. We will use the [LifeInsurancePolicy.sol](https://github.com/Breaking-C0de/contracts/blob/main/contracts/LifeInsurancePolicy.sol)
contract as an example to demonstrate the step-by-step process.

Let us first decide upon the basic requirements for our life insurance policy:

- The policy should be able to accept premium payments from the policyholder.
- Define nominees who will receive the payout in case of the policyholder's death.
- Define percentage share of the payout for each nominee.

## Step 1: Create a New Solidity File

Start by creating a new Solidity file for your custom insurance contract. You can name it according to your preference, such as LifeInsurancePolicy.sol.

## Step 2: Import the BaseInsurancePolicy Contract

Import the `BaseInsurancePolicy` and  `SharedData.sol` contracts from the `@kizunasafe/kizuna-safe-contracts/contracts` package.

```js
import "@kizunasafe/kizuna-safe-contracts/contracts/BaseInsurancePolicy.sol";
import "@kizunasafe/kizuna-safe-contracts/contracts/SharedData.sol";
```

## Step 3: Define Your Custom Structures and Errors

Inside the LifeInsurancePolicy contract, define any custom structures or errors specific to the life insurance policy. For example, you can define a custom struct LifePolicyParams and some errors.

```js
contract LifeInsurancePolicy is BaseInsurancePolicy {
    // Errors are defined here
    error WithdrawingError();
    error PolicyNomineeNotFound();

    // Custom struct defined for the life insurance policy
    struct LifePolicyParams {
        // Define your custom struct fields here
    }

    // Other contract implementation goes here
}

```

## Step 4: Implement the Constructor

Implement the constructor function for the LifeInsurancePolicy contract. The constructor should take parameters for the base insurance policy, the custom life policy parameters, Chainlink token address, and Chainlink price feed address. Also, make sure to call the BaseInsurancePolicy constructor using the BaseInsurancePolicy(policy, \_link, priceFeed) syntax.

```js
constructor(
        SharedData.Policy memory policy,
        LifePolicyParams memory lifePolicyParams,
        address _link,
        address priceFeed
    ) BaseInsurancePolicy(policy, _link, priceFeed) {
        // Initialize the custom life policy parameters
    }
```

## Step 5: Implement Additional Functions

Implement any additional functions required for the LifeInsurancePolicy contract. You can define functions specific to the life insurance policy and override base functions as needed.

for example, in this case, we will be overriding the custom `withdraw` function to implement the logic for the life insurance policy.

```js
@dev withdraw function
    note here, the base withdraw function is overridden to implement custom logic in withdraw
    according to the policy
    */
    function withdraw() public payable override isNotTerminated {
        bool isNominee = false;
        //checking if the msg.sender is a nominee
        for (uint256 i = 0; i < s_lifePolicyParams.nominees.length; i++) {
            if (
                msg.sender ==
                s_lifePolicyParams.nominees[i].nomineeDetails.policyHolderWalletAddress
            ) {
                isNominee = true;
                break;
            }
        }
        if (!isNominee) revert PolicyNomineeNotFound();
        if (!s_policy.isClaimable) revert PolicyNotClaimable();

        uint256 withdrawableAmount = s_policy.totalCoverageByPolicy;
        //distributing funds to all the nominees
        for (uint256 i = 0; i < s_lifePolicyParams.nominees.length; i++) {
            s_lifePolicyParams.nominees[i].nomineeDetails.policyHolderWalletAddress.transfer(
                (withdrawableAmount * s_lifePolicyParams.nominees[i].nomineeShare) / 100
            );
        }
        setTermination(true);
    }
```

## Step 6: Test and Deploy

Test your LifeInsurancePolicy contract using appropriate testing frameworks and tools. Refer to the [testing and deployment](./Deployment/Self%20Hosting%20Kizuna%20Safe.md) sections for more details.
