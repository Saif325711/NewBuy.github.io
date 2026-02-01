# Backend Deployment to Render - Step by Step

## ✅ What You Need:
- [x] GitHub account (done)
- [x] Code pushed to GitHub (done)  
- [x] Firebase serviceAccountKey.json file location: `d:\newbuy1\server\serviceAccountKey.json`

---

## 📝 Step-by-Step Guide:

### 1. Open Render
Visit: **https://render.com**

### 2. Sign Up / Login
- Click **"Get Started for Free"**
- **Sign up with GitHub** (recommended - one click!)

### 3. Create New Web Service
- Click **"New +"** (top right corner)
- Select **"Web Service"**

### 4. Connect Repository
- Click **"Connect a repository"**
- Find: **"NewBuy.github.io"**
- Click **"Connect"**

### 5. Configure Service Settings

Fill these **exactly**:

| Field | Value |
|-------|-------|
| **Name** | `newbuy-backend` |
| **Region** | Select closest to you |
| **Root Directory** | `server` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | **Free** |

### 6. Add Environment Variables

Click **"Add Environment Variable"** for each:

```
PORT
5000
```

```
JWT_SECRET
newbuy_secret_key_2024_production
```

```
RAZORPAY_KEY_ID
rzp_test_SAQwilE2F6vYZC
```

```
RAZORPAY_KEY_SECRET
5dGnTU2V6Zr8ngcL435C5Ib3
```

### 7. Upload Firebase Service Account

**IMPORTANT STEP:**

1. Scroll to **"Secret Files"** section
2. Click **"Add Secret File"**
3. **Filename**: Type exactly `serviceAccountKey.json`
4. Click **"Choose File"**
5. Navigate to: `D:\newbuy1\server\serviceAccountKey.json`
6. Select and upload

### 8. Create Web Service

- Click **"Create Web Service"** button (bottom)
- Wait 5-10 minutes for first deployment

### 9. Wait for Deployment

You'll see logs like:
```
Installing dependencies...
Starting server...
Server running on port 5000
```

### 10. Copy Backend URL

Once deployed (green "Live" badge):
- Copy the URL shown (something like `https://newbuy-backend-xxxx.onrender.com`)

---

## ✅ After Deployment:

### Update Vercel Frontend:

1. Go to Vercel dashboard
2. Open your project → **Settings** → **Environment Variables**
3. Find `VITE_API_URL`
4. Click **Edit**
5. Change to: `https://your-backend-url.onrender.com/api`
6. **Save**
7. Go to **Deployments** → **Redeploy**

---

## 🎯 Expected Result:

After redeploying frontend:
- Products will load from Firebase
- Cart functionality will work
- Checkout will work

---

**Ready to start?** Let me know when you reach each step!
