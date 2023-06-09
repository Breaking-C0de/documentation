---
sidebar_position: 3
---

# Tutorial

In this tutorial, we will explain how users can create their own insurance contracts by inheriting from the `BaseInsurancePolicy` contract. We will use the [LifeInsurancePolicy.sol](https://github.com/Breaking-C0de/contracts/blob/dev/contracts/LifeInsurancePolicy.sol)
contract as an example to demonstrate the step-by-step process.

## Step 1: Create a New Solidity File

Start by creating a new Solidity file for your custom insurance contract. You can name it according to your preference, such as LifeInsurancePolicy.sol.

## Step 2: Import the BaseInsurancePolicy Contract

Import the `BaseInsurancePolicy` contract from the `@breaking-c0de/contracts` package.

```solidity
import "@kizunasafe/contracts/BaseInsurancePolicy.sol";
```

## Step 3: Define Your Custom Insurance Contract

Next, define your custom insurance contract by inheriting from BaseInsurancePolicy. For example, let's create the LifeInsurancePolicy contract:

```solidity
contract LifeInsurancePolicy is BaseInsurancePolicy {
    // Customizations and additional functionality specific to the life insurance policy
    // ...
}
```
