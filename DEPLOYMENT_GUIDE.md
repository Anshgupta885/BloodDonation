# Vercel Deployment Setup Guide

## ✅ What I Fixed

### 1. **Hardcoded API URLs** ❌ (CRITICAL - This was causing your 404 errors!)
- **Problem**: Frontend was making calls to `http://localhost:5000/api/...`
- **When deployed to Vercel**: These requests failed because localhost:5000 doesn't exist on Vercel
- **Fixed**: Changed to relative URLs `/api/...` which now properly route to your backend

**Files Fixed**:
- `frontend/src/pages/RequesterDashboard.jsx` - Line 47
- `frontend/src/pages/RequestStatus.jsx` - Lines 20, 44, 80

### 2. **Vercel Configuration** (vercel.json)
- ✅ Created `/api/index.js` as the serverless handler
- ✅ Configured routes to separate API calls from static assets
- ✅ Set up proper build configuration

### 3. **Backend Server Configuration** (backend/server.js)
- ✅ Only listens when running locally (`require.main === module`)
- ✅ Exports Express app for Vercel serverless handler
- ✅ MongoDB connection handled by `/api/index.js` with connection pooling

### 4. **CORS Configuration** (backend/src/app.js)
- ✅ Made dynamic using `ALLOWED_ORIGINS` environment variable
- ✅ Fallback to localhost for local development

---

## 🚀 Deployment Checklist

### Step 1: Add Environment Variables to Vercel
Go to **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

Add these variables:

```
MONGO_URI=your_mongodb_connection_string_here
ALLOWED_ORIGINS=https://your-app.vercel.app,https://yourdomain.com
NODE_ENV=production
```

**How to get your Vercel URL**: After first deployment, it's shown as `https://projectname-yourusername.vercel.app`

### Step 2: Deploy to Vercel

#### Option A: Deploy via Git (Recommended)
1. Commit all changes:
```bash
git add .
git commit -m "Fix 404 errors: use relative API URLs and configure Vercel serverless"
git push
```
2. Vercel will auto-deploy on push (if connected to GitHub/GitLab/Bitbucket)

#### Option B: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel
```

### Step 3: Test Locally First (IMPORTANT!)

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend
npm run dev
```

You should see:
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`
- API calls using `/api/...` URLs

---

## 🔍 How to Debug If Still Getting 404

### Check 1: Verify Deployment Build Logs
1. Go to **Vercel Dashboard** → **Your Project** → **Deployments** → Latest
2. Click on the deployment
3. Check **Build Logs** tab for any errors

### Check 2: Verify Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Confirm all variables are set
3. Redeploy after adding/changing variables

```bash
# In Vercel dashboard, click "Redeploy" on the latest deployment
```

### Check 3: Check Function Logs
1. Go to **Logs** tab in deployment details
2. Look for errors when making API calls
3. Common errors:
   - `MongoDB connection failed` → Check `MONGO_URI`
   - `CORS error` → Check `ALLOWED_ORIGINS`
   - `Cannot find module` → Clear build cache and redeploy

### Check 4: Browser DevTools
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Look at API calls:
   - Should show `/api/...` URLs
   - Status should be 200 (not 404)
   - If status is unknown host, check ALLOWED_ORIGINS

---

## 📝 Project Structure (For Reference)

```
BloodDonation/
├── api/
│   └── index.js                    # Vercel serverless handler
├── backend/
│   ├── server.js                   # Exports Express app
│   └── src/app.js                  # Main Express app
├── frontend/
│   ├── src/pages/
│   │   ├── RequesterDashboard.jsx  # ✅ FIXED: Uses /api URLs
│   │   └── RequestStatus.jsx       # ✅ FIXED: Uses /api URLs
│   └── package.json
├── vercel.json                     # ✅ UPDATED: Correct routing
├── .env.example                    # Environment template
└── .vercelignore                   # Files to ignore in deployment
```

---

## ⚠️ Common Mistakes to Avoid in Future

1. **Never hardcode domain names**: ❌ `http://localhost:5000` or `http://api.example.com`
   - ✅ Use: Relative URLs `/api/...` or environment variables

2. **Forgetting CORS configuration**: Make sure frontend domain is in `ALLOWED_ORIGINS`
   - Vercel URL pattern: `https://*.vercel.app`

3. **Not updating ALLOWED_ORIGINS after deploying custom domain**:
   - Add both `https://yourapp.vercel.app` AND `https://yourdomain.com`

4. **Environment variables not set**: Always verify in Vercel dashboard before deploying

5. **MongoDB connection timeout**: If first request is slow, check connection pooling settings

---

## 🎯 What Should Now Work

✅ Frontend makes relative API calls (`/api/...`)  
✅ Vercel routes `/api/*` to backend serverless handler  
✅ Backend connects to MongoDB on first request  
✅ CORS properly configured for your Vercel domain  
✅ Local development still works with `npm run dev`  

---

## 📞 Still Having Issues?

1. Check **Vercel Logs** (most common issues are there)
2. Verify **Environment Variables** are set
3. Look for **MongoDB connection errors**
4. Ensure **ALLOWED_ORIGINS** includes your Vercel URL
5. Check **Function Logs** for runtime errors

---

**Key Takeaway**: The 404 was happening because your frontend was trying to reach `http://localhost:5000` on a Vercel deployment, which doesn't exist. Now it uses relative `/api/...` URLs that Vercel's routing rules properly direct to your backend serverless function.
