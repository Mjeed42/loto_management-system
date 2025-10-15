# 🚨 DEPLOYMENT REQUIRED - Authentication System Update

## Current Issue
The backend is returning error: `RefreshToken.create is not a function`

This is because the new authentication system files exist locally but haven't been deployed to Google Cloud Run yet.

---

## Files That Need to Be Deployed

### ✅ New Files Created:
1. **backend/src/models/RefreshToken.js** - New model for refresh tokens
2. **backend/src/controllers/authController.js** - Updated with dual-token system
3. **backend/src/routes/auth.js** - Updated with new endpoints
4. **backend/src/middleware/auth.js** - Enhanced authentication middleware
5. **backend/server.js** - Updated CORS configuration

### ✅ Frontend Files (No deployment needed yet):
- frontend/src/contexts/AuthContext.js
- frontend/src/utils/axiosInterceptor.js
- frontend/src/pages/Login.js
- frontend/src/App.js
- frontend/src/components/Header.js
- frontend/src/components/ProtectedRoute.js

---

## Deploy Backend Now

### Option 1: Using Deployment Script
```bash
cd /home/alrash/code/GCP_Deployed/lastLOTO-28-09-2025/loto_management-system
./deploy-backend.sh
```

### Option 2: Manual Deployment
```bash
cd /home/alrash/code/GCP_Deployed/lastLOTO-28-09-2025/loto_management-system

# Set variables
export PROJECT_ID=loto-404
export REGION=europe-west1
export REPO_NAME=loto-repo
export SERVICE_NAME=loto-backend

# Build Docker image
docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/loto-backend:latest ./backend

# Push to registry
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/loto-backend:latest

# Deploy to Cloud Run
gcloud run deploy ${SERVICE_NAME} \
  --image ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/loto-backend:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 5000 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --concurrency 80 \
  --set-env-vars NODE_ENV=production,MONGO_URI="mongodb+srv://loto_app_user:6hsMKn4SwqFKpPtV@loto-cluster.e2qnwyn.mongodb.net/loto-app?retryWrites=true&w=majority",JWT_SECRET="MY_NAME_IS_PEPSICO",JWT_EXPIRE="7d"
```

---

## What Will Be Fixed After Deployment

✅ Login will work with new secure authentication
✅ Refresh tokens will be stored in database
✅ HTTP-only cookies will be set
✅ Remember Me functionality will work
✅ Idle timeout and absolute timeout will work
✅ CORS will allow localhost for development

---

## Estimated Deployment Time
- Build: ~2-3 minutes
- Push: ~1-2 minutes  
- Deploy: ~2-3 minutes
- **Total: ~5-8 minutes**

---

## After Deployment - Test Checklist

1. **Test Login:**
   ```bash
   curl -X POST https://loto-backend-643788243736.europe-west1.run.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}' \
     -v
   ```
   Should return 200 with accessToken and set-cookie header

2. **Test Health Endpoint:**
   ```bash
   curl https://loto-backend-643788243736.europe-west1.run.app/api/health
   ```
   Should return: `{"message":"LOTO Backend API is running!","database":"Connected"}`

3. **Test from Local Frontend:**
   - Open http://localhost:3000
   - Try to login
   - Should work without errors
   - Check cookies in DevTools

---

## If Deployment Fails

### Check Docker Build
```bash
cd backend
docker build -t test-backend .
```

### Check Logs
```bash
gcloud run services logs read loto-backend --region=europe-west1 --limit=50
```

### Verify Files Exist
```bash
ls -lh backend/src/models/RefreshToken.js
ls -lh backend/src/controllers/authController.js
```

---

## Priority: 🔴 HIGH

**You must deploy the backend before the new authentication system will work!**

The frontend is trying to use the new authentication endpoints, but the backend doesn't have them yet.

---

## Quick Deploy Command (Copy & Paste)

```bash
cd /home/alrash/code/GCP_Deployed/lastLOTO-28-09-2025/loto_management-system && ./deploy-backend.sh
```

---

**Status:** ⏳ Waiting for deployment  
**Last Updated:** October 15, 2025

