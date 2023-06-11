---
sidebar_position: 3
---

# Mock Contracts

> :warning: **Caution**: The following three mock contracts need to be imported and they need to be deployed before deploying the policy contracts.

- [MockV3Aggregator.sol](https://github.com/Breaking-C0de/contracts/blob/main/contracts/v08/mock/MockV3Aggregator.sol)
- [LinkToken.sol](https://github.com/Breaking-C0de/contracts/blob/main/contracts/v04/mocks/LinkToken.sol)
- [VRFCoordinatorV2Mock.sol](https://github.com/Breaking-C0de/contracts/blob/main/contracts/v08/mock/VRFCoordinatorV2Mock.sol)

## Script for deploying Mocks

```js
const { network } = require("hardhat")
const DECIMALS = 18;

const INITIAL_PRICE = "25000000000000000000"
const BASE_FEE = "250000000000000000"
const GAS_PRICE_LINK = 1e9

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        })

        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })

        await deploy("LinkToken", {
            from: deployer,
            log: true,
            args: [],
        })
    }
}
module.exports.tags = ["all", "mocks", "main"]
```

### Set up all files as specified in the [Installation](/docs/Deployment/Installation) section.

### Now, add the following code to your contract deploy script


```js
const { ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    const chainId = network.config.chainId
    let link = ""
    if (developmentChains.includes(network.name)) {
        // get the linktoken contract
        const linkToken = await ethers.getContract("LinkToken")
        link = linkToken.address
    } else {
        link = networkConfig[chainId]["_link"]
    }

    console.log("link", link)
    console.log("priceFeed", networkConfig[network.config.chainId]["priceFeed"])

    // Remaining script for deploying the policy contracts ____
}

```