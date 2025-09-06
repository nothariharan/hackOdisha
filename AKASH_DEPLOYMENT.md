# 🚀 Deploy EcoTracker on Akash Network

## ✅ Prerequisites Complete!

Your Docker images are now built and available on Docker Hub:
- **Backend**: `h4riharan/ecotracker-backend:latest`
- **Frontend**: `h4riharan/ecotracker-frontend:latest`

## 🌐 Deploy via Akash Console (Recommended)

### Step 1: Set Up Wallet

1. **Install Keplr Wallet** (Chrome/Firefox extension): https://www.keplr.app/
2. **Create/Import your wallet** and add the Akash Network
3. **Fund your wallet** with at least 0.5 AKT tokens (plus transaction fees)
   - You can buy AKT on exchanges like Osmosis, Coinbase, or Kraken
   - Transfer AKT to your Keplr wallet

### Step 2: Access Akash Console

1. Go to **https://console.akash.network/**
2. **Connect your Keplr wallet**
3. Make sure you're on the Akash Network

### Step 3: Deploy EcoTracker

1. **Click "Create Deployment"**
2. **Choose "Upload SDL"** option
3. **Upload your `deploy.yaml` file** (located in your project root)
4. **Review the deployment configuration**:
   - Backend: 1 CPU, 1GB RAM, 5GB storage
   - Frontend: 0.5 CPU, 512MB RAM, 1GB storage
5. **Click "Create Deployment"**
6. **Approve the transaction** in Keplr (deployment deposit)

### Step 4: Select Provider

1. **Wait for bids** from providers (usually 1-2 minutes)
2. **Choose a provider** (typically the lowest cost one)
3. **Accept the bid** and approve the transaction
4. **Wait for deployment** to become active (2-5 minutes)

### Step 5: Access Your Application

1. **Go to "Leases" section** in the console
2. **Find your deployment** and click on it
3. **Copy the frontend URL** (will look like `https://xyz.provider.com`)
4. **Open the URL** in your browser

## 🎯 Your EcoTracker URLs

Once deployed, you'll have:
- **Frontend**: `https://[random-url].provider.com` (Main application)
- **Backend API**: `https://[random-url].provider.com:8000` (API endpoints)

## 🔧 SDL File Configuration

Your `deploy.yaml` file is configured with:

```yaml
services:
  backend:
    image: h4riharan/ecotracker-backend:latest
    port: 8000 (globally accessible)
    
  frontend:
    image: h4riharan/ecotracker-frontend:latest  
    port: 3000 → 80 (globally accessible)
    API URL: http://backend:8000
```

## 💰 Estimated Costs

- **Monthly cost**: ~5-10 AKT tokens (~$5-15 USD)
- **Deployment deposit**: 0.5 AKT (refundable when closing)
- **Transaction fees**: ~0.01 AKT per transaction

## 🛠️ Managing Your Deployment

### To Update Your Application:
1. Build new Docker images
2. Push to Docker Hub with new tags
3. Update `deploy.yaml` with new image tags
4. Create a new deployment (close the old one first)

### To Close Your Deployment:
1. Go to "Leases" in Akash Console
2. Click "Close Deployment"
3. Approve the transaction
4. **Your deposit will be refunded**

## 🔍 Troubleshooting

### If deployment fails:
1. Check your SDL file syntax
2. Ensure Docker images are public on Docker Hub
3. Verify you have sufficient AKT balance
4. Try a different provider

### If application doesn't load:
1. Check the logs in Akash Console
2. Verify the frontend can reach the backend
3. Ensure environment variables are correct

## 📞 Support

- **Akash Discord**: https://discord.akash.network
- **Documentation**: https://akash.network/docs
- **Community Forum**: https://github.com/akash-network/community

## 🎉 Success!

Once deployed, your EcoTracker application will be:
- ✅ **Decentralized** - Running on blockchain infrastructure
- ✅ **Cost-effective** - Up to 80% cheaper than traditional cloud
- ✅ **Censorship-resistant** - No single point of failure
- ✅ **Globally accessible** - Available worldwide

Share your deployment URL with others to showcase your EcoTracker app! 
