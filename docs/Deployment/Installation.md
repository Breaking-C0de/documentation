---
sidebar_position: 6
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

### 4. Set Up Hardhat Config File

Set up the hardhat config file by adding the following code to the hardhat.config.js file:

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
    polygon: {
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
