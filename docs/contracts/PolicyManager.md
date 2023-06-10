---
sidebar_position: 4
---

# Policy Manager Contract

- This page contains the documentation for the Policy Manager contract. This is a contract which is used to manage the insurance policies. It can mainly be used to fund an existing policy incase of shortages or withdraw funding from a deployed policy contract.

  > :warning: **Caution**: The withdraw function only uses the BaseInsurancePolicy contract's withdraw function. It does not use the withdraw function of the child contracts. To make it use the child contract's withdraw function, the user needs to define a custom withdraw function in the PolicyManager contract or override the current withdraw function.

- The user may or may not include a copy of the `PolicyManager.sol` in his/her file structure.
- It is not necessary to use this contract to manage the insurance policies. The user can also manage the insurance policies directly. But using this contract will make the management process easier and more streamlined.

```js
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SharedData.sol";
import "./BaseInsurancePolicy.sol";

/**
@dev PolicyManager Contract
note This contract can be used as a middleware to manage multiple policy contracts,
do functionalities like withdrawing or funding the policies */
contract PolicyManager {
    //Events
    event PolicyFunded(address indexed policyAddress, uint256 indexed amountFunded);

    event Withdrawn(
        address indexed policyAddress,
        address indexed policyHolderAddress,
        uint256 indexed amountWithdrawn
    );

    event Terminated(address indexed policyAddress);
    // Errors
    error FundingError();
    error ContractTerminatedOrCancelled();
    error InvalidContractAddress();
    error IncorrectAmountSent();

    //private address state variable
    address payable private s_owner;

    constructor() {
        s_owner = payable(msg.sender);
    }

    /**
    @dev function addFundToContract
    @param  contractAddress the contractAddress which we need to fund
    note this functions is used to fund the contract in any case
    */
    function addFundToContract(address payable contractAddress) public payable {
        if (contractAddress != address(0)) {
            revert InvalidContractAddress();
        }
        // Send the funds to the specified contract
        (bool success, ) = contractAddress.call{value: msg.value}("");
        if (success) {
            emit PolicyFunded(contractAddress, msg.value);
        } else {
            revert FundingError();
        }
    }

    /**
    @dev function fundPremiumToContract
    @param contractAddress the contractAddress which we need to fund
    note this function is used to fund the premium to the contract
     */
    function fundPremiumToContract(address payable contractAddress) public payable {
        // Get BaseContract
        BaseInsurancePolicy baseContract = BaseInsurancePolicy(contractAddress);

        // Revert if contract is terminated or cancelled
        if (baseContract.getIsTerminated() == false && baseContract.getIsPolicyActive() == false) {
            revert ContractTerminatedOrCancelled();
        }
        if (contractAddress != address(0)) {
            revert InvalidContractAddress();
        }
        if (msg.value > baseContract.getPremiumToBePaid()) {
            revert IncorrectAmountSent();
        }

        // Send the funds to the specified contract
        (bool success, ) = contractAddress.call{value: msg.value}("");
        if (success) {
            baseContract.sethasFundedForCurrentInterval(true);
            emit PolicyFunded(contractAddress, msg.value);
        } else {
            revert FundingError();
        }
    }

    /**
    @dev function withdrawFundFromContract
    note This function is used to withdraw the coverageAmount from the contract
    The function must be overridden if the withdraw functionality needs to be made different
    */
    function withdrawFundFromContract(address payable contractAddress) public payable {
        // Get BaseContract
        BaseInsurancePolicy baseContract = BaseInsurancePolicy(contractAddress);

        // Revert if contract is terminated or cancelled
        if (baseContract.getIsTerminated() == false && baseContract.getIsPolicyActive() == false) {
            revert ContractTerminatedOrCancelled();
        }
        if (contractAddress != address(0)) {
            revert InvalidContractAddress();
        }
        // getting the amount to be withdrawn
        // Withdraw the funds from the specified contract
        baseContract.withdraw();
        emit Withdrawn(
            contractAddress,
            baseContract.getPolicyHolderWalletAddress(),
            baseContract.getTotalCoverageByPolicy()
        );
    }

    /**
    @dev function terminatePolicy
    @param contractAddress address of the contract to be terminated

    note after termination, the stored eth amount in policy will
    get transferred to the policyManager address of that policy */
    function terminatePolicy(address payable contractAddress) public payable {
        // Get BaseContract
        BaseInsurancePolicy baseContract = BaseInsurancePolicy(contractAddress);

        // Revert if contract is terminated or cancelled
        if (baseContract.getIsTerminated() == false && baseContract.getIsPolicyActive() == false) {
            revert ContractTerminatedOrCancelled();
        }
        if (contractAddress != address(0)) {
            revert InvalidContractAddress();
        }
        // getting the amount to be withdrawn
        // Withdraw the funds from the specified contract
        baseContract.terminatePolicy();
        emit Terminated(contractAddress);
    }

    // getter functions
    function getOwner() public view returns (address payable owner) {
        return s_owner;
    }
}

```
