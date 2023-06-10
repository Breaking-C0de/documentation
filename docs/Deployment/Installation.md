---
sidebar_position: 2
---

#### Repository: [`KizunaSafe Contracts`](https://github.com/Breaking-C0de/contracts.git)

## Prerequisites

Before we dive into the deployment process, make sure you have the following prerequisites in place:

- **Node.js**: Install Node.js version 16.15.1. You can download it from the official website: [Node.js](https://nodejs.org/)
- **npm**: Ensure that npm (Node Package Manager) is installed. You can check the installation by running `npm --version` in your terminal.

## Set Up

To get started with the deployment process, follow the steps below:

### 1. Clone the Repository

Clone the GitHub repository by running the following command in your terminal:

```shell
$ git clone https://github.com/Breaking-C0de/contracts.git
```

### 2. Install Dependencies

Install the dependencies by running any of the following commands in your terminal:

```shell
$ npm install
```

or

```shell
$ yarn
```

### 3. Create .env File

Create .env file in the root directory of the project and add the following variables:

```shell
GOERLI_RPC_URL= <Your Gorli RPC URL>
PRIVATE_KEY= <Deployer Wallet Public Key>
COINMARKETCAP_API_KEY= <Your Coinmarket Api Key (Optional)>
AUTO_FUND= <true/false>
REPORT_GAS= <true/false>
ETHERSCAN_API_KEY= <Etherscan Api Key>
POLYGON_RPC_URL= <Your Polygon Testnet RPC URL>
POLYGONSCAN_API_KEY= <Your Polygonscan Api Key>
MAINNET_RPC_URL= <Your Mainnet RPC URL>
ALCHEMY_MAINNET_RPC_URL= <Your Alchemy Mainnet RPC URL>
MNEMONIC= <Your Mnemonic Phrase>
```

### 4. Set Up Hardhat and Helper Hardat Config Files

- Set up the hardhat config file by adding the following code to the hardhat.config.js file:

```javascript
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const MAINNET_RPC_URL =
  process.env.MAINNET_RPC_URL ||
  process.env.ALCHEMY_MAINNET_RPC_URL ||
  "https://eth-mainnet.alchemyapi.io/v2/your-api-key";
const GOERLI_RPC_URL =
  process.env.GOERLI_RPC_URL ||
  "https://eth-goerli.alchemyapi.io/v2/your-api-key";
const POLYGON_RPC_URL =
  process.env.POLYGON_RPC_URL || "https://rpc-mainnet.maticvigil.com/";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MNEMONIC = process.env.MNEMONIC || "";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;
const REPORT_GAS = process.env.REPORT_GAS;

module.exports = {
  defaultNetwork: "hardhat",
  allowUnlimitedContractSize: true,
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 5,
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 1,
    },
    mumbai: {
      url: POLYGON_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 80001,
    },
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
    user: {
      default: 1,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 5,
          },
        },
      },
      {
        version: "0.4.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 5,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 300000,
  },
};
```

- Set up helper-hardhat config file by adding the following code to the helper-hardhat.config.js file:

```js
 const { ethers } = require("hardhat")

const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337: {
        name: "localhost",
        callbackGasLimit: "500000", // 500,000 gas
        priceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331", // for eth to usd conversion
        
    },
    5: {
        name: "goerli",
        callbackGasLimit: "500000", // 500,000 gas
        _link: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        _oracle: "0xCC79157eb46F5624204f47AB42b3906cAA40eaB7",
        priceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    1: {
        name: "mainnet",
        _link: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        callbackGasLimit: "500000", // 500,000 gas
        priceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // for eth to usd conversion
    },
    80001: {
        name: "mumbai",
        _link: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        callbackGasLimit: "500000", // 500,000 gas
        _oracle: "0x40193c8518BB267228Fc409a613bDbD8eC5a97b3",
        priceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A", // for eth to usd conversion
    },
    11155111: {
        name: "sepolia",
        _link: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        callbackGasLimit: "500000", // 500,000 gas
        _oracle: "0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD",
        priceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // for eth to usd conversion
    },
    137: {
        name: "polygon",
        _link: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
        callbackGasLimit: "500000", // 500,000 gas
        priceFeed: "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676",
    },
}

const developmentChains = ["hardhat", "localhost", "polygon"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const DECIMALS = "18"
module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    VERIFICATION_BLOCK_CONFIRMATIONS,
}
```

### 5. Compile & Deploy

Compile the contracts by running any of the following commands in your terminal:

```shell
$ npx hardhat compile
```

or

```shell
$ yarn compile
```

Deploy the contracts by running any of the following commands in your terminal:

```shell
$ npx hardhat deploy --network <network-name>
```

or

```shell
$ yarn hardhat deploy --network <network-name>
```

##### network name can be any of the following:

- hardhat
- goerli
- mainnet
- polygon
- sepolia
- localhost
