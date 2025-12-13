# Vercel Deployment Guide

This project is configured for easy deployment on Vercel.

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LFGBanditLabs/stacksvote)

## Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from the frontend directory**
   ```bash
   cd voting-frontend
   vercel
   ```

4. **Set Environment Variables**
   
   In your Vercel dashboard, add these environment variables:
   - `NEXT_PUBLIC_NETWORK=mainnet`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS=SP1C5DP9C9N2MB8DMZN18EJNSSA3GYNJE3DGN806V`
   - `NEXT_PUBLIC_CONTRACT_NAME=voting`

5. **Production Deployment**
   ```bash
   vercel --prod
   ```

## Automatic Deployments

Connect your GitHub repository to Vercel for automatic deployments:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Set root directory to `voting-frontend`
5. Add environment variables
6. Deploy!

Every push to `main` branch will trigger a new deployment.

## Custom Domain

To add a custom domain:

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Troubleshooting

- **Build fails**: Ensure all dependencies are in `package.json`
- **Environment variables**: Double-check variable names and values
- **Route issues**: Verify root directory is set to `voting-frontend`
