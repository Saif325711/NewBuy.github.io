# 🚀 Deployment Guide - NewBuy E-Commerce

## Quick Start

### 1. Push to GitHub

a) Create a new repository on GitHub (https://github.com/new)
b) Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Deploy Backend (Render)

a) Go to https://render.com and sign up/login
b) Click "New +" → "Web Service"
c) Connect your GitHub repository
d) Configure:
   - **Name**: newbuy-backend
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

e) Add Environment Variables:
   ```
   PORT=5000
   JWT_SECRET=[generate random string]
   RAZORPAY_KEY_ID=rzp_test_SAQwilE2F6vYZC
   RAZORPAY_KEY_SECRET=[your secret]
   ```

f) Upload Firebase credentials:
   - Go to "Secret Files"
   - Add file: `serviceAccountKey.json`
   - Upload your Firebase service account key

g) Click "Create Web Service"
h) Note down the deployed URL (e.g., https://newbuy-backend.onrender.com)

### 3. Deploy Frontend (Vercel)

a) Go to https://vercel.com and sign up/login
b) Click "Add New..." → "Project"
c) Import your GitHub repository
d) Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

e) Add Environment Variables:
   ```
   VITE_API_URL=https://newbuy-backend.onrender.com/api
   VITE_RAZORPAY_KEY_ID=rzp_test_SAQwilE2F6vYZC
   ```

f) Click "Deploy"
g) Your app will be live at `https://your-project.vercel.app`

### 4. Verify Deployment

- Visit your Vercel URL
- Open browser DevTools → Network tab
- Navigate through the app
- Check that API calls go to your Render backend
- Test product listings, cart, and checkout

## 🔧 Troubleshooting

### Frontend shows "Network Error"
- Check VITE_API_URL is correct
- Verify backend is running on Render
- Check CORS is enabled in backend

### Backend crashes on Render
- Verify all environment variables are set
- Check serviceAccountKey.json is uploaded
- View logs in Render dashboard

### Razorpay not working
- Verify RAZORPAY_KEY_ID matches in frontend and backend
- Check RAZORPAY_KEY_SECRET is set in backend
- Test with Razorpay test keys first

## 📞 Support

If you encounter issues, check:
1. Render logs for backend errors
2. Vercel deployment logs for build errors
3. Browser console for frontend errors
