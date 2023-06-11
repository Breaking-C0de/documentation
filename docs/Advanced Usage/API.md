---
sidebar_position: 2
---

# API Calls

## Using API Calls to verify claims for a Policy

- Create a new contract `APIcall.sol` and import the following:

```js
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "@kizunasafe/kizuna-safe-contracts/contracts/v08/strategies/api/APICall.sol";
```

- Now deploy the newly created contract. A sample deploy script for the contract is specified below:

```js
const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const linkToken = await ethers.getContract("LinkToken");
  const baseInsurancePolicy = await ethers.getContract("LifeInsurancePolicy");
  const { deploy, log } = deployments;
  let link = linkToken.address;
  const { deployer } = await getNamedAccounts();
  const testArgs = [link, baseInsurancePolicy.address];
  log("-----------------------Deploying-----------------------------");
  const APICallcontract = await deploy("APICall", {
    from: deployer,
    args: testArgs,
    log: true,
    waitConfirmations:
      networkConfig[network.config.chainId].blockConfirmations || 1,
  });
  log("-------------------Deployed at-----------------");
  log(APICallcontract.address);
  if (!developmentChains.includes(network.name)) {
    log("-------------------Verifying-----------------");
    await verify(APICallcontract.address, testArgs);
  }
};
module.exports.tags = ["all", "APICall", "main"];
```

- The deployed contract can then be used to _verify a claim by making API calls_. In order to do so, write a script that will invoke the `requestClaimValidationData()` function defined in the contract.
  The oracle address , jobId and url needs to specified within the function call. Refer [this](../Deployment/Chainlink%20API%20call) to know more about the oracle address and jobId.

- Thus, in this way a claim can be verified using external API calls. For instance, to validate a claim for a flight delay insurance policy, we can follow the above procedure and make calls to an external flight Delay API to get the flight status and validate the claim.

- Once the claim has been validated, the `isClaimable` property of the policy will be set to True depending on the result of the API call.
