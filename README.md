# NewBuy E-Commerce Application

A modern e-commerce platform built with React, Node.js, Firebase, and Razorpay integration.

## 🚀 Features

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + Firebase Admin
- **Payment**: Razorpay integration
- **Database**: Firebase Firestore
- **Authentication**: JWT-based auth
- **UI**: Clean white theme with dark text for optimal readability

## 📦 Project Structure

```
newbuy1/
├── frontend/          # React frontend application
├── server/            # Node.js backend API
└── client/            # Additional client files
```

## 🔧 Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd server
npm install
npm start
```

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variables:
   - `VITE_API_URL` - Backend API URL
   - `VITE_RAZORPAY_KEY_ID` - Razorpay public key
4. Deploy

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables from `.env.example`
6. Upload `serviceAccountKey.json` as secret file
7. Deploy

## 📝 Environment Variables

See `.env.example` files in `frontend/` and `server/` directories for required environment variables.

## 🔐 Security Notes

- Never commit `.env` files
- Never commit `serviceAccountKey.json`
- Use environment variables for all secrets
- Use strong JWT secrets in production

## 📄 License

Private - All Rights Reserved
