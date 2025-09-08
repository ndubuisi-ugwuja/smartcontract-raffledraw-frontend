# 🎟️ RaffleDraw DApp

A decentralized raffle application built with Next.js, wagmi, and RainbowKit, powered by an Ethereum smart contract. Users can connect their wallet, enter the raffle by paying the entrance fee, and watch live updates of the raffle state, players, and winners.

[Live preview](#)

## 🚀 Features

• ✅ Wallet connection via [RainbowKit](https://www.rainbowkit.com/)

• ✅ Enter raffle with one click (transaction sent to smart contract)

• ✅ Live contract data:

    • Current raffle state (Open or Calculating)

    • Current number of players

    • Most recent winner

    • Entrance fee (in ETH)

• ✅ Real-time event listeners:

    • Notify when a player enters the raffle

    • Notify when a winner is picked

• ✅ User-friendly notifications via [react-hot-toast](https://react-hot-toast.com/)

• ✅ Automatic refetching of players and winners on chain updates

## 🛠️ Tech Stack

• Frontend: Next.js 14 + React 18 + TailwindCSS

• Blockchain: Solidity smart contract (Raffle)

• Wallet/Chain Interaction: wagmi v1, viem, RainbowKit

• Notifications: react-hot-toast.

## 📦 Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/ndubuisi-ugwuja/smartcontract-raffledraw-frontend.git
cd nextjs-raffledraw-frontend
yarn install   # or npm install
```

## ⚙️ Environment Setup

Create a .env.local file in the project root and add:

```bash
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
```

-   You can get a WalletConnect project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

## 💻 Development

Run the local dev server:

```bash
yarn dev
```

## 🎮 Usage

1. Connect your wallet (MetaMask, Coinbase Wallet, WalletConnect, etc.)

2. Check the raffle state, number of players, and last winner.

3. Click Enter Raffle to join (requires paying entrance fee in ETH).

4. Wait for the raffle to close — the contract will automatically pick a winner.

5. Notifications will display when:

    • You successfully enter the raffle

    • The raffle begins calculating

    • A winner is picked

## 📜 License

MIT License. Feel free to fork and build on top of this project.
