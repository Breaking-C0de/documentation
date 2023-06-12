---
sidebar_position: 4
---

# DAO and Governance

## Using On-Chain Governance to Verify Claims

### Introduction

In this section, we will discuss how to use on-chain governance to verify claims. We will use the example of a life insurance policy to illustrate the process. The process is similar for other types of insurance policies.

### Life Insurance Policy

The following code snippet is an example of a life insurance policy that we are about to deploy. We will use this policy to illustrate the process of using on-chain governance to verify claims.

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@kizunasafe/kizuna-safe-contracts/contracts/v08/BaseInsurancePolicy.sol";
import "@kizunasafe/kizuna-safe-contracts/contracts/v08/SharedData.sol";

contract LifeInsurancePolicy is BaseInsurancePolicy {
    // Errors are defined here
    error WithdrawingError();
    error PolicyNomineeNotFound();

    // Custom struct defined for the lifeInsurance Policy
    SharedData.LifePolicyParams private s_lifePolicyParams;
    constructor(
        SharedData.Policy memory policy,
        SharedData.LifePolicyParams memory lifePolicyParams,
        address _link,
        address priceFeed
    ) BaseInsurancePolicy(policy, _link, priceFeed) {
        // Loop over the nominees array and push it to storage
        for (uint256 i = 0; i < lifePolicyParams.nominees.length; i++) {
            s_lifePolicyParams.nominees.push(lifePolicyParams.nominees[i]);
        }
    }

    function getNominees() public view returns (SharedData.Nominee[] memory nominees) {
        return s_lifePolicyParams.nominees;
    }

    function getNominee(uint128 index) public view returns (SharedData.Nominee memory nominee) {
        return s_lifePolicyParams.nominees[index];
    }

    function getLifePolicyParams()
        public
        view
        returns (SharedData.LifePolicyParams memory lifePolicyParams)
    {
        return s_lifePolicyParams;
    }
    function withdraw() public payable override isNotTerminated {
        bool isNominee = false;
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

        uint256 withdrawableAmount;
        if (address(this).balance < s_policy.totalCoverageByPolicy)
            withdrawableAmount = address(this).balance;
        else withdrawableAmount = s_policy.totalCoverageByPolicy;
        for (uint256 i = 0; i < s_lifePolicyParams.nominees.length; i++) {
            s_lifePolicyParams.nominees[i].nomineeDetails.policyHolderWalletAddress.transfer(
                (withdrawableAmount * s_lifePolicyParams.nominees[i].nomineeShare) / 100
            );
        }
        s_policy.isTerminated = true;
    }
}

```

### Creating Governance Contracts

#### Creating a GovernanceToken Contract for the DAO

You will have to create a governance token contract for the policy. You can import the `@kizunasafe/kizuna-safe-contracts/contracts/v08/strategies/governance/GovernanceToken.sol` contract. The following code snippet is an example of a governance token contract for the policy.

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@kizunasafe/kizuna-safe-contracts/contracts/v08/strategies/governance/GovernanceToken.sol";
```

#### Creating a TimeLock Contract for the DAO

You will have to create a time lock contract for the policy. You can import the `@kizunasafe/kizuna-safe-contracts/contracts/v08/strategies/governance/TimeLock.sol` contract. The following code snippet is an example of a time lock contract for the policy.

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@kizunasafe/kizuna-safe-contracts/contracts/v08/strategies/governance/TimeLock.sol";
```

#### Creating a GovernorContract for the DAO

You will have to create a governor contract for the policy. You can import the `@kizunasafe/kizuna-safe-contracts/contracts/v08/strategies/governance/GovernorContract.sol` contract. The following code snippet is an example of a governor contract for the policy.

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@kizunasafe/kizuna-safe-contracts/contracts/v08/strategies/governance/GovernorContract.sol";
```

### Deploying The Contracts

Before deploying the Contracts, it is recommended to set up the utility files that will be used in this tutorial. You can find them in - **[Utilities Section](../Deployment/Utilities)**

#### Deploy File For Governance Token Contract

The following code snippet is an example of a deploy file for governance token contract.

```js
const { ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function (hre) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("----------------------------------------------------");
  log("Deploying GovernanceToken and waiting for confirmations...");
  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: ["GovernanceToken", "GTK", "1000000000000000000000000000"],
    log: true,
    waitConfirmations:
      networkConfig[network.config.chainId].blockConfirmations || 1,
  });
  log(`GovernanceToken at ${governanceToken.address}`);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(governanceToken.address, []);
  }
  log(`Delegating to ${deployer}`);
  await delegate(governanceToken.address, deployer);
  log("Delegated!");
};

/**
 * @dev delegate function delegates the tokens to the account address given as parameter
 * @param {*the governanceTokenAddress} governanceTokenAddress
 * @param {*the account address to which the tokens are delegated to so that the account can
 * have voting power, usually deployer account should be given} delegatedAccount
 */
const delegate = async (governanceTokenAddress, delegatedAccount) => {
  const governanceToken = await ethers.getContractAt(
    "GovernanceToken",
    governanceTokenAddress
  );
  const transactionResponse = await governanceToken.delegate(delegatedAccount);
  await transactionResponse.wait(1);
  console.log(
    `Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`
  );
};

module.exports.tags = ["all", "governor", "main"];
```

#### Deploy File For TimeLock Contract

The following code snippet is an example of a deploy file for time lock contract.

```js
const { verify } = require("../utils/verify");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { ethers } = require("hardhat");
const MIN_DELAY = 600; // 10 minutes
module.exports = async function (hre) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const signers = await ethers.getSigners();
  log("----------------------------------------------------");
  log("Deploying TimeLock and waiting for confirmations...");
  const timeLock = await deploy("TimeLock", {
    from: deployer,
    args: [
      MIN_DELAY,
      [
        signers[1].address,
        signers[2].address,
        signers[3].address,
        signers[4].address,
      ],
      [],
      deployer,
    ],
    log: true,
    waitConfirmations:
      networkConfig[network.config.chainId].blockConfirmations || 1,
  });
  log(`TimeLock at ${timeLock.address}`);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(timeLock.address, []);
  }
};

module.exports.tags = ["all", "timelock", "main"];
```

#### Deploy File For Governor Contract

The following code snippet is an example of a deploy file for governor contract.

```js
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

// Governor Values
const QUORUM_PERCENTAGE = 1; // Need 1% of voters to pass
const VOTING_DELAY = 1200; // 10 minutes - after a vote passes, you have 1 hour before you can exit
const VOTING_PERIOD = 3600; // 1 hour - how long a vote is open for
const PROPOSAL_THRESHOLD = 0; // 0 votes needed to create a proposal
module.exports = async function (hre) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const governanceToken = await get("GovernanceToken");
  const timeLock = await get("TimeLock");
  const testArgs = [
    governanceToken.address,
    timeLock.address,
    QUORUM_PERCENTAGE,
    VOTING_PERIOD,
    VOTING_DELAY,
    PROPOSAL_THRESHOLD,
  ];

  log("----------------------------------------------------");
  log("Deploying GovernorContract and waiting for confirmations...");
  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: testArgs,
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations:
      networkConfig[network.config.chainId].blockConfirmations || 1,
  });
  log(`GovernorContract at ${governorContract.address}`);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(governorContract.address, args);
  }
};

module.exports.tags = ["all", "governor", "main"];
```

#### Deploy File For LifeInsurancePolicy Contract

**NOTE: The GovernorContract address and the TimeLock Contract address must be passed as collaborators when deploying a policy contract.**

The following code snippet is an example of a deploy file for life insurance policy contract.

```js
const { ethers, network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = network.config.chainId;
  let link = "";
  if (developmentChains.includes(network.name)) {
    // get the linktoken contract
    const linkToken = await ethers.getContract("LinkToken");
    link = linkToken.address;
  } else {
    link = networkConfig[chainId]["_link"];
  }

  console.log("link", link);
  console.log("priceFeed", networkConfig[network.config.chainId]["priceFeed"]);
  const testArgs = [
    {
      policyHolder: {
        name: "Aamroh",
        dateOfBirth: "12/12/1912",
        gender: "Male",
        homeAddress: "dragon land",
        phoneNumber: "123456789",
        email: "dragon@drago.com",
        occupation: "dragonkiller",
        pronouns: "mighty/almighty",
        policyHolderWalletAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      },
      policyTenure: 120000,
      timeInterval: 600,
      gracePeriod: 300,
      timeBeforeCommencement: 120,
      premiumToBePaid: ethers.utils.parseEther("1"),
      totalCoverageByPolicy: ethers.utils.parseEther("1000"),
      hasClaimed: false,
      isPolicyActive: true,
      isClaimable: false,
      isTerminated: false,
      hasFundedForCurrentInterval: false,
      revivalRule: {
        revivalPeriod: 400,
        revivalAmount: ethers.utils.parseEther("5"),
      },
      policyDetails: "This is a Dragon Contract",
      policyType: 0, // Life
      policyManagerAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      admins: [
        "0xe2C47351C3175BcA8aE755A0E33826B7D300A137",
        "0x3F03b608472F698B0FfC16E3723C12274f560320",
        "0xe6B3e361c5C129B27210EE4Ccc71f7E8e3F4b63B",
        "0xF2A1790753821528E7958Bdcb196Ab12949F93A7",
      ],
      collaborators: [],
    },
    {
      nominees: [
        {
          nomineeDetails: {
            name: "Kuntal",
            dateOfBirth: "13/12/1912",
            gender: "Male",
            homeAddress: "dragon raja land",
            phoneNumber: "003456789",
            email: "squirrelsaver@gmail.com",
            occupation: "squirrelprotector",
            pronouns: "almightyProtector",
            policyHolderWalletAddress:
              "0xe6B3e361c5C129B27210EE4Ccc71f7E8e3F4b63B",
          },
          nomineeShare: 25, // in percentage
        },
        {
          nomineeDetails: {
            name: "Deepak",
            dateOfBirth: "15/12/1912",
            gender: "Male",
            homeAddress: "dragon raja land",
            phoneNumber: "003456789",
            email: "whitedragon@gmail.com",
            occupation: "whitedragonkiller",
            pronouns: "mighty/almighty",
            policyHolderWalletAddress:
              "0xF2A1790753821528E7958Bdcb196Ab12949F93A7",
          },
          nomineeShare: 75, // in percentage
        },
      ],
    },
    link,
    networkConfig[network.config.chainId]["priceFeed"],
  ];
  log("-----------------------Deploying-----------------------------");
  const lifeInsurancePolicy = await deploy("LifeInsurancePolicy", {
    from: deployer,
    args: testArgs,
    log: true,
    waitConfirmations:
      networkConfig[network.config.chainId].blockConfirmations || 1,
  });
  log("-------------------Deployed at-----------------");
  log(lifeInsurancePolicy.address);
  // transfer ownership of LifeInsurancePolicy to Timelock
  const TimeLockContract = await ethers.getContract("TimeLock");
  const transferOwnershipTx = await lifeInsurancePolicy.transferOwnership(
    TimeLockContract.address
  );
  if (!developmentChains.includes(network.name)) {
    log("-------------------Verifying-----------------");
    await verify(lifeInsurancePolicy.address, testArgs);
  }
};

module.exports.tags = ["LifeInsurancePolicy", "all"];
```

Now you can deploy the contracts using the following command:

```bash
npx hardhat deploy --network <network-name>
```

**or**

```
yarn hardhat deploy --network <network-name>
```

### Writing Test To Check The Claim Validation Functionality Of The Contract

The following code snippet is an example of a test file for life insurance policy contract with on chain governance and timelock to check the claim validation functionality of the contract.

```js
const { assert, expect } = require("chai");
const { network, deployments, ethers, getNamedAccounts } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../../helper-hardhat-config");
const { moveBlocks } = require("../../utils/move-block");
const { moveTime } = require("../../utils/move-time");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("DAO Strategy Test", function () {
      let LifeInsurancePolicyContract,
        deployer,
        signers,
        GovernorContract,
        GovernanceTokenContract,
        TimeLockContract;
      const MIN_DELAY = 600; // 10 minutes
      const VOTING_DELAY = 1200; // 20 minutes - after a vote passes, you have 1 hour before you can exit
      const VOTING_PERIOD = 3600; // 1 hour - how long a vote is open for
      const voteWay = 1;
      beforeEach(async () => {
        await deployments.fixture(["main"]);
        GovernanceTokenContract = await ethers.getContract("GovernanceToken");
        TimeLockContract = await ethers.getContract("TimeLock");
        GovernorContract = await ethers.getContract("GovernorContract");
        // get signers from ethers
        signers = await ethers.getSigners();
        // get link token contract address
        const linkContract = await ethers.getContract("LinkToken");
        const link = linkContract.address;
        const testArgs = [
          {
            policyHolder: {
              name: "Aamroh",
              dateOfBirth: "12/12/1912",
              gender: "Male",
              homeAddress: "dragon land",
              phoneNumber: "123456789",
              email: "dragon@drago.com",
              occupation: "dragonkiller",
              pronouns: "mighty/almighty",
              policyHolderWalletAddress: signers[1].address,
            },
            policyTenure: 120000,
            timeInterval: 600,
            gracePeriod: 300,
            timeBeforeCommencement: 120,
            premiumToBePaid: ethers.utils.parseEther("1"),
            totalCoverageByPolicy: ethers.utils.parseEther("1000"),
            hasClaimed: false,
            isPolicyActive: true,
            isClaimable: false,
            isTerminated: false,
            hasFundedForCurrentInterval: false,
            revivalRule: {
              revivalPeriod: 400,
              revivalAmount: ethers.utils.parseEther("5"),
            },
            policyDetails: "This is a Dragon Contract",
            policyType: 0, // Life
            policyManagerAddress: signers[0].address,
            admins: [
              signers[1].address,
              signers[2].address,
              signers[3].address,
            ],
            collaborators: [TimeLockContract.address, GovernorContract.address],
          },
          {
            nominees: [
              {
                nomineeDetails: {
                  name: "Kuntal",
                  dateOfBirth: "13/12/1912",
                  gender: "Male",
                  homeAddress: "dragon raja land",
                  phoneNumber: "003456789",
                  email: "squirrelsaver@gmail.com",
                  occupation: "squirrelprotector",
                  pronouns: "almightyProtector",
                  policyHolderWalletAddress: signers[2].address,
                },
                nomineeShare: 25, // in percentage
              },
              {
                nomineeDetails: {
                  name: "Deepak",
                  dateOfBirth: "15/12/1912",
                  gender: "Male",
                  homeAddress: "dragon raja land",
                  phoneNumber: "003456789",
                  email: "whitedragon@gmail.com",
                  occupation: "whitedragonkiller",
                  pronouns: "mighty/almighty",
                  policyHolderWalletAddress: signers[3].address,
                },
                nomineeShare: 75, // in percentage
              },
            ],
          },
          link,
          networkConfig[network.config.chainId]["priceFeed"],
        ];
        // deploy the LifeinsurancePolicy contract
        await deployments.deploy("LifeInsurancePolicy", {
          from: signers[0].address,
          args: testArgs,
          log: true,
          waitConfirmations: 1,
          gasLimit: 10000000,
        });
        LifeInsurancePolicyContract = await ethers.getContract(
          "LifeInsurancePolicy",
          signers[0].address
        );
        // transfer ownership of LifeInsurancePolicy to Timelock
        const transferOwnershipTx =
          await LifeInsurancePolicyContract.transferOwnership(
            TimeLockContract.address
          );
        await transferOwnershipTx.wait(1);
      });

      it("Should set isClaimable to true after proposal is accepted", async () => {
        // fund contract using fallback function in LifeInsurancePolicy contract with signers[0]
        const fundTx = await LifeInsurancePolicyContract.fundContract({
          value: ethers.utils.parseEther("1000"),
        });
        await fundTx.wait(1);
        /**---------- Making a proposal to claim the contract ---------------**/
        // first call makeClaim function of LifeInsurancePolicy contract to make the claim
        // it will set hasClaimed attribute of contract to true
        const makeClaimTx = await LifeInsurancePolicyContract.makeClaim();
        await makeClaimTx.wait(1);

        // Now we will make a proposal to verify our claim
        // first encode the function call data that should be called in case proposal is accepted
        const encodedFunctionCall =
          await LifeInsurancePolicyContract.interface.encodeFunctionData(
            "setClaimable",
            [true]
          );
        // transfer ownership of LifeInsurancePolicy to Timelock
        const transferOwnershipTx =
          await LifeInsurancePolicyContract.transferOwnership(
            TimeLockContract.address
          );
        await transferOwnershipTx.wait(1);
        const proposeTx = await GovernorContract.propose(
          [LifeInsurancePolicyContract.address],
          [0],
          [encodedFunctionCall],
          "It will set isClaimable to true if it passes"
        );
        // get proposal id from the event emitted by GovernorContract
        const proposeReceipt = await proposeTx.wait(1);
        const proposalId = proposeReceipt.events[0].args.proposalId;

        // get proposal state
        let proposalState = await GovernorContract.state(proposalId);
        console.log(`Current Proposal State: ${proposalState}`);
        await moveBlocks(VOTING_DELAY + 1);

        // cast vote
        const castVoteTx = await GovernorContract.castVoteWithReason(
          proposalId,
          voteWay,
          "The claim seems to be valid"
        );
        await castVoteTx.wait(1);
        proposalState = await GovernorContract.state(proposalId);
        assert.equal(proposalState.toString(), "1");
        console.log(`Current Proposal State: ${proposalState}`);

        // cast another vote by some different signer
        const GovernorContractWithSigner2 = await GovernorContract.connect(
          signers[2]
        );
        const castVoteTx2 =
          await GovernorContractWithSigner2.castVoteWithReason(
            proposalId,
            voteWay,
            "The claim seems to be valid"
          );
        await castVoteTx2.wait(1);
        proposalState = await GovernorContract.state(proposalId);
        console.log(`Current Proposal State: ${proposalState}`);

        // move to the end of voting period
        await moveBlocks(VOTING_PERIOD + 1);
        // queue the proposal
        console.log("Queueing the proposal");
        const descriptionHash = ethers.utils.id(
          "It will set isClaimable to true if it passes"
        );
        const queueTx = await GovernorContract.queue(
          [LifeInsurancePolicyContract.address],
          [0],
          [encodedFunctionCall],
          descriptionHash
        );
        await queueTx.wait(1);
        await moveTime(MIN_DELAY + 1);
        await moveBlocks(1);

        proposalState = await GovernorContract.state(proposalId);
        console.log(`Current Proposal State: ${proposalState}`);

        // execute the proposal
        console.log("Executing the proposal");
        const executeTx = await GovernorContract.execute(
          [LifeInsurancePolicyContract.address],
          [0],
          [encodedFunctionCall],
          descriptionHash
        );
        await executeTx.wait(1);
        // get the value of isClaimable
        const isClaimable = await LifeInsurancePolicyContract.getIsClaimable();
        assert.equal(isClaimable, true);
      });
    });
```

In this test, we are doing the following things:

- First we are funding the life policy contract with some initial funds
- Then we are making a claim on the contract
- Once claim is made, now a DAO proposal is made to verify the claim
- Now the proposal is voted on by the signers
- Once the voting period is over, the proposal is queued
- Once the timelock period is over, the proposal is executed
- Now we check if the isClaimable attribute of the contract is set to true

### Conclusion

This tutorial showcases one of the many strategies that can be used to verify a claim made on the contract. You can use any strategy that you want to verify the claim. The only thing that you need to make sure is that the strategy that you are using is not vulnerable to any kind of attack.
