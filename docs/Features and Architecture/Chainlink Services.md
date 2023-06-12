---
sidebar_position: 5
---

## Chainlink Keepers

In our smart contract library, we have leveraged Chainlink Keepers to automate the crucial processes of premium collection and claims payment for insurance policies. Chainlink Keepers provide reliable and decentralized automation, ensuring timely execution of tasks triggered by policy-specified time intervals.

### Usage in our smart contract library: [BaseInsurancePolicy.sol](https://github.com/Breaking-C0de/contracts/blob/fa5fb960e21ed9677692394f20786c28deea53c2/contracts/BaseInsurancePolicy.sol#L187-L242)

## Chainlink Any API

Chainlink Any API is a new feature that allows you to connect your smart contracts to any external API. We are excited to integrate this feature into our smart contract library as it enables us to provide more flexible and customizable insurance solutions.

### Usage in our smart contract library: [BaseInsurancePolicy.sol](https://github.com/Breaking-C0de/contracts/blob/fa5fb960e21ed9677692394f20786c28deea53c2/contracts/BaseInsurancePolicy.sol#L285-L317)

## Chainlink Price Feeds

Chainlink Price Feeds provide reliable and accurate price data for a wide range of assets. We have integrated Chainlink Price Feeds into our smart contract library to ensure that our insurance policies are using real time price data to perform operations.

### Usage in our smart contract library: [BaseInsurancePolicy.sol](https://github.com/Breaking-C0de/contracts/blob/fa5fb960e21ed9677692394f20786c28deea53c2/contracts/BaseInsurancePolicy.sol#L409-L415)


## Chainlink Node

Chainlink Node is a core component of the Chainlink Network. It is a blockchain middleware that connects smart contracts to off-chain data and external APIs. We have used Chainlink Node to deploy our own Chainlink Operator on the Mumbai testnet to test our APICall contract by calling an offchain API.

### Usage in our smart contract library: 

- ### [APICall.sol](https://github.com/Breaking-C0de/contracts/blob/13c1fade57ff16542f65f07faa639152ec4f98e3/contracts/v08/strategies/api/APICall.sol#L8-L94)

- ### [config.toml](https://github.com/Breaking-C0de/contracts/blob/13c1fade57ff16542f65f07faa639152ec4f98e3/.chainlink-mumbai/config.toml#L1-L17)

- ### [Operator.sol](https://github.com/Breaking-C0de/contracts/blob/13c1fade57ff16542f65f07faa639152ec4f98e3/contracts/v07/Operator.sol#L1-L3)  

