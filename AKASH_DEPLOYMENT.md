# EcoTracker - Akash Network Deployment

##  Deploying to Akash Network

### Prerequisites

1. **AKT Tokens** - You'll need AKT tokens for deployment costs
2. **Akash CLI** or **Akash Console** access
3. **Docker Registry** - To host your container images
4. **Keplr Wallet** - For signing transactions

### Step 1: Build Docker Images

`ash
# Build the Docker images
./build-docker.sh

# Or manually:
docker build -t ecotrack/backend:latest ./backend
docker build -t ecotrack/frontend:latest ./eco-tracker
`

### Step 2: Push Images to Registry

You'll need to push your images to a public registry like Docker Hub or GitHub Container Registry:

`ash
# Tag for your registry
docker tag ecotrack/backend:latest YOUR_REGISTRY/ecotrack/backend:latest
docker tag ecotrack/frontend:latest YOUR_REGISTRY/ecotrack/frontend:latest

# Push to registry
docker push YOUR_REGISTRY/ecotrack/backend:latest
docker push YOUR_REGISTRY/ecotrack/frontend:latest
`

### Step 3: Update Deployment Manifest

Edit deploy.yaml and update the image names:

`yaml
services:
  backend:
    image: YOUR_REGISTRY/ecotrack/backend:latest
  frontend:
    image: YOUR_REGISTRY/ecotrack/frontend:latest
`

### Step 4: Deploy to Akash

#### Option A: Using Akash Console (Recommended for beginners)

1. Go to [Akash Console](https://console.akash.network/)
2. Connect your Keplr wallet
3. Click "Deploy" and upload your deploy.yaml file
4. Follow the deployment wizard
5. Accept a bid from a provider
6. Your app will be deployed!

#### Option B: Using Akash CLI

`ash
# Create deployment
akash tx deployment create deploy.yaml --from YOUR_WALLET --chain-id akashnet-2

# View bids
akash query market bid list --owner YOUR_ADDRESS --dseq DEPLOYMENT_SEQUENCE

# Accept a bid
akash tx market lease create --owner YOUR_ADDRESS --dseq DEPLOYMENT_SEQUENCE --gseq 1 --oseq 1 --provider PROVIDER_ADDRESS --from YOUR_WALLET --chain-id akashnet-2

# Get deployment status and URL
akash provider lease-status --dseq DEPLOYMENT_SEQUENCE --from YOUR_WALLET --provider PROVIDER_ADDRESS
`

### Step 5: Access Your Application

Once deployed, you'll receive URLs for:
- **Frontend**: Your main EcoTracker application
- **Backend**: API endpoints for the application

##  Estimated Costs

- **Backend**: ~1000 uAKT per block (~.01-0.02 USD per day)
- **Frontend**: ~1000 uAKT per block (~.01-0.02 USD per day)
- **Total**: ~.02-0.04 USD per day

##  Configuration

### Environment Variables

**Backend:**
- PORT=8000
- DB_PATH=/root/data/ecotracker.db

**Frontend:**
- PORT=3000
- NODE_ENV=production
- NEXT_PUBLIC_API_URL=http://backend:8000

### Resource Allocation

**Backend:**
- CPU: 1.0 units
- Memory: 1Gi
- Storage: 5Gi (for SQLite database)

**Frontend:**
- CPU: 0.5 units
- Memory: 512Mi
- Storage: 1Gi

##  Troubleshooting

1. **Images not found**: Ensure your Docker images are pushed to a public registry
2. **Deployment failed**: Check your AKT balance and SDL syntax
3. **App not accessible**: Verify the provider is active and ports are correct
4. **Database issues**: Ensure persistent storage is properly configured

##  Features Deployed

Your deployed EcoTracker includes:
-  Customer Dashboard with eco points and challenges
-  Shopkeeper Dashboard with receipt issuing
-  Eco discount system based on customer points
-  Real-time customer validation
-  Receipt management with delete functionality
-  SQLite database with persistent storage
-  Modern UI with animations and icons

##  Accessing the Application

After successful deployment, you can access:
- **Customer Login**: Use the main URL
- **Shopkeeper Login**: Same URL, select "Shopkeeper" role
- **API Documentation**: Backend URL + /health for status

Enjoy your decentralized EcoTracker deployment on Akash Network! 
