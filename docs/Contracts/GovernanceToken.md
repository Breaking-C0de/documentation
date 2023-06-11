---
sidebar_position: 6
---

# Governor Token Contract

- The page contains the documentation for the Governor Token contract that are essentially ERC20 tokens with the added functionality of voting.
- This contract can be used to create personalized governance tokens for the DAO.

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract GovernanceToken is ERC20Votes {
    uint256 public s_maxSupply;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _maxSupply
    ) ERC20(_tokenName, _tokenSymbol) ERC20Permit(_tokenName) {
        s_maxSupply = _maxSupply;
        _mint(msg.sender, _maxSupply);
    }

    // The functions below are overrides required by Solidity.

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20Votes) {
        super._burn(account, amount);
    }
}
```
