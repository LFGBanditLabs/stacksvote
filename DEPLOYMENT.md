# 🚀 Deployment Guide

This guide covers deploying both the smart contract and frontend application.

## Smart Contract Deployment

### Prerequisites
- [Clarinet](https://github.com/hirosystems/clarinet) installed
- STX tokens for deployment fees (~0.06 STX for mainnet)
- Wallet mnemonic phrase (24 words)

### Step 1: Configure Deployment Settings

1. Navigate to the contract directory:
   ```bash
   cd counter
   ```

2. Create deployment configuration:
   ```bash
   # Copy the example file
   cp settings/Mainnet.toml.example settings/Mainnet.toml
   ```

3. Edit `settings/Mainnet.toml` and add your mnemonic:
   ```toml
   [network]
   name = "mainnet"
   stacks_node_rpc_address = "https://api.hiro.so"
   deployment_fee_rate = 10

   [accounts.deployer]
   mnemonic = "your twenty four word mnemonic phrase here"
   ```

   ⚠️ **IMPORTANT**: Never commit this file to git! It's already in `.gitignore`.

### Step 2: Generate Deployment Plan

```bash
clarinet deployments generate --mainnet
```

This creates a deployment plan in `deployments/default.mainnet-plan.yaml`.

### Step 3: Check Deployment Costs

Review the generated plan to see estimated costs:
```bash
cat deployments/default.mainnet-plan.yaml
```

Expected cost: ~0.058 STX + transaction fees

### Step 4: Fund Your Wallet

1. Get your deployment address:
   ```bash
   clarinet deployments check --mainnet
   ```

2. Send STX to the displayed address (minimum 0.1 STX recommended)

3. Verify balance:
   ```bash
   clarinet deployments check --mainnet
   ```

### Step 5: Deploy to Mainnet

```bash
clarinet deployments apply --mainnet
```

Wait for confirmation (usually 10-15 minutes).

### Step 6: Verify Deployment

Check the contract on [Stacks Explorer](https://explorer.hiro.so/):
```
https://explorer.hiro.so/txid/YOUR_TX_ID
```

### Alternative: Testnet Deployment

For testing without real STX:

1. Configure testnet:
   ```bash
   # Edit settings/Testnet.toml instead
   ```

2. Get testnet STX from [faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)

3. Deploy to testnet:
   ```bash
   clarinet deployments generate --testnet
   clarinet deployments apply --testnet
   ```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: `Next.js`
   - Root Directory: `voting-frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Set Environment Variables** (if needed)
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS
   NEXT_PUBLIC_NETWORK=mainnet
   ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Netlify

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"

2. **Configure Build**
   - Base directory: `voting-frontend`
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Deploy**
   - Netlify will automatically build and deploy

### Option 3: Self-Hosted (VPS)

1. **Build the Application**
   ```bash
   cd voting-frontend
   npm install
   npm run build
   ```

2. **Set up PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "stacksvote" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Post-Deployment

### Update Contract Address

After deploying the smart contract, update the frontend configuration:

1. Edit `voting-frontend/lib/constants.ts`:
   ```typescript
   export const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
   export const CONTRACT_NAME = 'voting';
   export const NETWORK = 'mainnet';
   ```

2. Redeploy frontend if already deployed

### Test the Application

1. Open your deployed frontend URL
2. Connect your Stacks wallet
3. Create a test proposal
4. Cast a vote
5. Verify transactions on [Stacks Explorer](https://explorer.hiro.so/)

---

## Troubleshooting

### Contract Deployment Issues

**Error: Insufficient funds**
- Ensure wallet has enough STX for deployment + fees
- Check balance: `clarinet deployments check --mainnet`

**Error: Contract already exists**
- Contract name is already taken
- Change contract name in `Clarinet.toml`

### Frontend Issues

**Error: Contract not found**
- Verify contract address in `constants.ts`
- Ensure contract is fully deployed (check explorer)
- Wait 10-15 minutes after deployment

**Wallet connection fails**
- Clear browser cache
- Update wallet extension
- Try different wallet (Hiro/Leather)

**Build fails**
- Check Node.js version (need 18+)
- Delete `node_modules` and reinstall
- Clear Next.js cache: `rm -rf .next`

---

## Monitoring

### Smart Contract
- Monitor transactions: [Stacks Explorer](https://explorer.hiro.so/)
- Check contract calls and events
- Monitor STX balance for contract operations

### Frontend
- Set up Vercel Analytics (free with deployment)
- Monitor error logs in deployment platform
- Use browser dev tools for debugging

---

## Security Checklist

- ✅ Never commit mnemonic or private keys
- ✅ Use environment variables for sensitive data
- ✅ Enable HTTPS on custom domains
- ✅ Keep dependencies updated
- ✅ Test on testnet before mainnet deployment
- ✅ Audit smart contract before deployment
- ✅ Set up monitoring and alerts

---

## Support

Need help? 
- Open an [issue](https://github.com/LFGBanditLabs/stacksvote/issues)
- Join [Stacks Discord](https://discord.gg/stacks)
- Check [Stacks Documentation](https://docs.stacks.co/)
