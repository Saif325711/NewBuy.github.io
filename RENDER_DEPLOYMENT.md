# 🚀 Backend Deployment to Render - Quick Guide

## Prerequisites ✅
- Vercel environment variables added
- GitHub repository with code

## Step-by-Step Instructions

### 1️⃣ Redeploy Frontend (First!)
Go to Vercel dashboard → **Deployments** → Click **"Redeploy"** on latest deployment
This will apply the environment variables you just added.

---

### 2️⃣ Open Render
Visit: https://render.com
- Click **"Get Started"** or **"Sign Up"**
- Sign up with GitHub (recommended)

---

### 3️⃣ Create New Web Service
1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find and select your `newbuy` repository
5. Click **"Connect"**

---

### 4️⃣ Configure Service

Fill in these details:

**Name**: `newbuy-backend`

**Root Directory**: `server`

**Environment**: `Node`

**Build Command**: `npm install`

**Start Command**: `npm start`

**Plan**: **Free**

---

### 5️⃣ Add Environment Variables

Click **"Add Environment Variable"** and add these one by one:

```
PORT = 5000
```

```
JWT_SECRET = newbuy_secret_2024_change_in_production
```

```
RAZORPAY_KEY_ID = rzp_test_SAQwilE2F6vYZC
```

```
RAZORPAY_KEY_SECRET = 5dGnTU2V6Zr8ngcL435C5Ib3
```

---

### 6️⃣ Upload Firebase Credentials

**IMPORTANT**: Firebase service account file needs special handling

1. Scroll down to **"Secret Files"**
2. Click **"Add Secret File"**
3. **Filename**: `serviceAccountKey.json`
4. Click **"Choose File"**
5. Navigate to: `d:\newbuy1\server\serviceAccountKey.json`
6. Upload the file

---

### 7️⃣ Create Web Service

1. Click **"Create Web Service"** (bottom)
2. Wait for deployment (5-10 minutes first time)
3. Watch the logs - should see:
   ```
   Server running on port 5000
   ```

---

### 8️⃣ Copy Backend URL

Once deployed, you'll see a URL like:
```
https://newbuy-backend-xxxx.onrender.com
```

**COPY THIS URL!** You'll need it for next step.

---

### 9️⃣ Update Vercel Environment

1. Go back to Vercel
2. Open your project → **Settings** → **Environment Variables**
3. Find `VITE_API_URL`
4. Click **"Edit"**
5. Change value to: `https://YOUR-BACKEND-URL.onrender.com/api`
   
   Example: `https://newbuy-backend-xxxx.onrender.com/api`

6. Click **"Save"**
7. Go to **Deployments** → Click **"Redeploy"**

---

## ✅ Verification

After both redeploys:

1. Visit your Vercel URL
2. Open DevTools (F12) → **Network** tab
3. Refresh the page
4. Look for API calls - they should go to your Render backend
5. Check if products load on home page

---

## 🔥 Common Issues

**Backend build fails:**
- Check that `server` is set as Root Directory
- Verify all environment variables are added

**Frontend still shows errors:**
- Make sure you redeployed after changing VITE_API_URL
- Check the URL ends with `/api`
- Verify backend is running on Render

**Firebase errors on backend:**
- Ensure `serviceAccountKey.json` is uploaded in Secret Files
- Check the filename is exactly: `serviceAccountKey.json`

---

## 📞 Need Help?

Check Render logs:
- Dashboard → Your service → **Logs** tab
- Look for error messages

Let me know when you're done or if you face any issues!
