---
sidebar_position: 4
---

# Chainlink Node Setup

## Using Docker

### Prerequisites

- Install [Docker](https://docs.docker.com/get-docker/)

### Setup

1. Run PostgreSQL in a Docker container. You can replace mysecretpassword with your own password.

   ```bash
   docker run --name cl-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
   ```

2. Confirm that the container is running. Note the 5432 port is published 0.0.0.0:5432->5432/tcp and therefore accessible outside of Docker.

   ```bash
   docker ps -a -f name=cl-postgres
   ```

   Store the container ID for use in the next step.

3. Run `sudo docker container inspect <container_id>` to get the IP address of the container.

## Run Chainlink node

### Configure your node

1. Create a local directory to hold the Chainlink data.

   ```bash
   mkdir -p ~/.chainlink-mumbai
   ```

2. Run the following as a command to create a config.toml file and populate with variables specific to the network you're running on.

```bash
echo "[Log]
Level = 'warn'

[WebServer]
AllowOrigins = '\*'
SecureCookies = false

[WebServer.TLS]
HTTPSPort = 0

[[EVM]]
ChainID = '80001'

[[EVM.Nodes]]
Name = 'Mumbai'
WSURL = 'wss://CHANGE_ME'
HTTPURL = 'https://CHANGE_ME'
" > ~/.chainlink-mumbai/config.toml
```

3. Create a secrets.toml file with a keystore password and the URL to your database. Update the value for mysecretpassword to the chosen password in Run PostgreSQL.

```bash
echo "[Password]
Keystore = 'mysecretkeystorepassword'
[Database]
URL = 'postgresql://postgres:mysecretpassword@h<IP_ADDRESS_OF_POSTGRES_CONTAINER>:5432/postgres?sslmode=disable'
" > ~/.chainlink-mumbai/secrets.toml
```

4. Start the chainlink node.

   ```bash
   cd ~/.chainlink-sepolia && docker run --platform linux/x86_64/v8 --name chainlink -v ~/.chainlink-mumbai:/chainlink -it -p 6688:6688 --add-host=host.docker.internal:host-gateway smartcontract/chainlink:2.0.0 node -config /chainlink/config.toml -secrets /chainlink/secrets.toml start
   ```

   You will be prompted to enter an email id and password. This is for the Chainlink node UI. You can use any email id and password.

5. Confirm that the container is running.

   ```bash
    docker ps -a -f name=chainlink
   ```

## Use Chainlink API

### Setup the Chainlink node

1. Visit the Chainlink node UI at **http://localhost:6688** and login with the email id and password you entered in the previous step.

2. You can find the chainlink node address in the node Operator GUI under the Key Management configuration.

3. Fund the node address with MATIC and LINK tokens. You can get both LINK and MATIC tokens from the [Chanlink faucet](https://faucets.chain.link/mumbai).

### Deploy your own Operator contract

1. Go to Remix and open the [Operator.sol](https://remix.ethereum.org/#url=https://docs.chain.link/samples/ChainlinkNodes/Operator.sol) smart contract.

2. On the Compile tab, click the Compile button for Operator.sol.

3. On the Deploy and Run tab, configure the following settings:

- Select "Injected Provider" as your Environment. The Javascript VM environment cannot access your oracle node. Make sure your Metamask is connected to Mumbai testnet. 

- Select the "Operator" contract from the Contract menu.

- Copy the LINK token contract address for the network you are using and paste it into the LINK field next to the Deploy button. For Polygon Mumbai Testnet, you can use this address:

`0x326C977E6efc84E512bB9C30f76E30c160eD06FB`

- Copy the Admin wallet address into the OWNER field.

4. Click transact. MetaMask prompts you to confirm the transaction.

5. Keep note of the Operator contract address. You need it later for your consuming contract.

6. Remeber, your oracle address is your deployed Operator contract address.

### Whitelist your node address in the Operator contract

1. In the Chainlink node GUI, find and copy the address of your chainlink node.

2. In Remix, call the setAuthorizedSenders function with the address of your node. Note the function expects an array. So you need to pass the address as an array.

## Add a new job to the node

1. Add a new job to the node by clicking `New Job` on the `Jobs` tab. You can use the boolean job spec from [here](https://docs.chain.link/chainlink-nodes/job-specs/direct-request-get-bool)

2. Replace YOUR_OPERATOR_CONTRACT_ADDRESS with the address of your deployed operator contract address from the previous steps.

3. Click Create Job. If the node creates the job successfully, a notice with the job number appears.

4. Click the job number to view the job details. You can also find the job listed on the Jobs tab in the Node Operators UI. Save the externalJobID value because you will need it later to tell your consumer contract what job ID to request from your node

## Create a request to your node

After you add jobs to your node, you can use the node to fulfill requests as a Policy Claim Validation Strategy.

For this example, you can import the `@kizunasafe/kizuna-safe-contracts/contracts/v08/strategies/api/APICall.sol` in your contract, and then you can use it to call any API. You might have to override the function if you want custom functionality, as the default implementation expects a bool to be returned from the API. 
