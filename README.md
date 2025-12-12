# 🗳️ StacksVote

> A decentralized voting platform built on Stacks blockchain with Clarity 4 smart contracts and Next.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stacks](https://img.shields.io/badge/Stacks-Blockchain-5546FF)](https://www.stacks.co/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Clarity](https://img.shields.io/badge/Clarity-4-blue)](https://clarity-lang.org/)

## ✨ Features

### Smart Contract (Clarity 4)
- 📝 **Create Proposals** - Anyone can submit proposals with title, description, and voting period
- 🗳️ **Weighted Voting** - Cast votes with customizable voting weights
- ⚖️ **Fair Governance** - Transparent, on-chain voting mechanism
- ⏰ **Time-based Voting** - Proposals have defined start and end blocks
- 🔒 **Immutable Results** - All votes permanently recorded on blockchain
- ✅ **Proposal Execution** - Execute passed proposals after voting ends

### Frontend (Next.js 15)
- 🎨 Modern, glassmorphic UI design
- 🔐 Seamless wallet integration (Hiro/Leather)
- 📱 Fully responsive mobile-first design
- ⚡ Real-time proposal updates
- 🌈 Beautiful gradient animations
- 🔄 Automatic vote counting and progress tracking

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- [Hiro Wallet](https://wallet.hiro.so/) or [Leather Wallet](https://leather.io/)
- [Clarinet](https://github.com/hirosystems/clarinet) (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LFGBanditLabs/stacksvote.git
   cd stacksvote
   ```

2. **Install frontend dependencies**
   ```bash
   cd voting-frontend
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 📂 Project Structure

```
stacksvote/
├── counter/                      # Clarity smart contract project
│   ├── contracts/
│   │   └── voting.clar          # Main voting contract
│   ├── tests/
│   │   └── voting.test.ts       # Contract tests
│   ├── settings/
│   │   └── Mainnet.toml         # Deployment configuration
│   └── Clarinet.toml            # Clarinet project config
│
└── voting-frontend/             # Next.js frontend application
    ├── app/
    │   ├── page.tsx             # Homepage
    │   ├── create/
    │   │   └── page.tsx         # Create proposal page
    │   └── layout.tsx           # Root layout
    ├── components/
    │   ├── Header.tsx           # Navigation header
    │   ├── ProposalCard.tsx     # Proposal display component
    │   └── ProposalList.tsx     # Proposal listing
    ├── contexts/
    │   └── AuthContext.tsx      # Wallet authentication
    ├── lib/
    │   ├── stacks.ts            # Blockchain interactions
    │   └── constants.ts         # App configuration
    └── package.json
```

---

## 🔧 Smart Contract

### Public Functions

#### `create-proposal`
```clarity
(create-proposal (title (string-utf8 256)) 
                 (description (string-utf8 1024)) 
                 (duration uint))
```
Create a new proposal with voting duration in blocks (~10 minutes per 100 blocks).

#### `cast-vote`
```clarity
(cast-vote (proposal-id uint) (vote-choice bool))
```
Vote on a proposal. `true` = Yes, `false` = No. Uses voter's weight.

#### `set-voter-weight`
```clarity
(set-voter-weight (voter principal) (weight uint))
```
Set voting weight for a user (owner only). Default weight is 1.

#### `execute-proposal`
```clarity
(execute-proposal (proposal-id uint))
```
Mark proposal as executed after voting period ends.

### Read-only Functions

- `get-proposal(proposal-id)` - Retrieve proposal details
- `get-proposal-count()` - Total number of proposals
- `is-proposal-active(proposal-id)` - Check if voting is active
- `get-proposal-result(proposal-id)` - Get voting results
- `get-voter-weight(voter)` - Get user's voting weight
- `get-vote(proposal-id, voter)` - Get specific vote details

---

## 🌐 Deployment

### Deploy Smart Contract

1. **Configure deployment**
   ```bash
   cd counter
   cp settings/Mainnet.toml.example settings/Mainnet.toml
   # Add your mnemonic to Mainnet.toml
   ```

2. **Generate deployment plan**
   ```bash
   clarinet deployments generate --mainnet
   ```

3. **Deploy to mainnet**
   ```bash
   clarinet deployments apply --mainnet
   ```

### Deploy Frontend (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LFGBanditLabs/stacksvote)

Or manually:

```bash
cd voting-frontend
npm run build
npm start
```

---

## 🧪 Testing

### Smart Contract Tests
```bash
cd counter
npm test
```

### Frontend Development
```bash
cd voting-frontend
npm run dev
```

---

## 🎯 Usage

### Creating a Proposal

1. Connect your Stacks wallet
2. Click "Create New Proposal"
3. Fill in:
   - **Title**: Short proposal name
   - **Description**: Detailed explanation
   - **Duration**: Voting period (in blocks)
4. Submit and confirm transaction

### Voting on Proposals

1. Browse active proposals on homepage
2. Click "Vote Yes" or "Vote No"
3. Confirm transaction in wallet
4. Vote is recorded on-chain

### Viewing Results

- Progress bars show current vote distribution
- Total votes displayed for each option
- Proposal status indicates if voting is active

---

## 🛠️ Configuration

### Update Contract Address

Edit `voting-frontend/lib/constants.ts`:

```typescript
export const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS';
export const CONTRACT_NAME = 'voting';
export const NETWORK = 'mainnet'; // or 'testnet'
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Stacks](https://www.stacks.co/)
- Frontend powered by [Next.js](https://nextjs.org/)
- Smart contracts in [Clarity](https://clarity-lang.org/)
- UI styled with [Tailwind CSS](https://tailwindcss.com/)
- Wallet integration via [@stacks/connect](https://github.com/hirosystems/connect)

---

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/LFGBanditLabs/stacksvote/issues)
- **Stacks Discord**: [Join the community](https://discord.gg/stacks)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/LFGBanditLabs">LFGBanditLabs</a></p>
  <p>⭐ Star this repo if you find it useful!</p>
</div>
