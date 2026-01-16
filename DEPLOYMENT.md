# Deployment Guide for Saint Misty

This guide covers deploying both the frontend and backend on Render.

## Prerequisites

1. A [Render account](https://render.com)
2. MongoDB Atlas cluster (already configured)
3. This repository pushed to GitHub

## Deployment Steps

### 1. Connect Your Repository to Render

1. Log in to [Render](https://render.com)
2. Click "New +" and select "Blueprint"
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file

### 2. Configure Environment Variables

Render will create two services:
- **saintmisty-api** (Backend)
- **saintmisty-frontend** (Frontend)

#### Backend Environment Variables (saintmisty-api)

Set these in the Render dashboard for the API service:

```
NODE_ENV=production
PORT=5050
MONGO_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<your-jwt-secret-from-server/.env>
CLIENT_URL=<your-frontend-url-after-deployment>
```

**Note:**
- Get `MONGO_URI` from your MongoDB Atlas dashboard
- Copy `JWT_SECRET` from `server/.env` file (keep this secret!)
- Update `CLIENT_URL` with your actual frontend URL once deployed

#### Frontend Environment Variables (saintmisty-frontend)

Set this in the Render dashboard for the frontend service:

```
REACT_APP_API_URL=https://saintmisty-api.onrender.com
```

**Note:** Update with your actual backend URL once deployed.

### 3. Deploy

1. After configuring environment variables, click "Apply" in Render
2. Render will:
   - Install dependencies for both services
   - Build the React frontend
   - Start the Node.js backend
   - Deploy both services

### 4. Update Cross-Service URLs

After both services are deployed:

1. Copy the backend URL (e.g., `https://saintmisty-api.onrender.com`)
2. Update `REACT_APP_API_URL` in frontend environment variables
3. Copy the frontend URL (e.g., `https://saintmisty-frontend.onrender.com`)
4. Update `CLIENT_URL` in backend environment variables
5. Redeploy both services

### 5. Test Your Deployment

1. Visit your frontend URL
2. Test key functionality:
   - Browse blog posts
   - View photos/videos
   - Subscribe to newsletter
   - Admin login
   - Create/edit content (admin)

## MongoDB Atlas Access

Make sure MongoDB Atlas allows connections from Render:

1. Go to MongoDB Atlas → Network Access
2. Ensure "0.0.0.0/0" is in the IP whitelist (allows all IPs)
   - Or add specific Render IP ranges if available

## Troubleshooting

### Backend won't start
- Check MongoDB connection string is correct
- Verify JWT_SECRET is set
- Check Render logs for specific errors

### Frontend can't connect to backend
- Verify REACT_APP_API_URL is correct
- Check CORS settings allow your frontend URL
- Verify backend is running and accessible

### Images not loading
- Ensure uploads folder persists (Render ephemeral storage may clear on redeploy)
- Consider using cloud storage (AWS S3, Cloudinary) for production images

## Free Tier Limitations

Render's free tier:
- Services spin down after 15 minutes of inactivity
- First request after spin-down will be slow (~30 seconds)
- Consider upgrading for production use

## Alternative: Single Service Deployment

If you prefer to serve the React app from the Express server:

1. Build React app: `cd client && npm run build`
2. Update server.js to serve static files:
   ```javascript
   app.use(express.static(path.join(__dirname, '../client/build')));
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../client/build/index.html'));
   });
   ```
3. Deploy only the backend service
4. Remove frontend service from render.yaml
