# LMS Deployment Guide

## 🚀 Render + Vercel Deployment

### Prerequisites
- GitHub repository with your LMS code
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)
- Stripe account (test mode)

### Step 1: Deploy Backend to Render

1. **Go to [render.com](https://render.com)**
2. **Sign up/Login with GitHub**
3. **Create New Web Service**
   - Connect your GitHub repository
   - Name: `lms-backend`
   - Environment: `Node`
   - Region: Choose closest to your users
   - Branch: `main`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   WEBHOOK_ENDPOINT_SECRET=your_webhook_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   FRONTEND_URL=https://lms-2.vercel.app
   ```

5. **Deploy**

### Step 2: Deploy Frontend to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Import GitHub repository**
3. **Configure:**
   - Framework: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables:**
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   VITE_USER_API=/api/v1/user/
   VITE_COURSE_API=/api/v1/course/
   VITE_PURCHASE_API=/api/v1/purchase/
   VITE_MEDIA_API=/api/v1/media/
   VITE_PROGRESS_API=/api/v1/progress/
   ```

5. **Deploy**

### Step 3: Update CORS

Update the backend CORS configuration with your actual Vercel URL.

### Step 4: Test Deployment

1. Visit your Vercel URL
2. Test user registration/login
3. Test course creation
4. Test course purchase
5. Verify instructor dashboard

## 🔄 Automatic Deployment

Both Render and Vercel will automatically redeploy when you push changes to your GitHub repository.

## 🐛 Troubleshooting

### Common Issues:
1. **CORS Errors**: Update allowed origins in server/index.js
2. **Environment Variables**: Double-check all env vars are set
3. **Build Failures**: Check build logs for specific errors
4. **Database Connection**: Verify MongoDB Atlas connection string

### Logs:
- **Render**: Check logs in Render dashboard
- **Vercel**: Check function logs in Vercel dashboard
