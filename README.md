# Stacks Voting DApp

A decentralized voting application built on the Stacks blockchain using Clarity 4 smart contracts.

## Features

### Smart Contract (Clarity 4)
- ✅ **Create Proposals**: Anyone can create proposals with title, description, and duration
- ✅ **Vote on Proposals**: Cast weighted votes (Yes/No) on active proposals
- ✅ **Voter Weights**: Contract owner can assign different voting weights to users
- ✅ **Execute Proposals**: Mark proposals as executed after voting period ends
- ✅ **Read-only Functions**: Query proposal details, vote counts, and status
- ✅ **Clarity 4 Features**: Uses improved string handling, map operations, and optional handling

### Frontend (React + Stacks Connect)
- 🎨 Modern, responsive UI with gradient design
- 🔐 Wallet connection with Stacks Connect
- 📝 Create new proposals with form validation
- 🗳️ Vote on active proposals
- 📊 Real-time vote tracking with progress bars
- 🔄 Refresh proposals to see latest data
- 📱 Mobile-friendly responsive design

## Project Structure

```
stacks/
├── contracts/
│   └── voting.clar           # Clarity 4 voting smart contract
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Header with wallet connection
│   │   ├── ProposalForm.jsx  # Create new proposals
│   │   ├── ProposalList.jsx  # List all proposals
│   │   └── ProposalCard.jsx  # Individual proposal card with voting
│   ├── App.jsx               # Main application component
│   ├── App.css
│   ├── index.css             # Global styles
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## Smart Contract Functions

### Public Functions
- `create-proposal(title, description, duration)` - Create a new proposal
- `cast-vote(proposal-id, vote-choice)` - Vote on a proposal (true = yes, false = no)
- `set-voter-weight(voter, weight)` - Set voting weight for a user (owner only)
- `execute-proposal(proposal-id)` - Execute a proposal after voting ends

### Read-only Functions
- `get-proposal(proposal-id)` - Get proposal details
- `get-vote(proposal-id, voter)` - Get vote details for a voter
- `get-voter-weight(voter)` - Get voting weight of a user
- `get-proposal-count()` - Get total number of proposals
- `is-proposal-active(proposal-id)` - Check if proposal is active
- `get-proposal-result(proposal-id)` - Get proposal results

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Hiro Wallet browser extension

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Deploy the Smart Contract

1. **Using Clarinet (recommended):**
   ```bash
   # Install Clarinet
   # Visit: https://docs.hiro.so/clarinet/installation

   # Initialize Clarinet project
   clarinet integrate

   # Deploy to testnet
   clarinet deploy --testnet
   ```

2. **Using Hiro Platform:**
   - Visit [Hiro Platform](https://platform.hiro.so/)
   - Create a new project
   - Deploy the contract from `contracts/voting.clar`
   - Copy the deployed contract address

3. **Update Frontend:**
   - Paste the contract address in the "Contract Configuration" field in the app

## Usage

### Connect Wallet
1. Click "Connect Wallet" in the header
2. Approve the connection in your Hiro Wallet

### Create a Proposal
1. Fill in the proposal title (max 100 characters)
2. Add a description (max 500 characters)
3. Set duration in blocks (144 blocks ≈ 1 day)
4. Click "Create Proposal" and approve the transaction

### Vote on Proposals
1. Browse active proposals
2. Click "Vote Yes" or "Vote No"
3. Approve the transaction in your wallet
4. Wait for transaction confirmation

### View Results
- Vote counts are displayed in real-time
- Progress bars show percentage of Yes/No votes
- Refresh to see latest vote counts

## Clarity 4 Features Used

1. **String-UTF8 Support**: Better string handling for titles and descriptions
2. **Enhanced Map Operations**: Efficient storage and retrieval of proposals and votes
3. **Improved Optional Handling**: Better `match` and `unwrap` operations
4. **Merge Function**: Update map values efficiently

## Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Technologies

- **Blockchain**: Stacks Blockchain
- **Smart Contract**: Clarity 4
- **Frontend**: React 18
- **Build Tool**: Vite
- **Wallet Integration**: @stacks/connect
- **Transaction Library**: @stacks/transactions
- **Network**: @stacks/network

## Security Considerations

- Contract owner has special privileges (set voter weights)
- Users cannot vote twice on the same proposal
- Voting is only allowed during the active period
- Proposals cannot be executed before voting ends

## Future Enhancements

- [ ] Add proposal categories
- [ ] Implement quadratic voting
- [ ] Add delegation system
- [ ] Create proposal templates
- [ ] Add notification system
- [ ] Implement time-locked voting
- [ ] Add analytics dashboard

## License

MIT

## Support

For issues or questions, please open an issue on the GitHub repository.
