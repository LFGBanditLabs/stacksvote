# Deploying Voting Contract to Mainnet

## 🚨 Before You Deploy

### Prerequisites:
1. ✅ Contract checked with no errors: `clarinet check`
2. ✅ Have a Stacks wallet with sufficient STX for deployment (~1-3 STX)
3. ✅ Your 12/24 word mnemonic phrase (seed phrase)
4. ⚠️ **NEVER commit your mnemonic to git**

## 🧪 Recommended: Test on Testnet First

To avoid spending real STX, test your deployment on testnet:

### 1. Get Testnet STX
Visit: https://explorer.stacks.co/sandbox/faucet?chain=testnet

### 2. Configure Testnet Settings
Edit: `settings/Testnet.toml`

```toml
[network]
name = "testnet"
stacks_node_rpc_address = "https://api.testnet.hiro.so"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "YOUR 12 OR 24 WORD TESTNET MNEMONIC HERE"
```

### 3. Generate and Deploy to Testnet

```bash
# Generate deployment plan
clarinet deployments generate --testnet

# Review the deployment plan
cat deployments/default.testnet-plan.yaml

# Apply the deployment
clarinet deployments apply --testnet
```

---

## 🚀 Deploy to Mainnet

### Step 1: Configure Mainnet Settings

Edit: `settings/Mainnet.toml`

```toml
[network]
name = "mainnet"
stacks_node_rpc_address = "https://api.hiro.so"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "YOUR 12 OR 24 WORD MAINNET MNEMONIC HERE"
```

**Security Tips:**
- Use environment variables instead of hardcoding
- Or use `clarinet integrate` for wallet connection

### Step 2: Generate Deployment Plan

```bash
cd c:/Users/MSI/Desktop/walletconnect/stacks/counter
clarinet deployments generate --mainnet
```

This creates: `deployments/default.mainnet-plan.yaml`

### Step 3: Review Deployment Plan

```bash
cat deployments/default.mainnet-plan.yaml
```

Check:
- Contract name is correct
- Network is mainnet
- Gas fees look reasonable

### Step 4: Apply Deployment

```bash
clarinet deployments apply --mainnet
```

### Step 5: Verify Deployment

After deployment, you'll get a transaction ID. Check it at:
- https://explorer.hiro.so/txid/YOUR_TX_ID?chain=mainnet

---

## 💡 Alternative: Deploy via Hiro Platform (No CLI Setup)

### Easiest Method - No mnemonic needed in files:

1. **Go to**: https://platform.hiro.so/
2. **Connect your wallet** (Hiro Wallet/Leather)
3. **Create new project** → "Deploy Contract"
4. **Copy/paste** your contract from `contracts/voting.clar`
5. **Select Mainnet**
6. **Deploy** and approve transaction in wallet

This method:
- ✅ More secure (no mnemonic in files)
- ✅ Easier setup
- ✅ Visual interface
- ✅ Direct wallet connection

---

## 📊 Estimated Costs

Mainnet deployment typically costs:
- **~0.5 to 2 STX** depending on contract size and network congestion
- Current gas fees vary, check: https://stacks.co

---

## 🔒 Security Best Practices

### Protect Your Mnemonic:

1. **Add to .gitignore:**
```bash
echo "settings/Mainnet.toml" >> .gitignore
echo "settings/Testnet.toml" >> .gitignore
```

2. **Use Environment Variables:**
```bash
# Set environment variable
export STACKS_MNEMONIC="your twelve word mnemonic here..."

# Modify Mainnet.toml to use env var
# (Clarinet may not support this directly, use other methods)
```

3. **Use Clarinet Integrate:**
```bash
clarinet integrate
# Follow prompts to connect wallet
```

---

## 🆘 Troubleshooting

### "Invalid mnemonic word count"
- Ensure you have 12, 15, 18, 21, or 24 words
- No extra spaces or line breaks
- Words must be from BIP39 word list

### "Insufficient funds"
- Check STX balance: https://explorer.hiro.so/address/YOUR_ADDRESS
- Get more STX from an exchange

### "Contract already exists"
- Contract names must be unique per address
- Change contract name in Clarinet.toml

---

## ✅ After Deployment

Once deployed, your contract address will be:
```
YOUR_ADDRESS.voting
```

Use this address in your frontend app!

---

## 🎯 Quick Commands Summary

```bash
# Check contract
clarinet check

# Test deployment (recommended first)
clarinet deployments generate --testnet
clarinet deployments apply --testnet

# Mainnet deployment
clarinet deployments generate --mainnet
clarinet deployments apply --mainnet
```
