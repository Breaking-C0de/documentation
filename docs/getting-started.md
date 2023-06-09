---
sidebar_position: 2
---

# Getting Started

# Purpose

`BaseInsurancePolicy` is a smart contract that is part of the KizunaSafe library that provides the foundation for creating insurance policies on the Ethereum blockchain. It utilizes Chainlink automation, price feeds, and keepers to automate policy management and ensure accurate pricing information and claim verification. This guide will walk you through the basic steps to get started with BaseInsurancePolicy and understand its key functionalities.

## Prerequisites

Before you begin, make sure you have the following prerequisites in place:

- Basic understanding of Solidity and smart contracts.
- Familiarity with Chainlink and its ecosystem.
- Access to an Ethereum development environment (e.g., Remix, Hardhat, Truffle, etc.).
- Integration with a Chainlink node to access price feeds and perform automation tasks.

## Installation

# Set up
 Install the [kizunasafe](https://www.npmjs.com/package/@kizunasafe/kizuna-safe-contracts) npm package that includes all contracts:

`npm i @kizunasafe/kizuna-safe-contracts`
To use BaseInsurancePolicy, you need to import the required dependencies. Ensure that you have the following contracts imported:

```js
import "@kizunasafe/kizuna-safe-contracts/v08/BaseInsurancePolicy.sol";
import "@kizunasafe/kizuna-safe-contracts/v08/SharedData.sol";

```

## Creating a Policy

1. Inherit from `BaseInsurancePolicy`: In your contract, inherit from `BaseInsurancePolicy` to utilize its functionalities. Make sure to implement any required overrides or additional logic specific to your insurance policy.

```js
contract MyInsurancePolicy is BaseInsurancePolicy {
    // Implement your custom logic here
}
```

2. Initialize the contract: When deploying your insurance policy contract, pass the necessary parameters to initialize the `BaseInsurancePolicy` constructor. The constructor requires a `SharedData.Policy` object, the address of the Chainlink token (`LINK`), and the address of the price feed contract.

```js
constructor(
    SharedData.Policy memory policy,
    address _link,
    address priceFeed
) BaseInsurancePolicy(policy, _link, priceFeed) {
    // Additional initialization logic, if required
}
```

3. Implement custom logic: Override any necessary functions from BaseInsurancePolicy to tailor them to your specific insurance policy requirements. You can also add additional functions and modifiers as needed.

   ```js
   contract MyInsurancePolicy is BaseInsurancePolicy {
   constructor(
       SharedData.Policy memory policy,
       address _link,
       address priceFeed
   ) BaseInsurancePolicy(policy, _link, priceFeed) {}

   // Custom logic and overrides
   }

   ```

4. Customize policy parameters: Use the setter functions provided by `BaseInsurancePolicy` to customize various policy parameters such as termination, claimability, policy activation, and more.

```js
function setTermination(bool isTerminate) public onlyAdmin {
    // Logic to set policy termination
}

function setClaimable(bool isClaimable) public onlyAdmin {
    // Logic to set policy claimability
}

function setPolicyActive(bool isPolicyActive) public onlyAdmin {
    // Logic to set policy activation
}

// Additional setter functions
```
    