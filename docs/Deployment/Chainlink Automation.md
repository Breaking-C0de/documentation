---
sidebar_position: 5
---

# Chainlink Automation

## Why

To automate the process of premium collection of the insurance policy, we have used Chainlink Keepers. Chainlink Keepers provide reliable and decentralized automation, ensuring timely execution of tasks triggered by policy-specified time intervals.

## Set up

- Go to https://automation.chain.link/
- Click on "Register new upkeep"
- Trigger - "Custom logic"
- Enter the `BaseInsurancePolicy` contract's [deployed address](/docs/Contract%20Addresses)
- Give any upkeep name, starting balance of 5 is fine and check data is not needed.
