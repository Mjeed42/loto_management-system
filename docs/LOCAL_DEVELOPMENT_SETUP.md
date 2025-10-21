# Local Development Setup Guide

## Connect Local Frontend to Cloud Backend

This guide shows you how to run the frontend locally while connecting to the deployed backend on Google Cloud Run.

---

## Prerequisites

- Node.js 18+ installed
- Backend deployed to Google Cloud Run
- Git repository cloned locally

---

## Step 1: Update Backend CORS (Already Done ✅)

The backend has been updated to allow requests from:
- `http://localhost:3000` (default React dev server)
- `http://localhost:3001` (alternative port)
- `http://127.0.0.1:3000`
- Production frontend URL

**You need to deploy the updated backend:**

```bash
cd /home/alrash/code/GCP_Deployed/lastLOTO-28-09-2025/loto_management-system
./deploy-backend.sh
```

---

## Step 2: Configure Frontend for Local Development

### Option A: Create `.env.local` file (Recommended)

Create a file in the frontend directory:

```bash
cd frontend
nano .env.local
```

Add this content:

```env
REACT_APP_API_URL=https://loto-backend-643788243736.europe-west1.run.app
```

Save and exit (Ctrl+X, then Y, then Enter)

### Option B: Create `.env.development.local` file

```bash
cd frontend
nano .env.development.local
```

Add the same content as above.

### Option C: Temporary - Set in terminal (Not persistent)

```bash
cd frontend
export REACT_APP_API_URL=https://loto-backend-643788243736.europe-west1.run.app
npm start
```

---

## Step 3: Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## Step 4: Start Local Development Server

```bash
cd frontend
npm start
```

The app will open at `http://localhost:3000`

---

## Step 5: Test the Connection

1. Open browser to `http://localhost:3000`
2. You should see the login page
3. Open browser DevTools (F12)
4. Go to Console tab
5. Try to login with valid credentials
6. Check Network tab - you should see requests to:
   - `https://loto-backend-643788243736.europe-west1.run.app/api/auth/login`

### Expected Behavior:
✅ Login works
✅ No CORS errors in console
✅ Cookies are set (check Application → Cookies)
✅ All features work normally

---

## Troubleshooting

### Issue 1: CORS Error

**Error in console:**
```
Access to XMLHttpRequest at 'https://loto-backend...' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution:**
1. Make sure you deployed the updated backend:
   ```bash
   ./deploy-backend.sh
   ```
2. Wait 1-2 minutes for deployment to complete
3. Clear browser cache and reload

### Issue 2: Cookies Not Working

**Symptoms:**
- Login succeeds but immediately logged out
- Token refresh fails

**Solution:**
1. Check browser console for cookie warnings
2. Make sure backend is deployed (cookies need correct sameSite setting)
3. Try in Chrome/Edge (better cookie support for development)

### Issue 3: Environment Variable Not Loading

**Symptoms:**
- Requests go to wrong URL
- 404 errors

**Solution:**
1. Stop the dev server (Ctrl+C)
2. Verify `.env.local` file exists in `frontend/` directory
3. Verify file content is correct
4. Restart dev server: `npm start`
5. Check in browser console:
   ```javascript
   console.log(process.env.REACT_APP_API_URL)
   ```

### Issue 4: Connection Refused

**Error:**
```
net::ERR_CONNECTION_REFUSED
```

**Solution:**
- Backend might be down
- Check backend is running:
  ```bash
  curl https://loto-backend-643788243736.europe-west1.run.app/api/health
  ```

---

## Quick Commands Reference

### Deploy Backend with CORS Updates
```bash
cd /home/alrash/code/GCP_Deployed/lastLOTO-28-09-2025/loto_management-system
./deploy-backend.sh
```

### Start Local Frontend
```bash
cd /home/alrash/code/GCP_Deployed/lastLOTO-28-09-2025/loto_management-system/frontend
npm start
```

### Check Backend Health
```bash
curl https://loto-backend-643788243736.europe-west1.run.app/api/health
```

### View Backend Logs
```bash
gcloud run services logs read loto-backend \
  --region=europe-west1 \
  --limit=50
```

---

## Development Workflow

### Daily Development:
1. Start local frontend: `npm start` (in frontend directory)
2. Make changes to frontend code
3. Changes auto-reload in browser
4. Test against cloud backend

### When Backend Changes Needed:
1. Make changes to backend code
2. Deploy backend: `./deploy-backend.sh`
3. Wait for deployment (~2-3 minutes)
4. Test with local frontend

### Before Committing:
1. Test all features work
2. Check browser console for errors
3. Verify no CORS issues
4. Test login/logout flow

---

## Alternative: Run Both Backend and Frontend Locally

If you want to run both locally:

### Terminal 1 - Backend:
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

### Terminal 2 - Frontend:
```bash
cd frontend
# Create .env.local with:
# REACT_APP_API_URL=http://localhost:5000
npm start
# Runs on http://localhost:3000
```

**Note:** You'll need MongoDB running locally or use MongoDB Atlas connection string.

---

## Security Notes

### Development vs Production:

**Development (localhost):**
- Cookies: `secure: false`, `sameSite: lax`
- CORS: Allows localhost origins
- Easier debugging

**Production (Cloud Run):**
- Cookies: `secure: true`, `sameSite: none`
- CORS: Only production frontend URL
- Maximum security

The backend automatically detects environment based on `NODE_ENV` variable.

---

## Useful Browser Extensions for Development

1. **React Developer Tools** - Debug React components
2. **Redux DevTools** - If using Redux (not applicable here)
3. **Cookie Editor** - View/edit cookies easily
4. **JSON Formatter** - Pretty print API responses

---

## Next Steps

After setup:
1. ✅ Deploy updated backend
2. ✅ Create `.env.local` file
3. ✅ Start local frontend
4. ✅ Test login functionality
5. ✅ Start developing!

---

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Check browser console for errors
3. Check backend logs: `gcloud run services logs read loto-backend --region=europe-west1`
4. Verify environment variables are set correctly

---

**Happy Coding! 🚀**

