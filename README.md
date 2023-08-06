# EVM Sender Dapp with Pioneer

## Overview

This project is a decentralized application (Dapp) that allows users to send or receive Native assets, Tokens, or NFTs on any EIP-155 chain. It utilizes various tools and libraries to interact with hardware wallets and blockchain networks.

## Tools Used

- KeepKey Desktop (keepkey.com)
- MetaMask: (https://metamask.io/)
- Pioneer server (pioneers.dev/docs)
- Pioneer Template (guide)
- HDwallet (https://github.com/shapeshift/hdwallet)
- Pioneer SDK (https://github.com/BitHighlander/pioneer-sdk)
- KeepKey SDK (https://www.npmjs.com/package/@keepkey/keepkey-sdk)
- Web3 (https://www.npmjs.com/package/web3)

## Getting Started

Before you begin, make sure you have completed the steps in the Pioneer Template (guide).

### Installation

To install the project dependencies, use Yarn:

```bash
yarn install
```

### Build

To build the project with Turbo mode (optimized build), use the following command:

```bash
yarn build:turbo
```

### Running the Dapp

To run the Dapp in development mode, use the following command:

```bash
yarn dev
```

## Project Structure

The project is a React-based Dapp. It includes the following key components:

- **Home Component**: The main component that interacts with the Pioneer server through the pioneer-sdk and the selected HDwallet (KeepKey or MetaMask).

## Features

1. **Get ETH Address from HDwallet**: This functionality retrieves the wallet address using the function calls from HDwallet of the selected wallet.

2. **Display Balance in Native Asset of Selected Chain**: This feature fetches the web3 node for the selected chain from the Pioneer server and displays the balance in the native asset (e.g., ETH).

3. **Building Unsigned Transactions**: This functionality handles wallet send/receive of native assets. It calculates the amount in gwei and represents it as a HEX value. Then, it uses the web3 server to get live gas data from the selected network and sends the transaction to HDwallet to sign.

4. **ERC20 Send/Receive Tokens**: This feature facilitates the send/receive of ERC20 tokens. It encodes the data payload for an ERC-20 transfer and sends it to HDwallet for signing.

5. **Send/Receive NFTs**: This feature allows users to send/receive NFTs. It verifies the NFT ownership and estimates the gas needed for the transfer function to succeed. The transaction is then signed via HDwallet.

## UX of Transaction Flow

The Dapp follows the typical transaction flow:

1. **Build**: Users build a transaction by providing necessary inputs.

2. **Sign**: The transaction is signed using the connected HDwallet.

3. **Broadcast**: The signed payload is sent to the network for miners to accept and process.

## Contribution

Feel free to fork the project and add your own improvements or features!

## Additional Resources

- To learn how to list your Dapp on Pioneer, check out this guide: [How to List a Dapp on Pioneer](https://medium.com/@highlander_35968/how-to-list-a-dapp-on-pioneer-cdf54fc9d1de)

---

For more detailed implementation, refer to the final app repository: [https://github.com/BitHighlander/evm-sender-dapp-v2](https://github.com/BitHighlander/evm-sender-dapp-v2)

You can also view the deployed app on Vercel: [https://vercel.com/bithighlander/evm-sender-dapp-v2](https://vercel.com/bithighlander/evm-sender-dapp-v2)
