---
sidebar_position: 6
---

# Architecture Overview

`BaseInsurancePolicy.sol` is a smart contract that serves as a base for creating insurance policies. It provides a set of functions and data structures that can be inherited and customized by other insurance contracts. The contract leverages Chainlink automation, price feed, and keepers for various functionalities.

## Arcitecture Diagram

![Architecture Diagram](/img/architecture.png)

## Contract Overview

The `BaseInsurancePolicy` contract is an abstract contract and cannot be deployed on its own. It is meant to be inherited by other contracts that implement specific insurance policies. The contract provides essential functions and modifiers to manage policy state, claim processing, payments, termination, and other policy-related operations.

The contract is based on the Solidity version 0.8.0.

## Contract Dependencies

The `BaseInsurancePolicy` contract has the following dependencies:

- `SharedData.sol`: A Solidity file that contains shared data structures and types used by multiple insurance contracts.
- `@chainlink/contracts/src/v0.8/AutomationCompatible.sol`: A Chainlink contract that provides automation compatibility.
- `@chainlink/contracts/src/v0.8/ChainlinkClient.sol`: A Chainlink contract that acts as the client for making Chainlink API calls.
- `@chainlink/contracts/src/v0.8/ConfirmedOwner.sol`: A Chainlink contract that implements ownership functionality.
- `@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol`: A Chainlink contract interface for interacting with price feed aggregators.

## Contract Structure

The `BaseInsurancePolicy` contract follows the structure outlined below:

## Contract Declaration and Imports:

The contract starts with SPDX license identifier, Solidity version pragma, and import statements for the required dependencies.

## Contract Declaration and Inheritance:

The contract is declared as abstract and inherits the following contracts:

- `AutomationCompatible`: Provides automation compatibility.
- `ChainlinkClient`: Acts as the Chainlink client for making API calls.
- `ConfirmedOwner`: Implements ownership functionality.
- `Contract Variables`: The contract declares several state variables to store policy-related information, including policy details, timestamps, administration addresses, and more. It also defines constant variables such as DECIMALS for decimal calculations.

## Contract Modifiers:

The contract defines two modifiers:

- `onlyAdmin`: Ensures that only authorized administrators can access specific functions.
- `isNotTerminated`: Checks if the policy is not terminated before allowing access to certain functions.

## Constructor:

The contract constructor initializes the contract state and sets up Chainlink-related configurations, including the policy details, administrators, price feed, and the Chainlink token.

## Policy Management Functions:

The contract includes functions for managing the policy, such as making a claim, reviving a terminated policy, terminating a policy, and withdrawing funds. These functions perform various checks and validations before executing the requested actions.

## Chainlink Functions:

The contract includes functions related to Chainlink automation and API calls. It defines the `checkUpkeep` and `performUpkeep` functions required by the Chainlink automation-compatible interface. It also includes functions for `requesting` and `fulfilling` Chainlink API calls.

## Fallback Function:

The contract includes a fallback function (`receive() external payable`) that handles the premium payments made by policy holders. It verifies the payment amount, updates the last payment timestamp, and manages the policy's active and terminated states.

## Setter and Getter Functions:

The contract provides setter and getter functions to access and modify policy-related data, including termination status, claimability, activity status, coverage details, policy holder information, revival rules, and more.
