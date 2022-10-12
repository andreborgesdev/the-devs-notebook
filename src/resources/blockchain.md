# Blockchain

## What is a blockchain?

It is a P2P network.

Blockchains are resilient. It will not go down if one node goes down, as long as there is at least one node running it

Blockchain nodes keep lists of the transactions that occur

Consensus is the mechanism used to agree on the state of a blockchain

A consensus protocol in a blockchain or decentralized system can be broken down into 2 pieces:

1. Chain Selection algorithm - How do we know which blockchain is the real and true blockchain? On BTC and ETH they use the Nakamoto Consensus which is a combination of proof of work and longest chain role.
2. Sybil Resistance mechanism - It defines a way of figuring out who is the block author. Which node is going to be the node who did that work to find that mine and be the author of that block so all the other nodes can verify that it is accurateIt is the ability to defend against users creating a large number of pseudo anonymous identities to gain a disproportional advantageous influence over said system.

Proof of Work (PoW) -  is the original crypto consensus mechanism, first used by Bitcoin. Proof of work and mining are closely related ideas. The reason it’s called “proof of work” is because the network requires a huge amount of processing power. Proof-of-work blockchains are secured and verified by virtual miners around the world racing to be the first to solve a math puzzle. The winner gets to update the blockchain with the latest verified transactions and is rewarded  by the network with a predetermined amount of crypto.

Miners are paid in 2 different ways, with a transaction fee (it is given from someone that wants to include its transaction in a block) and with a block reward (it is given from the blockchain itself). It uses a lot of electricity because every single node is running as fast as possible to win this race to get the rewards, this leads to an environmental impact.

Proof of Stake - Instead of solving a problem, nodes put up collateral as sybil resistance mechanism. They put up some collateral that they will behave honestly. Here they are called validators and not miners because they are just validating other nodes. Here, instead of nodes running as fast as possible to solve a problem, a node will randomly be selected to propose the new block and then the rest of the validators will validate if that node has proposed the block honestly. It uses way less energy and computational power because only 1 node is adding the block and the rest is just validating. However, it is a slightly less decentralized network due to the upfront staking cost it costs to participate. The exact details vary by project, but in general proof of stake blockchains employ a network of “validators” who contribute — or “stake” — their own crypto in exchange for a chance of getting to validate new transaction, update the blockchain, and earn a reward.

Bitcoin halving - Block reward gets cut in half +- every 4 years. 

There are 2 types of attacks that can happen in a blockchain:

1. Sybil attacks - Is when a user creates a whole bunch of pseudo accounts to try to influence a network. 
2. 51% attack - Because of the consensus, blockchains are going to agree that the longest chain is the one that they are going to go with, so long as they match up with 51% of the rest of the network. This means that if we have the longest chain and we have more than 51% of the network we can do what's called a fork in the network and bring the network into our now longest chain.

The bigger a blockchain is, the more decentralized and secure it gets.

Blockchains are deterministic systems. The term determinism means that if we enact the same operational steps in a specific order, we reach exactly the same result as anybody else who follows the exact process.

The scalability problem has to do with the gas fees and the amount of people that can send transactions through a block. A solution to this problem is by using sharding. A sharded blockchain is just a blockchain of blockchains. There is a mainchain that is going to coordinate everything amongst several chains that hook into this main chain. This means that there's more chains for people to make transactions on effectively increasing the amount of block space that there is. Sharding can greatly increase the number of transactions on a blockchain layer one.

Layer 1 - Base layer blockchain implementation, f.e. BTC, ETH

Layer 2 - Any application built on top of a layer 1

Rollups - Layer 2 that rollup its transactions into a layer 1. A rollup is like a sharded chain. They derive their secure from the layer 1 and they bulk send their transactions onto the layer one. Derive their security from their base layers.

Side chains - Derive their security from their own protocols.

A transaction is like a POST HTTP request in the web2 world. An address is like the username and the private key is like the password.

## What are smart contract?

Smart contracts are a set of instructions executed in a decentralized way without the need for a centralized or thrid party intermediary.

- Cannot be altered once it is deployed (immutable)
- Automatically executes
- Everyone sees the terms of the agreement
- More secure, work 24 hours and are faster to execute
- Transparent and flexible since all the nodes operators run the blockchain everyone can see everything that is happening on-chain so no shady deals can happen.
- It is also secure since we have a pseudo identity which is not linked to our real one
- Speed and efficiency
- Security
- Counter-party risk removal since the terms of the deal will always be the same

It is decentralized since there is no single centralized entity running a network. All the nodes that run the blockchain create the network.

In a normal web app run by a centralized entity, the maximum we can have is a distributed app, where we have servers spread across different locations. If they they are they, hacked, or they decide to go down they will because they can.

Node - A single instance in a decentralized network (can also be called peer)

Bitcoin is only for store of value, ETH is for store of value and utility (smart contracts).

The oracle problem - Blockchains cannot interact with real world data and events. Blockchains are deterministic systems.

Blockchain Oracle - Any device that interacts with the off-chain world to provide external data or computation to smart contracts. If we want our applications to be truly decentralized we can't work with a single oracle or a single data provider or a single source that is running these external computations, so we need a decentralized oracle network similar to a decentralized blockchain network

Hybrid smart contracts = On-chain + Off-chain agreements

Most blockchains are compatible with Ethereum type smart contracts

Dapp = Decentralized application = Decentralized protocol = Smart contract

Web3 (also known as Web 3.0) is **an idea for a new iteration of the World Wide Web which incorporates concepts such as decentralization, blockchain technologies, and token-based economics**.

Smart contracts = Trust minimized agreements = Unbreakable promises.

DAO = Decentralized Autonomous Organizations

With a block explorer we can see different addresses and transactions.

![mnemonic-vs-private-public-key](./images/mnemonic-vs-private-public-key.png)

Transaction fee - When we make transactions, the “miners” or “validators” make a small fee

Transaction fee = gas price * how much gas we used (this is for ETH, it might change from blockchain to blockchain )

Gas is a unit of computational measurement. The more complex our transaction is the more gas we have to pay.

The gas fee is paid by however makes the transaction

Any transaction on the blockchain comes with paying gas.

**The more people send transactions at the same time the more expensive our gas costs are. This is because a block only has so much block space and the nodes can only add so many nodes.**

We can set a limit on how much gas we want to spend

Base fee - The minimum gas price to send our transaction

Max fee - The maximum gas price to send our transaction

ETH > Gwei > Wei

## How do Blockchains work?

Hash - A unique fixed length string, meant to identify a piece of data. They are created by placing said data into a "hash function".

ETH runs on Keccak256

We combine the block, nonce, and data to create the hash

Nonce - A "number used once" to find the "solution" to the blockchain problem. It is also used to define the transaction number for an account/address.

Example of a problem: When blockchain miners are mining what they are really looking for is the nonce number that will make the hash start with four “0". They will go the bruteforce way, one by one, until they find the right nonce. This problem can vary depending on the blockchain we are using.

Mining - The process of finding the "solution" to the blockchain "problem". Nodes get paid for mining blocks.

Block - A list of transactions mined together

On a blockchain, a block stores its own hash and the hash of the previous block as well

Genisis block - First block in a blockchain. It has the prev with all "0"s since it is the first block and has no prev block.

This is why blockchains are immutable. If we were able to change, f.e., the genisis block, we would have to compute the hash for all the existing blocks in the blockchain again since the prev hash is also included in the hash calculation. This would be real expensive in terms of resources.

[https://andersbrownworth.com/blockchain/](https://andersbrownworth.com/blockchain/)

Majority rules in the blockchain so, if one peer tries to change the data of the blocks it will not change the blockchain as long as we have at least 3 peers.

This is why blockchains are decentralized, they have no single point of authority.

Public key - Is derived from your private key. Anyone can "see" it, and use it to verify that a transaction came from you.

Private key - Only known to the key holder, it's used to "sign" transactions.

Singing a transaction - A "one way" process. Someone with a private key signs a transaction by their private key being hashed with their transaction data. Anyone can then verify this new transaction hash with your public key.

Our wallet address is created/derived from our public key.

Block confirmation - The amount of blocks that have were mined since our transaction went through in a block.

## Distributed Ledger Technology (DLT)

Distributed Ledger Technology (DLT) refers to the technological infrastructure and protocols that allows simultaneous access, validation, and record updating in an immutable manner across a network that's spread across multiple entities or locations. DLT is a protocol that enables the secure functioning of a decentralized digital database. Distributed networks eliminate the need for a central authority to keep a check against manipulation.

DLT, more commonly known as the [blockchain technology](https://www.investopedia.com/terms/b/blockchain.asp), was introduced by [Bitcoin](https://www.investopedia.com/terms/b/bitcoin.asp) and is now a buzzword in the technology world, given its potential across industries and sectors. In simple words, the DLT is all about the idea of a "decentralized" network against the conventional "centralized" mechanism, and it is deemed to have far-reaching implications on sectors and entities that have long relied upon a trusted third-party.

## Blockchain vs Distributed ledger

[https://www.blockchain-council.org/blockchain/blockchain-vs-distributed-ledger-technology/#:~:text=The ledger tracks the ownership,in transactions (called blocks)](https://www.blockchain-council.org/blockchain/blockchain-vs-distributed-ledger-technology/#:~:text=The%20ledger%20tracks%20the%20ownership,in%20transactions%20(called%20blocks)).

[Corda](Blockchain%201ba81d24e2204846af99daa879b9e508/Corda%200d05f9ddc28248a5b1b7fbf283a7d324.md)

[SDX Architecture](Blockchain%201ba81d24e2204846af99daa879b9e508/SDX%20Architecture%2033c6acb9a0bc4423a1d00a0a1418d33b.md)

## Tokens

In a blockchain, fungible tokens are cryptocurrencies like Bitcoin ([BTC](https://cointelegraph.com/bitcoin-price)). Nonfungible tokens are units of data that represent a unique digital asset stored and verified on the blockchain.

Familiarity with the concept of fungibility in economics might help one better understand fungible and nonfungible tokens. The only difference is that crypto tokens express their fungibility property through a code script.

Fungible tokens or assets are divisible and non-unique. For instance, fiat currencies like the dollar are fungible: A $1 bill in New York City has the same value as a $1 bill in Miami. A fungible token can also be a cryptocurrency like Bitcoin: 1 BTC is worth 1 BTC, no matter where it is issued.

Nonfungible assets, on the other hand, are unique and non-divisible. They should be considered as a type of deed or title of ownership of a unique, non-replicable item. For example, a flight ticket is nonfungible because there cannot be another of the same kind due to its specific data. A house, a boat or a car are nonfungible physical assets because they are one-of-a-kind.

The same applies to [nonfungible tokens](https://cointelegraph.com/magazine/nonfungible-tokens/), which represent one unique and indivisible item — physical or intangible — like a picture or intellectual property. Blockchain is the underlying technology that can easily prove ownership of an intangible digital item.

The main difference between fungible assets and nonfungible assets resides in the content they store. While fungible tokens like Bitcoin store value, nonfungible tokens store data like an academic title or an artwork.

[Bitcoin](Blockchain%201ba81d24e2204846af99daa879b9e508/Bitcoin%201528986346134e0d84083d964fcd1e0c.md)

[Ethereum](Blockchain%201ba81d24e2204846af99daa879b9e508/Ethereum%20fffbb55e072543759a12060e789b8f22.md)