# Complete Deployment Guide for FinAI

## Phase 1: Backend Deployment (Render)

### Step 1: Push Code to GitHub
1. Create a GitHub account at [github.com](https://github.com) if you don't have one
2. Create a new repository called `finai-app`
3. In your terminal, run:
   ```
   git remote add origin https://github.com/YOUR_USERNAME/finai-app.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Render (5-10 minutes)

1. **Create Render Account**:
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**:
   - Click "New" → "Web Service"
   - Select your `finai-app` repository
   - Click "Connect"

3. **Configure Web Service**:
   - **Name**: finai-backend (or your preferred name)
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt && python init_db.py`
   - **Start Command**: `python start.py`
   - **Plan**: Free (for testing) or Starter ($7/month for production)

4. **Set Environment Variables**:
   In the "Environment" tab, add:
   ```
   DATABASE_URL=postgresql://... (leave empty, will be auto-populated)
   SECRET_KEY=vc9cXz6W36Ff1YJ0DisAqTNuZSt3LYn9t72xaOMtARE
   OPENAI_API_KEY=your-openai-api-key-here
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   ```

5. **Add PostgreSQL Database**:
   - In Render dashboard, click "New" → "PostgreSQL"
   - **Name**: finai-db
   - **Database**: finai_db
   - **User**: finai_user
   - **Region**: Same as your web service
   - Click "Create"

6. **Connect Database to Web Service**:
   - In Web Service settings, add environment variable:
     - **Key**: DATABASE_URL
     - **Value**: Copy from PostgreSQL service (it will be auto-populated)

7. **Deploy**:
   - Render will automatically deploy when you click "Create"
   - Wait for the build to complete (2-3 minutes)
   - Once deployed, you'll get a URL like: `https://finai-backend.onrender.com`

### Step 3: Test Backend
Once deployed, test these endpoints:
```
https://finai-backend.onrender.com/health
https://finai-backend.onrender.com/docs
```

**Note your backend URL**: You'll need this for frontend deployment.

---

## Phase 2: Frontend Deployment (Netlify)

### Step 1: Prepare Frontend Files

1. Create a `frontend` folder (or use your existing HTML files)
2. Update `script.js` with your Render backend URL:
   ```javascript
   const RENDER_BACKEND_URL = 'https://finai-backend.onrender.com'; // Replace with your actual URL
   const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:8000' : RENDER_BACKEND_URL;
   ```

3. Files to deploy:
   - index.html
   - script.js
   - styles.css
   - portfolio.html
   - insights.html
   - analysis.html
   - transactions.html
   - settings.html

### Step 2: Deploy to Netlify (2-5 minutes)

**Option A: Using Netlify Drag & Drop (Easiest)**

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Drag and drop your `frontend` folder into the Netlify drop zone
4. Your site will be live in seconds!

**Option B: Using Netlify CLI**

1. Install Netlify CLI:
   ```
   npm install -g netlify-cli
   ```

2. Deploy:
   ```
   netlify deploy --prod --dir=.
   ```

### Step 3: Update CORS in Backend

1. Go to Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Update `CORS_ORIGINS` variable:
   ```
   CORS_ORIGINS=https://your-netlify-site.netlify.app,http://localhost:3000
   ```

5. Click "Save" (will trigger redeployment, takes 1-2 minutes)

### Step 4: Test Frontend
Once deployed, your site will be live at a URL like:
```
https://your-site-name.netlify.app
```

Test by:
1. Opening the URL
2. Clicking navigation links
3. Testing API calls from the frontend

---

## Phase 3: Verification & Setup

### Pre-Deployment Checklist:
- ✅ Backend database initialized (init_db.py)
- ✅ SECRET_KEY generated and set
- ✅ Git repository initialized
- ✅ .gitignore configured
- ✅ script.js updated with API URL
- ✅ CORS settings configured

### Post-Deployment Checklist:
- [ ] Backend health check (`/health` endpoint)
- [ ] Database connection verified
- [ ] API endpoints working (`/docs` shows Swagger UI)
- [ ] Frontend loads without errors
- [ ] API calls work from frontend to backend
- [ ] CORS errors resolved

---

## Troubleshooting

### Backend Won't Deploy
- Check logs in Render dashboard: "Logs" tab
- Ensure DATABASE_URL is set in environment
- Verify SECRET_KEY is not "change-me-in-production"

### CORS Errors in Frontend
- Update CORS_ORIGINS in backend environment variables
- Include protocol (https://) and NO trailing slash
- Example: `https://your-site.netlify.app`

### Database Connection Issues
- Verify DATABASE_URL format: `postgresql://user:password@host:port/database`
- Ensure PostgreSQL service is running in Render
- Check if database credentials are correct

### Frontend Can't Reach Backend
- Verify backend URL in script.js
- Check browser console (F12) for errors
- Ensure CORS is properly configured
- Test with curl: `curl https://your-backend/health`

---

## Important Links

- **Backend URL**: https://finai-backend.onrender.com (will be different for you)
- **Frontend URL**: https://your-site.netlify.app (will be different for you)
- **Render Dashboard**: https://dashboard.render.com
- **Netlify Dashboard**: https://app.netlify.com

---

## Next Steps After Deployment

1. Monitor performance in Render dashboard
2. Set up error logging (Sentry, LogRocket)
3. Enable database backups
4. Configure custom domain (optional)
5. Set up CI/CD for automatic deployments

Enjoy your deployed FinAI application! 🚀
