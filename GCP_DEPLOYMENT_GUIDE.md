# 🚀 GCP Deployment Guide - LOTO Management System

## 🔧 Quick Fix for Your Current CORS Error

Your frontend is deployed but trying to connect to `localhost:5000` instead of your GCP backend. Here's how to fix it:

---

## ⚡ Quick Solution

### Step 1: Get Your Backend URL
```bash
gcloud run services describe loto-backend --region=europe-west1 --format='value(status.url)'
```

This should return something like:
```
https://loto-backend-643788243736.europe-west1.run.app
```

### Step 2: Redeploy Frontend with Correct Backend URL

```bash
# Option A: Use the deployment script with your backend URL
./deploy-frontend.sh https://loto-backend-643788243736.europe-west1.run.app

# Option B: Or set it as an environment variable
export BACKEND_API_URL=https://loto-backend-643788243736.europe-west1.run.app
./deploy-frontend.sh
```

### Step 3: Update Backend CORS Configuration

Your backend needs to allow your frontend URL. Add this to your backend `.env`:

```bash
# Get your frontend URL
FRONTEND_URL=$(gcloud run services describe loto-frontend --region=europe-west1 --format='value(status.url)')

# Update backend with CORS allowed origin
gcloud run services update loto-backend \
  --region=europe-west1 \
  --update-env-vars FRONTEND_URL=${FRONTEND_URL}
```

---

## 📋 Complete Deployment Process

### Prerequisites

1. **Google Cloud SDK** installed and configured
2. **Docker** installed
3. **Project ID** configured: `loto-404`
4. **Artifact Registry** repository created: `loto-repo`

---

## 🔐 Step 1: Configure Environment Variables

### Backend Environment Variables

Create/update your backend `.env` file:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS - Your frontend URL (will be added after frontend deployment)
FRONTEND_URL=https://loto-frontend-643788243736.europe-west1.run.app
```

---

## 🚢 Step 2: Deploy Backend

```bash
# Navigate to your project directory
cd /path/to/loto_management-system

# Make the script executable
chmod +x deploy-backend.sh

# Deploy backend
./deploy-backend.sh
```

The script will:
1. Build the Docker image
2. Push to Google Artifact Registry
3. Deploy to Cloud Run
4. Return your backend URL

**Save the backend URL!** You'll need it for the frontend deployment.

---

## 🎨 Step 3: Deploy Frontend

```bash
# Deploy frontend with your backend URL
./deploy-frontend.sh https://YOUR-BACKEND-URL

# For example:
./deploy-frontend.sh https://loto-backend-643788243736.europe-west1.run.app
```

The script will:
1. Build the React app with your backend URL baked in
2. Create an optimized Docker image (~59MB)
3. Push to Google Artifact Registry
4. Deploy to Cloud Run
5. Return your frontend URL

---

## 🔄 Step 4: Update Backend CORS

After frontend deployment, update the backend to allow your frontend URL:

```bash
# Get your frontend URL
FRONTEND_URL=$(gcloud run services describe loto-frontend --region=europe-west1 --format='value(status.url)')

echo "Frontend URL: ${FRONTEND_URL}"

# Update backend environment variable
gcloud run services update loto-backend \
  --region=europe-west1 \
  --update-env-vars FRONTEND_URL=${FRONTEND_URL}
```

---

## ✅ Step 5: Verify Deployment

### Check Backend
```bash
# Get backend URL
BACKEND_URL=$(gcloud run services describe loto-backend --region=europe-west1 --format='value(status.url)')

# Test health endpoint
curl ${BACKEND_URL}/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-10-21T...",
  "database": "connected"
}
```

### Check Frontend
```bash
# Get frontend URL
FRONTEND_URL=$(gcloud run services describe loto-frontend --region=europe-west1 --format='value(status.url)')

echo "🌐 Frontend URL: ${FRONTEND_URL}"

# Open in browser
open ${FRONTEND_URL}  # macOS
# or
xdg-open ${FRONTEND_URL}  # Linux
```

---

## 🔧 Troubleshooting

### CORS Error: "CORS request did not succeed"

**Cause:** Backend doesn't allow your frontend URL

**Solution:**
```bash
# Update backend CORS allowed origins
gcloud run services update loto-backend \
  --region=europe-west1 \
  --update-env-vars FRONTEND_URL=https://your-frontend-url.run.app
```

### Frontend shows "Network Error" or tries to connect to localhost

**Cause:** Frontend was built without the correct backend URL

**Solution:** Redeploy frontend with correct backend URL:
```bash
./deploy-frontend.sh https://your-backend-url.run.app
```

### Database Connection Error

**Cause:** Backend can't connect to MongoDB

**Solution:** Update backend environment variables:
```bash
gcloud run services update loto-backend \
  --region=europe-west1 \
  --update-env-vars MONGODB_URI=your-mongodb-connection-string,JWT_SECRET=your-jwt-secret
```

---

## 📝 Environment Variables Reference

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://...run.app` |

### Frontend Build Arguments

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://...run.app` |

---

## 🔄 Redeployment Process

### To Redeploy Backend (after code changes):
```bash
./deploy-backend.sh
```

### To Redeploy Frontend (after code changes or backend URL change):
```bash
./deploy-frontend.sh https://your-backend-url.run.app
```

---

## 💰 Cost Optimization

### Cloud Run Pricing Considerations

Current configuration:
- **Frontend:** 512Mi RAM, 1 CPU, 0-10 instances
- **Backend:** 1Gi RAM, 1 CPU, 0-10 instances
- **Min instances:** 0 (scales to zero when not in use)

**Estimated monthly cost (low usage):**
- ~$5-10/month with occasional usage
- ~$50-100/month with moderate usage

### Cost Saving Tips:
1. Set `--min-instances 0` (already configured)
2. Use smaller memory/CPU when possible
3. Optimize Docker images (already done - 59MB frontend!)
4. Monitor usage with Google Cloud Console

---

## 🛡️ Security Checklist

- [x] No hardcoded credentials in code
- [x] Environment variables for sensitive data
- [x] CORS properly configured
- [x] HTTPS enforced (Cloud Run default)
- [ ] MongoDB IP whitelist configured (if using MongoDB Atlas)
- [ ] Regular security audits
- [ ] JWT secret is strong and unique
- [ ] MongoDB credentials are strong

---

## 📊 Monitoring & Logs

### View Backend Logs
```bash
gcloud run services logs read loto-backend --region=europe-west1 --limit=50
```

### View Frontend Logs
```bash
gcloud run services logs read loto-frontend --region=europe-west1 --limit=50
```

### View Real-time Logs
```bash
gcloud run services logs tail loto-backend --region=europe-west1
```

---

## 🔗 Quick Reference Commands

```bash
# Get all service URLs
gcloud run services list --region=europe-west1

# Update backend environment variable
gcloud run services update loto-backend \
  --region=europe-west1 \
  --update-env-vars KEY=VALUE

# Scale backend
gcloud run services update loto-backend \
  --region=europe-west1 \
  --min-instances=1 \
  --max-instances=10

# Delete service (careful!)
gcloud run services delete loto-backend --region=europe-west1
```

---

## 📞 Support

For issues:
1. Check the logs: `gcloud run services logs read SERVICE_NAME`
2. Verify environment variables are set correctly
3. Ensure CORS is configured properly
4. Check MongoDB connection

---

**Last Updated:** October 21, 2025  
**Version:** 1.0

