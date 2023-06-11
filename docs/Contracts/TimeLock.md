---
sidebar_position: 7
---

# TimeLock Contract

- The page contains the documentation for the TimeLock contract that is used as the TimeLockController for the Governor contract.
- This contract can be used to create a timelock for the DAO.

```js
// Wait for a vote to be executed so that if
// anyone who holds governance token can vote on the proposals or get out
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    /**
     * @notice: The optional admin can aid with initial configuration of roles after deployment
     * without being subject to delay, but this role should be subsequently renounced in favor of
     * administration through timelocked proposals. Previous versions of this contract would assign
     * this admin to the deployer automatically and should be renounced as well.
     * @param minDelay Minimum delay for timelock.
     * @param proposers List of addresses that can propose a timelocked transaction.
     * @param executors List of addresses that can execute a timelocked transaction.
     * @param admin Address of the admin.
     */
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}

    function _execute(address payable target, uint256 value, bytes calldata data) internal {
        (bool success, ) = target.call{value: value}(data);
        require(success, "TimelockController: underlying transaction reverted");
    }
}
```
