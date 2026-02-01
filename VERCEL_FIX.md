# 🔧 Vercel 404 Error Fix Guide

## Issue
Your frontend deployed to Vercel but showing 404 error because:
1. API baseURL is hardcoded to `localhost:5000`
2. Environment variables not configured in Vercel

## Solution

### Step 1: Fix Vercel Configuration

Go to your Vercel project dashboard:
1. Click on your project
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

```
VITE_API_URL = http://localhost:5000/api
VITE_RAZORPAY_KEY_ID = rzp_test_SAQwilE2F6vYZC
```

> **Note**: We'll update VITE_API_URL to production backend URL after deploying backend

### Step 2: Update Build Settings (if needed)

In Vercel Settings → **Build & Development Settings**:
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Redeploy

After adding environment variables, Vercel will automatically redeploy.
Or click **Deployments** → **...** → **Redeploy**

---

## Next: Deploy Backend to Render

1. Go to https://render.com
2. Sign up / Login
3. Click **New +** → **Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Name**: `newbuy-backend`
   - **Root Directory**: `server`  
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Add Environment Variables:
   ```
   PORT=5000
   JWT_SECRET=your_strong_random_secret_here
   RAZORPAY_KEY_ID=rzp_test_SAQwilE2F6vYZC
   RAZORPAY_KEY_SECRET=5dGnTU2V6Zr8ngcL435C5Ib3
   ```

7. Upload Firebase credentials:
   - Go to **Secret Files**
   - Add: `serviceAccountKey.json`
   - Upload the file from `d:\newbuy1\server\serviceAccountKey.json`

8. Click **Create Web Service**

9. Copy the deployed URL (e.g., `https://newbuy-backend.onrender.com`)

### Step 4: Update Frontend Environment

Back in Vercel:
1. Go to **Settings** → **Environment Variables**
2. Edit `VITE_API_URL`
3. Change to: `https://newbuy-backend.onrender.com/api`
4. Save and redeploy

---

## Verification

After both deployments:
1. Visit your Vercel URL
2. Check if products load
3. Open DevTools → Network tab
4. Verify API calls go to Render backend
