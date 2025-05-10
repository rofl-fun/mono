# 🏗 ROFL.DAM

<h4 align="center">
  <a href="https://rofl-dam.vercel.app/">Deployed app</a>
</h4>

🧪 A decentralized chat application built on Oasis Sapphire and ROFL (Runtime Off-chain Logic), leveraging Trusted Execution Environment (TEE) for secure, off-chain message processing and storage.

## 🌟 Key Features

- 🔒 **Secure Message Processing**: Messages are processed within TEE, ensuring confidentiality and integrity
- 🔐 **NFT-Gated Access**: Control chat access using NFT ownership on Oasis Sapphire Testnet
- 🔄 **Off-chain Logic**: Computations and message processing handled by ROFL runtime
- 🏗 **Built with Scaffold-ETH 2**: Leveraging modern web3 development tools

## 🏗 Architecture

The project consists of two main components:

1. **Frontend (NextJS)**
   - User interface for chat interactions
   - Located in `packages/nextjs/`

2. **ROFL Backend**
   - Secure message processing in TEE
   - MongoDB integration for message storage
   - Nostr protocol integration for message relay
   - Located in `packages/rofl/`

3. **Oasis Smart contracts**
   - NFT management and verification
   - Located in `packages/foundry/`

## 🚀 Quickstart

- Install dependencies:
```bash
yarn install
```

- Start the NextJS frontend:
```bash
yarn start
```

## 🔧 Development

- Frontend code is in `packages/nextjs/app/`
- Smart contracts are in `packages/foundry/contracts/`
- ROFL backend code is in `packages/rofl/`
- Contract deployment scripts are in `packages/foundry/script/`

## 🔐 Security Features

- Messages are processed within Trusted Execution Environment (TEE)
- Integration with Sapphire for secure key management
- NFT-based access control for chat rooms
- Off-chain message processing for better scalability

## 🏆 Oasis

This project is built for the Oasis ROFL and Oasis Sapphire track, leveraging:
- Runtime Off-chain Logic (ROFL) for secure computation
- NFT smart contract deployed on Oasis Sapphire Testnet
- TEE-based execution for enhanced security

# Links
- [ChatAccessNFT.sol on Oasis Sapphire Testnet](https://pr-1777.oasis-explorer.pages.dev/testnet/sapphire/address/0xF2A83DF3190c5F2E31c56E1cEFf71A783548899C)
- [Github repo](https://github.com/rofl-fun/mono)
- [Live deployment on Vercel](https://rofl-dam.vercel.app/)

## 👥 Team

- [0xjsi.eth](https://x.com/0xjsieth) - Senior Docker Engineer
- [maarten](https://github.com/11029358) - Design and UX
- [pitycake](https://twitter.com/pitycake) - Senior Backend Developer
- [arjanjohan](https://twitter.com/arjanjohan) - Fullstack Developer
