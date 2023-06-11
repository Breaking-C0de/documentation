---
sidebar_position: 4
---

# Shared Data Contract (Library)

- This page contains the documentation for the Shared Data contract. This contract is used to store the common data structures and enums which are used by the other contracts.

- The user needs to import a copy of the `SharedData.sol` contract in their custom contracts.

- The user can also make changes to the `SharedData.sol` contract as per their requirements and define custom structures, enums or data types.

  > :warning: **Caution**: Note that the **policyManagerAddress** is the address in which the policy amount will be transferred to in case policy is matured or the policy is terminated and the user has not claimed the policy amount. This address should be the address of the organization's wallet.
  > :warning: **Caution**: Note that the **collaborators** is an array of address that can be used to add other managers to the policy. **It is advised to add Governance contracts as collaborators**.

```js
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// building a library for shared data
library SharedData {
    /********************* Add Custom Inputs Below *********************/

    /**
    @dev enum PolicyType
    Add Your Inherited PolicyTypes in this enum
    */
    enum PolicyType {
        Life,
        Health
    }

    /** ------------------------------------------------------------ */
    /** Custom Struct Parameter For LifeInsurancePolicy */
    struct Nominee {
        HumanDetails nomineeDetails;
        uint128 nomineeShare;
    }

    struct LifePolicyParams {
        Nominee[] nominees;
    }
    /** ------------------------------------------------------------ */

    struct HealthPolicyParams {
        uint64 copaymentPercentage;
    }

    /********************* Do Not Edit The Code Below *********************/
    /**
    @dev struct HumanDetails
    @param name Name of the person
    @param dateOfBirth Date of birth of the person
    @param gender Gender of the person
    @param homeAddress Home address of the person
    @param phoneNumber Phone number of the person
    @param pronouns Pronouns of the person
    @param email Email of the person
    @param occupation Occupation of the person
    @param policyHolderWalletAddress Wallet address of the person
     */
    struct HumanDetails {
        string name;
        string dateOfBirth;
        string gender;
        string homeAddress;
        string phoneNumber;
        string pronouns;
        string email;
        string occupation;
        address payable policyHolderWalletAddress;
    }

    /**
    @dev struct RevivalRule
    @param  revivalPeriod Period for which revival of a policy is allowed in seconds
    @param revivalAmount amount needed for revival
    */
    struct RevivalRule {
        uint128 revivalPeriod;
        uint256 revivalAmount;
    }

    /**
    @dev struct Policy
    @notice This struct is used to store the policy details
    @param policyHolder This is the policy holder's details
    @param policyTenure This is the policy tenure in seconds
    @param gracePeriod This is the grace period in seconds
    @param timeBeforeCommencement This is the time before commencement in seconds
    @param timeInterval This is the time interval in seconds
    @param premiumToBePaid This is the premium to be paid
    @param totalCoverageByPolicy This is the total coverage by the policy
    @param hasClaimed This is a boolean to check if the policy has been claimed, should be set to true when policy is claimed
    @param isPolicyActive This is a boolean to check if the policy is active, different from terminated as inactive policies can be activated again
    @param isClaimable This is a boolean to check if the policy is claimable,
    @param isTerminated This is a boolean to check if the policy is terminated, once set to true, the policy is over, no way to recover it
    @param hasFundedForCurrentInterval This is a boolean to check if the policy has been funded for the current month
    @param revivalRule This is the revival rule
    @param policyDetails This is the policy details
    @param policyType This is the policy type
    @param policyManagerAddress This is the policy manager contract address
    @param admins This is the list of admins for the policy who are able to call certain functions
    @param collaborators These are the list of collaborators who are also managers of the policy
    */
    struct Policy {
        HumanDetails policyHolder;
        uint128 policyTenure;
        uint128 gracePeriod;
        uint128 timeBeforeCommencement; // in refer below TODO
        uint256 timeInterval; // 2630000 (in months) in seconds TODO: make input in days and convert to seconds in contract by sudip given by debajyoti
        uint256 premiumToBePaid;
        uint256 totalCoverageByPolicy;
        bool hasClaimed;
        bool isPolicyActive;
        bool isClaimable;
        bool isTerminated;
        bool hasFundedForCurrentInterval;
        RevivalRule revivalRule;
        string policyDetails;
        PolicyType policyType;
        address payable policyManagerAddress;
        address[] admins;
        address[] collaborators; // It should be dead address if there is no governor contract
    }
}
```
