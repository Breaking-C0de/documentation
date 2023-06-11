---
sidebar_position: 5
---

## Helper Files

### 1. Hardhat Config File

This is the recommended config file in case you want to host your own KizunaSafe contracts. You will have to set up the environment variables accordingly.

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
    player: {
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

### 2. .env File

The following is the environment variables that are required.

```shell
GOERLI_RPC_URL=
PRIVATE_KEY=
COINMARKETCAP_API_KEY=
AUTO_FUND=
REPORT_GAS=
ETHERSCAN_API_KEY=
POLYGON_RPC_URL=
POLYGONSCAN_API_KEY=
```

### 3. helper-hardhat-config.js File

The following is the helper-hardhat-config.js file that is required to be in the root directory of the project.

```javascript
const { ethers } = require("hardhat");

const networkConfig = {
  default: {
    name: "hardhat",
    chainId: 31337,
    blockConfirmations: 1,
  },
  31337: {
    name: "localhost",
    callbackGasLimit: "500000", // 500,000 gas
    priceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331", // for eth to usd conversion
    blockConfirmations: 1,
  },
  5: {
    name: "goerli",
    callbackGasLimit: "500000", // 500,000 gas
    _link: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    _oracle: "0xCC79157eb46F5624204f47AB42b3906cAA40eaB7",
    priceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    blockConfirmations: 5,
  },
  1: {
    name: "mainnet",
    _link: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    callbackGasLimit: "500000", // 500,000 gas
    priceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // for eth to usd conversion
    blockConfirmations: 5,
  },
  80001: {
    name: "mumbai",
    _link: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    callbackGasLimit: "500000", // 500,000 gas
    _oracle: "0x40193c8518BB267228Fc409a613bDbD8eC5a97b3",
    priceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A", // for eth to usd conversion
    blockConfirmations: 1,
  },
  11155111: {
    name: "sepolia",
    _link: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    callbackGasLimit: "500000", // 500,000 gas
    _oracle: "0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD",
    priceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // for eth to usd conversion
    blockConfirmations: 1,
  },
  137: {
    name: "polygon",
    _link: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
    callbackGasLimit: "500000", // 500,000 gas
    priceFeed: "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676",
    blockConfirmations: 5,
  },
};

const developmentChains = ["hardhat", "localhost", "polygon"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
const DECIMALS = "18";
module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  VERIFICATION_BLOCK_CONFIRMATIONS,
};
```

### 4. verify.js File

This file is used to verify the contract on etherscan.

```javascript
const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("verified")) {
      console.log("Verified on etherscan");
    } else {
      console.log(e);
    }
  }
};

module.exports = {
  verify,
};
```

### 5. move-blocks.js File

This file is used to move blocks on the hardhat local network. This is useful when you want to test the contract on a specific block number.

```javascript
const { network } = require("hardhat");
async function moveBlocks(amount) {
  console.log("Moving blocks...");
  for (let index = 0; index < amount; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
  console.log(`Moved ${amount} blocks`);
}

module.exports = { moveBlocks };
```

### 6. move-time.js File

This file is used to move time on the hardhat local network. This is useful when you want to test the contract on a specific time.

```javascript
const { network } = require("hardhat");

async function moveTime(amount) {
  console.log("Moving blocks...");
  await network.provider.send("evm_increaseTime", [amount]);

  console.log(`Moved forward in time ${amount} seconds`);
}

module.exports = { moveTime };
```
