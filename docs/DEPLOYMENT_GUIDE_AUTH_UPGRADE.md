# Deployment Guide - Authentication Security Upgrade

## Pre-Deployment Checklist

### Backend Requirements
- [ ] Node.js 18+ installed
- [ ] MongoDB Atlas connection available
- [ ] Environment variables configured
- [ ] `cookie-parser` package installed

### Frontend Requirements
- [ ] React 18+ 
- [ ] Axios configured
- [ ] Environment variables set

### Environment Variables

#### Backend `.env`
```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production

# Frontend URL for CORS
FRONTEND_URL=https://loto-frontend-643788243736.europe-west1.run.app

# MongoDB Connection
MONGO_URI=mongodb+srv://...

# Port
PORT=5000
```

#### Frontend `.env` or Build Args
```env
REACT_APP_API_URL=https://loto-backend-643788243736.europe-west1.run.app
```

---

## Deployment Steps

### Step 1: Backend Deployment

#### 1.1 Install Dependencies
```bash
cd backend
npm install cookie-parser
```

#### 1.2 Test Locally (Optional)
```bash
# Start backend
npm start

# Test endpoints
curl http://localhost:5000/api/health
```

#### 1.3 Build and Deploy to Google Cloud Run
```bash
cd /home/alrash/code/GCP_Deployed/lastLOTO-28-09-2025/loto_management-system

# Run the deployment script
./deploy-backend.sh
```

#### 1.4 Verify Backend Deployment
```bash
# Check health endpoint
curl https://loto-backend-643788243736.europe-west1.run.app/api/health

# Expected response:
# {
#   "message": "LOTO Backend API is running!",
#   "database": "Connected",
#   "environment": "production"
# }
```

### Step 2: Frontend Deployment

#### 2.1 Test Locally (Optional)
```bash
cd frontend
npm start

# Open browser to http://localhost:3000
# Test login functionality
```

#### 2.2 Build and Deploy to Google Cloud Run
```bash
cd /home/alrash/code/GCP_Deployed/lastLOTO-28-09-2025/loto_management-system

# Run the deployment script
./deploy-frontend.sh
```

#### 2.3 Verify Frontend Deployment
- Open: https://loto-frontend-643788243736.europe-west1.run.app
- Should see login page
- Check browser console for errors

---

## Post-Deployment Verification

### 1. Test Authentication Flow

#### Test 1: Login Without Remember Me
1. Go to login page
2. Enter credentials (don't check Remember Me)
3. Click Login
4. ✅ Should be logged in
5. Open DevTools → Application → Cookies
6. ✅ Should see `refreshToken` cookie with:
   - `HttpOnly: true`
   - `Secure: true`
   - `SameSite: None` (or Lax)
   - No expiration date (session cookie)
7. Close browser completely
8. Reopen browser and go to app
9. ✅ Should be logged out (redirected to login)

#### Test 2: Login With Remember Me
1. Go to login page
2. Enter credentials and CHECK "Remember Me"
3. Click Login
4. ✅ Should be logged in
5. Check cookies in DevTools
6. ✅ `refreshToken` cookie should have expiration date (7 days)
7. Close browser completely
8. Reopen browser and go to app
9. ✅ Should still be logged in

#### Test 3: Token Refresh
1. Login to app
2. Open DevTools → Network tab
3. Wait 15+ minutes (or modify token expiry for testing)
4. Perform any action (navigate, click button)
5. ✅ Should see automatic refresh call to `/api/auth/refresh`
6. ✅ Action should complete successfully

#### Test 4: Idle Timeout
1. Login to app
2. Leave browser open but don't interact for 30 minutes
3. ✅ Should be automatically logged out
4. ✅ Should see message: "Session expired due to inactivity"

#### Test 5: Logout
1. Login to app
2. Click user menu → Logout
3. ✅ Should be redirected to login page
4. Check cookies
5. ✅ `refreshToken` cookie should be deleted

### 2. Security Verification

#### Check 1: No Tokens in localStorage
```javascript
// Open browser console
console.log(localStorage.getItem('token')); 
// Should be: null
```

#### Check 2: Cookie Security Attributes
In DevTools → Application → Cookies:
- ✅ `HttpOnly` flag is set
- ✅ `Secure` flag is set (production)
- ✅ `SameSite` is set to None or Lax

#### Check 3: CORS Configuration
```bash
# Test CORS headers
curl -H "Origin: https://loto-frontend-643788243736.europe-west1.run.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://loto-backend-643788243736.europe-west1.run.app/api/auth/login \
     -v

# Should see:
# Access-Control-Allow-Origin: https://loto-frontend-643788243736.europe-west1.run.app
# Access-Control-Allow-Credentials: true
```

---

## Troubleshooting

### Issue: Cookies Not Being Set

**Symptoms:**
- Login succeeds but user is logged out on refresh
- No `refreshToken` cookie in browser

**Solutions:**
1. Check CORS configuration in `backend/server.js`:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```

2. Verify frontend sends credentials:
   ```javascript
   // In axios config
   withCredentials: true
   ```

3. Check cookie settings match environment:
   ```javascript
   // In authController.js
   secure: process.env.NODE_ENV === "production"
   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
   ```

### Issue: CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- Requests fail with 403 or blocked

**Solutions:**
1. Verify `FRONTEND_URL` environment variable is set correctly
2. Check that frontend URL matches exactly (no trailing slash)
3. Ensure backend allows credentials:
   ```javascript
   credentials: true
   ```

### Issue: Token Refresh Fails

**Symptoms:**
- User logged out after 15 minutes
- 401 errors in console

**Solutions:**
1. Check refresh token endpoint is accessible
2. Verify axios interceptor is imported in App.js
3. Check MongoDB connection (refresh tokens stored in DB)
4. Verify cookie is being sent with requests

### Issue: Migration Issues

**Symptoms:**
- Existing users can't login
- Old tokens still in localStorage

**Solutions:**
1. Clear browser cache and cookies
2. Run migration utility manually:
   ```javascript
   import { clearAllAuthData } from './utils/authMigration';
   clearAllAuthData();
   ```
3. Notify users to logout and login again

---

## Rollback Plan

If issues occur and you need to rollback:

### Quick Rollback
1. Revert to previous backend deployment:
   ```bash
   gcloud run services update loto-backend \
     --image [PREVIOUS_IMAGE] \
     --region europe-west1
   ```

2. Revert to previous frontend deployment:
   ```bash
   gcloud run services update loto-frontend \
     --image [PREVIOUS_IMAGE] \
     --region europe-west1
   ```

### Full Rollback
1. Checkout previous git commit
2. Redeploy using deployment scripts

---

## Monitoring

### Key Metrics to Monitor

1. **Login Success Rate**
   - Monitor failed login attempts
   - Check for authentication errors

2. **Token Refresh Rate**
   - Should see refresh calls every ~15 minutes per active user
   - High failure rate indicates issues

3. **Session Duration**
   - Average session length
   - Idle timeout occurrences

4. **Database Performance**
   - RefreshToken collection size
   - Query performance on token lookups

### Logging

Check backend logs for:
```
✅ Token generated successfully
✅ Token refresh successful
❌ Token refresh failed
❌ Invalid refresh token
```

---

## User Communication

### Notification Template

**Subject:** Security Enhancement - Please Login Again

**Body:**
```
Dear LOTO System Users,

We've upgraded our authentication system to enhance security and protect your account.

What's New:
✅ Enhanced security with short-lived tokens
✅ Automatic logout when closing browser (unless "Remember Me" is checked)
✅ Session timeout after 30 minutes of inactivity
✅ Maximum session duration of 8 hours

What You Need to Do:
1. Login again with your existing credentials
2. Optionally check "Remember Me" to stay logged in for 7 days

If you have any questions, please contact support.

Thank you for your cooperation!
```

---

## Success Criteria

Deployment is successful when:
- ✅ Users can login successfully
- ✅ "Remember Me" works as expected
- ✅ Browser close logs out users (without Remember Me)
- ✅ Automatic token refresh works
- ✅ Idle timeout works (30 minutes)
- ✅ Absolute timeout works (8 hours)
- ✅ No tokens in localStorage
- ✅ Cookies have proper security flags
- ✅ No CORS errors
- ✅ All existing features work normally

---

## Support Contacts

- **Technical Issues:** Check backend logs and browser console
- **Security Questions:** Review AUTHENTICATION_SECURITY_UPGRADE.md
- **Deployment Issues:** Check this guide and Cloud Run logs

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Rollback Plan Tested:** [ ] Yes [ ] No  
**User Notification Sent:** [ ] Yes [ ] No

