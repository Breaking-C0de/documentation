---
sidebar_position: 8
---

# APICall Contract

- The page contains the documentation for the APICall contract that is used to call the API and get the response.
- This contract uses Chainlink Any API service to call the API and get the response.
- This contract has been modified such that response obtained by it after API Call is used to validate the claim automatically.
- The response is expected to return a boolean value, if the value is true then the claim is valid and `isClaimable` of the policy contract is set to True else the claim is invalid and the `isTerminated` of the policy contract is set to True which terminates the policy as a punishment of false claim.

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "../../BaseInsurancePolicy.sol";

contract APICall is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    BaseInsurancePolicy private baseInsurancePolicyContract;

    /**
    note Events related to BaseInsurancePolicy contract
    */
    event ClaimValidationDataReceived(bytes32 requestId, uint256 volume);
    event PolicyClaimable(bool indexed isClaimable);
    event PolicyTerminated(bool indexed isTerminated);

    /**
    note Internal and private variables
     */
    uint256 private fee;

    constructor(address _link, address payable baseInsurancePolicy) ConfirmedOwner(msg.sender) {
        setChainlinkToken(_link);
        fee = (1 * LINK_DIVISIBILITY) / 10;
        baseInsurancePolicyContract = BaseInsurancePolicy(baseInsurancePolicy);
    }

    /**
    @dev Chainlink Any API Implementation
    @param url the url of the API
    @param path the path to the field that you want to retrieve in the JSON body of the response
    @param jobId the jobId of the Chainlink node depending on the type of data you want to get
    @param oracle the associated oracle address to the API that you want to use
    note  The requestVolumeData function can be used to call any API and get the response

    note The function can be overidden to adjust according to the needs,
    for example if you want to get multiple variables data*/
    function requestClaimValidationData(
        string memory url,
        string memory path,
        bytes32 jobId,
        address oracle
    ) public returns (bytes32 requestId) {
        setChainlinkOracle(oracle);
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        // Set the URL to perform the GET request on
        req.add("get", url);
        req.add("path", path);

        int256 timesAmount = 10 ** 18;
        req.addInt("times", timesAmount);

        // Sends the request
        return sendChainlinkRequest(req, fee);
    }

    /**
     * Receive the response in the form of uint256
     */
    function fulfill(
        bytes32 _requestId,
        bool _isClaimValid
    ) public recordChainlinkFulfillment(_requestId) {
        // override this function to implement callback functionality
        emit PolicyClaimable(_isClaimValid);

        // for this the Strategy contract should be set as admin of the BaseInsurancePolicy contract
        if (_isClaimValid == true) {
            baseInsurancePolicyContract.setClaimable(_isClaimValid);
        } else {
            baseInsurancePolicyContract.setTermination(true);
            emit PolicyTerminated(true);
        }
    }
}
```
