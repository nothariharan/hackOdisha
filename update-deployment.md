# 🔄 Updating EcoTracker on Akash Network

## Overview

Yes! You can update your deployed EcoTracker application on Akash Network. Here are several approaches:

## Method 1: Rolling Update (Recommended)

### Step 1: Prepare New Version

1. **Make your code changes** in your local project
2. **Test locally** to ensure everything works
3. **Version your changes** (e.g., v1.1, v1.2, etc.)

### Step 2: Build Updated Images

```bash
# Build with version tags
docker build -t ecotracker-backend:v1.1 ./backend
docker build -t ecotracker-frontend:v1.1 ./eco-tracker

# Tag for Docker Hub
docker tag ecotracker-backend:v1.1 h4riharan/ecotracker-backend:v1.1
docker tag ecotracker-frontend:v1.1 h4riharan/ecotracker-frontend:v1.1

# Push new versions
docker push h4riharan/ecotracker-backend:v1.1
docker push h4riharan/ecotracker-frontend:v1.1
```

### Step 3: Update SDL File

```yaml
services:
  backend:
    image: h4riharan/ecotracker-backend:v1.1  # ← Updated version
    # ... rest of config stays the same
  frontend:
    image: h4riharan/ecotracker-frontend:v1.1  # ← Updated version
    # ... rest of config stays the same
```

### Step 4: Deploy New Version

1. **Go to Akash Console** (https://console.akash.network/)
2. **Create New Deployment** with updated SDL file
3. **Wait for deployment** to become active
4. **Test the new version** thoroughly
5. **Close old deployment** to avoid double costs

## Method 2: Blue-Green Deployment

Run both versions simultaneously for zero-downtime updates:

### Advantages:
- ✅ Zero downtime
- ✅ Easy rollback
- ✅ Test in production environment

### Process:
1. **Deploy new version** (Green) alongside current (Blue)
2. **Test Green version** thoroughly
3. **Switch traffic** from Blue to Green
4. **Keep Blue running** for quick rollback if needed
5. **Close Blue deployment** after confirming Green works

## Method 3: Database Migration Updates

For updates that require database changes:

### Step 1: Backup Database
```bash
# If you need to backup SQLite database
# (Access via Akash Console shell or logs)
cp /root/data/ecotracker.db /root/data/ecotracker-backup.db
```

### Step 2: Deploy Migration
```yaml
services:
  migration:
    image: h4riharan/ecotracker-backend:v1.1
    command: ["./migrate-db"]  # Custom migration script
    # Run once then exit
```

### Step 3: Deploy Updated Application
- Use the same process as Rolling Update

## Method 4: Feature Flags

For gradual rollouts, implement feature flags in your code:

```javascript
// In your frontend
const useNewFeature = process.env.NEXT_PUBLIC_ENABLE_NEW_FEATURE === 'true'

// Update environment in SDL
env:
  - NEXT_PUBLIC_ENABLE_NEW_FEATURE=true
```

## Update Strategies by Change Type

### 🐛 **Bug Fixes**
- Use **Rolling Update**
- Quick deployment, minimal risk

### ✨ **New Features**
- Use **Blue-Green Deployment**
- Test thoroughly before switching

### 🗄️ **Database Changes**
- Use **Database Migration** approach
- Always backup first

### 🔧 **Configuration Changes**
- Update SDL file only
- No need for new Docker images

## Monitoring Your Updates

### Health Checks
Add health endpoints to your application:

```go
// In your Go backend
func healthHandler(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{
        "status": "healthy",
        "version": "v1.1",
        "timestamp": time.Now().Format(time.RFC3339),
    })
}
```

### Monitoring Tools
- **Akash Console**: View deployment status and logs
- **Custom Monitoring**: Add metrics endpoints
- **External Monitoring**: Use services like UptimeRobot

## Rollback Strategy

If something goes wrong:

### Quick Rollback
1. **Redeploy previous version** with old image tags
2. **Use same SDL file** with previous image versions
3. **Close problematic deployment**

### Emergency Rollback
1. **Keep old deployment running** during updates
2. **Switch traffic back** to old deployment
3. **Debug issues** in new deployment offline

## Best Practices

### 🏷️ **Versioning**
```bash
# Use semantic versioning
v1.0.0  # Major.Minor.Patch
v1.1.0  # New features
v1.1.1  # Bug fixes
```

### 🧪 **Testing**
- Test locally first
- Use staging environment if possible
- Monitor logs during deployment

### 💾 **Backups**
- Backup database before major updates
- Keep previous Docker images available
- Document rollback procedures

### 📊 **Monitoring**
- Monitor resource usage after updates
- Check application logs
- Verify all features work correctly

## Cost Considerations

### During Updates:
- **Double costs** while running both versions
- **Minimize overlap time** to reduce costs
- **Close old deployments** promptly

### Optimization:
- Use **smaller resource allocations** for testing
- **Scale up** after confirming stability
- **Monitor AKT spending** during updates

## Example Update Workflow

```bash
# 1. Make changes to your code
git add .
git commit -m "Add new eco challenge feature"
git tag v1.1

# 2. Build and push new images
docker build -t h4riharan/ecotracker-backend:v1.1 ./backend
docker build -t h4riharan/ecotracker-frontend:v1.1 ./eco-tracker
docker push h4riharan/ecotracker-backend:v1.1
docker push h4riharan/ecotracker-frontend:v1.1

# 3. Update deploy.yaml with new image tags
# 4. Deploy via Akash Console
# 5. Test new deployment
# 6. Close old deployment
```

## Troubleshooting Updates

### Common Issues:
- **Image not found**: Ensure images are pushed to Docker Hub
- **Configuration errors**: Double-check SDL syntax
- **Database conflicts**: Use proper migration strategies
- **Resource limits**: Monitor CPU/memory usage

### Solutions:
- **Check Akash Console logs**
- **Verify Docker Hub images**
- **Test SDL file locally**
- **Monitor resource usage**

## Conclusion

Updating applications on Akash Network is straightforward and flexible. The decentralized nature actually provides some advantages:

- **Multiple providers** available for redundancy
- **Cost-effective** compared to traditional cloud
- **No vendor lock-in** - easy to migrate
- **Transparent pricing** - know costs upfront

Choose the update method that best fits your needs and always test thoroughly before going live! 