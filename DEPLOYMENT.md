# Voting Contract - Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Hiro Platform (Recommended - Easiest)

1. **Visit Hiro Platform:**
   - Open: https://platform.hiro.so/
   - Sign in with your Stacks wallet (Hiro Wallet/Leather)

2. **Deploy the Contract:**
   - Click "New Project" or "Deploy Contract"
   - Select "Deploy to Testnet"
   - Copy the entire contract from `contracts/voting.clar`
   - Paste it in the code editor
   - Contract name: `voting`
   - Click "Deploy"

3. **Get Contract Address:**
   - After deployment, copy the contract address
   - Format: `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.voting`

4. **Update Frontend:**
   - Run: `npm run dev`
   - Paste the contract address in the app's "Contract Configuration" field

---

### Option 2: Install Clarinet & Deploy Locally

**Install Clarinet:**

Windows (using Winget):
```powershell
winget install clarinet
```

Or download from: https://github.com/hirosystems/clarinet/releases

**Initialize and Deploy:**

```bash
# Navigate to project
cd c:\Users\MSI\Desktop\walletconnect\stacks

# Check installation
clarinet --version

# Check syntax
clarinet check

# Test contract
clarinet console

# Deploy to testnet (requires Stacks wallet)
clarinet deploy --testnet
```

---

### Option 3: Use Stacks CLI

**Install Stacks CLI:**
```bash
npm install -g @stacks/cli
```

**Deploy:**
```bash
# Deploy to testnet
stx deploy_contract contracts/voting.clar voting --testnet --url https://api.testnet.hiro.so

# You'll need:
# - Your private key or use keychain
# - Testnet STX for deployment fees
```

---

## 📋 Pre-Deployment Checklist

- [ ] Contract syntax is valid (no errors in voting.clar)
- [ ] You have a Stacks wallet (Hiro Wallet or Leather)
- [ ] You have testnet STX for deployment fees
- [ ] Get testnet STX from: https://explorer.stacks.co/sandbox/faucet?chain=testnet

---

## 🎯 After Deployment

1. **Copy your contract address** (format: `ADDRESS.voting`)
2. **Start the frontend:**
   ```bash
   npm run dev
   ```
3. **Paste contract address** in the app
4. **Connect your wallet** and start creating proposals!

---

## 🔍 Contract Details

- **Contract Name:** voting
- **Clarity Version:** 2.4
- **Network:** Testnet (recommended for testing)
- **Features:** 
  - Create proposals
  - Cast weighted votes
  - Execute proposals
  - Query proposal data

---

## 💡 Tips

- **Testnet First:** Always deploy to testnet before mainnet
- **Gas Fees:** Keep some STX for transaction fees
- **Contract Upgrades:** Contracts are immutable once deployed
- **Testing:** Test all functions thoroughly on testnet

---

## 🆘 Need Help?

- Hiro Documentation: https://docs.hiro.so/
- Stacks Discord: https://discord.gg/stacks
- Clarinet Docs: https://docs.hiro.so/clarinet
