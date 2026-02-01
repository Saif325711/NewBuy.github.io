# Razorpay Payment Integration Setup

This project uses Razorpay for payment processing. To use the "Real" payment flow (even in Test Mode), you need to generate your own API Keys.

## 1. Get Your Keys (Free)
1.  Log in to the [Razorpay Dashboard](https://dashboard.razorpay.com/).
2.  Ensure you are in **Test Mode** (toggle in the top header).
3.  Go to **Settings** -> **API Keys**.
4.  Click **Generate Key**.
5.  Copy your `Key ID` and `Key Secret`.

## 2. Configure Environment Variables

### Backend (`server/.env`)
Open `server/.env` and paste your keys:
```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
```

### Frontend (`frontend/.env`)
Open `frontend/.env` and paste your **Key ID** (Secret is NOT needed here):
```env
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```

## 3. Restart Servers
After saving the files, restart your development servers for the changes to take effect:
```bash
# In server directory
npm run server

# In frontend directory
npm run dev
```

## Note on Simulation Mode
If you do not provide keys, the application will automatically fall back to a **Simulation Mode**.
-   You can click "Place Order".
-   The system will simulate a success response.
-   No actual Razorpay popup will appear, but the checkout flow will complete successfully.
