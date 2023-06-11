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

### 3. Set Up Utiliity Files

You will need to set up the files given in the **[Utilities](./Utilities)** section of the documentation to make the deployment process easier.

### 4. Compile & Deploy

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
