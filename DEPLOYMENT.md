# 🚀 Deployment Guide - Fantasy Football Playoff Calculator

## Quick Overview
We'll deploy your app to two free services:
- **Backend (Python/FastAPI)**: Render.com (Free tier)
- **Frontend (React)**: Vercel (Free tier)

Total time: ~15 minutes
Total cost: **$0** (completely free!)

---

## Part 1: Deploy Backend to Render

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `fantasy-playoff-calculator`
3. Make it **Public** (required for free tier)
4. Click "Create repository"

### Step 2: Push Your Code to GitHub
Run these commands in your terminal:

```bash
cd /Users/af492l/.gemini/antigravity/scratch/nfl_fantasy_playoff_calculator
git remote add origin https://github.com/YOUR_USERNAME/fantasy-playoff-calculator.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 3: Deploy on Render
1. Go to https://render.com and sign up (use GitHub to sign in)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `fantasy-calculator-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Select **Free**
5. Click "Create Web Service"

⏳ Wait 3-5 minutes for deployment to complete.

### Step 4: Get Your Backend URL
Once deployed, you'll see a URL like:
```
https://fantasy-calculator-api.onrender.com
```

**Copy this URL** - you'll need it for the frontend!

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Install Vercel CLI (Optional - or use web interface)

#### Option A: Use Vercel Website (Easier)
1. Go to https://vercel.com and sign up (use GitHub)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - Key: `VITE_API_URL`
     - Value: `https://fantasy-calculator-api.onrender.com` (your Render URL)
5. Click "Deploy"

#### Option B: Use CLI (Faster)
```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

When prompted:
- Set up and deploy? **Y**
- Which scope? (Select your account)
- Link to existing project? **N**
- Project name? `fantasy-playoff-calculator`
- Directory? `./` (current directory)
- Override settings? **Y**
- Build Command? `npm run build`
- Output Directory? `dist`
- Development Command? `npm run dev`

Then set environment variable:
```bash
vercel env add VITE_API_URL
```
Paste your Render URL when prompted.

Finally, deploy to production:
```bash
vercel --prod
```

### Step 2: Get Your Frontend URL
You'll get a URL like:
```
https://fantasy-playoff-calculator.vercel.app
```

---

## 🎉 You're Live!

Your app is now online at:
- **Frontend**: https://fantasy-playoff-calculator.vercel.app
- **Backend API**: https://fantasy-calculator-api.onrender.com

Share the frontend URL with your friends!

---

## ⚠️ Important Notes

### Free Tier Limitations:
1. **Render Backend**:
   - Sleeps after 15 minutes of inactivity
   - Takes ~30 seconds to wake up on first request
   - 750 hours/month free (plenty for testing)

2. **Vercel Frontend**:
   - Unlimited bandwidth
   - Fast CDN
   - No sleep time

### First Request Might Be Slow:
When your friends first visit, the backend might take 30 seconds to wake up. After that, it's fast!

---

## 🔧 Making Updates

### Update Frontend:
```bash
cd frontend
# Make your changes
git add .
git commit -m "Update frontend"
git push
```
Vercel auto-deploys on push!

### Update Backend:
```bash
cd /Users/af492l/.gemini/antigravity/scratch/nfl_fantasy_playoff_calculator
# Make your changes
git add .
git commit -m "Update backend"
git push
```
Render auto-deploys on push!

---

## 🐛 Troubleshooting

### Backend not working?
1. Check Render logs: Dashboard → Your Service → Logs
2. Make sure environment is set to Python 3
3. Verify build command includes `backend/requirements.txt`

### Frontend can't connect to backend?
1. Check environment variable `VITE_API_URL` in Vercel
2. Make sure it ends with no trailing slash
3. Check browser console for CORS errors

### Still having issues?
Check the logs in both Render and Vercel dashboards.

---

## 💰 Future: Upgrading (Optional)

If your app gets popular and you need to upgrade:
- **Render**: $7/month for no sleep time
- **Vercel**: Free tier is usually enough
- **Custom Domain**: $12/year (optional)

---

## Next Steps

1. Share the link with friends
2. Get feedback
3. Add "Buy Me a Coffee" button
4. Consider adding Google Analytics to track usage

Good luck! 🏈🎉
