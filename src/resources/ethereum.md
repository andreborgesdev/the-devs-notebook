# Ethereum

## Account-based model

The Ethereum accounting system that keeps track of the user's available ether balance. The account model is like a bank checking or savings account with the balance being maintained by the system. Contrast with the very unusual "unspent transaction output" method used in Bitcoin UTXO

There are 2 types of accounts:
Externally Owned Account (EOA). They are controlled by users via private keys. If you’re not familiar with public and private keys, imagine your account address, which is derived from the public key, to be a bank account number (you can safely share it with anyone to receive payments) and the private key is similar to the secret PIN (only you know this number and you use it to access the funds).
Contract Account. These accounts are controlled by smart contract code. Since they are not controlled by private keys, they cannot initiate transactions. A transaction sent to a smart contract can cause this contract to call functions from other contracts.
All accounts have the following fields:

- **Balance**: how much ether the account owns.
- **Nonce**: the number of confirmed transactions that the account has generated. I will explain this in more detail later.
- **Storage**: permanent data store, only used by smart contracts. This is empty for EOAs.
- **Code**: only used by smart contracts. EOAs don’t have any code.

All transactions in Ethereum are initiated by EOAs. Both EOAs and contract accounts can receive and send ether:
If the receiving account is an EOA, its balance will increase.
If the receiving account is a Contract Account its code will be executed. In turn, this smart contract can call another smart contract, send ether to another smart contract, send ether to an EOA, etc.
Smart contracts only run when an account invokes them. They can be called from EOAs or from other smart contracts, but ultimately, everything has its origin in a transaction created by an EOA.

## **Replay Attacks**

Since you cannot track individual coins in Ethereum, the concept of a double-spending attack does not apply. The closest is the replay attack I will describe now.

**How Ethereum Prevents Replay Attacks**
Imagine you want to buy a car and you send the dealer 10 ether. You receive the car, the dealer receives 10 ether and you’re both happy. However, as this is a valid transaction, what is stopping the dealer from sending that same transaction to the Ethereum network over and over, effectively draining your account? This is known as replay attack.
Ethereum uses the concept of nonce to solve this. In cryptography, a nonce is a number that can be used just once in a cryptographic communication.
In Ethereum, a nonce is a number that is associated with an account and represents the number of transactions sent from that account. If it is a contract account, it represents the number of contracts that the contract has created (not called).

**How Does the Nonce Work**
Your transaction will include a nonce value, making it unique. If the attacker tries to replay the same transaction, nodes will see that a transaction for that amount of ether from your address to the dealer’s address with that nonce has already been processed and will be considered as a duplicate transaction.
It is important to notice that the attacker can only try to create a transaction for the exact same amount. It the attacker were to change the amount, that would invalidate the signature, making it an invalid transaction that nodes would reject.
Your next transaction, regardless of the address you’re sending ether to, will have incremented its nonce.
This mechanism not only prevents replay attacks but also allows for transactions to be executed in a certain order. If you send a series of transactions with nonces 3, 4, and 5 even if the transactions with nonces 4 and 5 are received first, they will stay in the mempool until the transaction with nonce 3 has been confirmed.
Unless you’re writing code to send transactions, you do not need to worry about this issue. Everything will be handled by your wallet.

Pros:

- Easy to implement smart contracts.
- Transactions are more compact, saving space.

Cons:

- Tricky to implement concurrent (parallel) transactions, since there is a global state that is affected by different transactions.
- Less privacy, since transactions are bound to an account.
- Relies on nonces to prevent replay attacks.