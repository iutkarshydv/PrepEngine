# Vercel Deployment Guide for PrepEngine

## Quick Start

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Add Vercel configuration"
   git push origin main
   ```

2. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Select your PrepEngine repository
   - Click "Deploy"

3. **Done!** Vercel will automatically:
   - Detect the `vercel.json` configuration
   - Build and deploy your application
   - Provide you with a live URL

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd d:\GitHub\PrepEngine
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? Y
   - Which scope? (Select your account)
   - Link to existing project? N
   - What's your project's name? prepengine
   - In which directory is your code located? ./
   - Want to override the settings? N

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

## Configuration Files Created

### 1. `vercel.json`
- Configures serverless function for Express backend
- Sets up routing for API and static files
- Environment variables configuration

### 2. `.vercelignore`
- Excludes unnecessary files from deployment
- Reduces deployment size and time

### 3. Modified `server/server.js`
- Added export for Vercel serverless compatibility
- Detects Vercel environment to skip local server startup
- Maintains local development capability

## Environment Variables (Optional)

If you plan to use MongoDB or other services, add these in Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add the following:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: production

## Post-Deployment

After deployment:
- Your frontend will be available at the Vercel URL
- API endpoints will be at `https://your-app.vercel.app/api/*`
- Test the following endpoints:
  - `https://your-app.vercel.app/api/courses`
  - `https://your-app.vercel.app/api/auth`

## Local Development

The project still works locally:
```bash
cd server
npm install
node server.js
```

Server runs on `http://localhost:3000`

## Troubleshooting

### Issue: API routes not working
- Check that `vercel.json` is in the root directory
- Verify routes configuration in `vercel.json`

### Issue: Build fails
- Ensure all dependencies are in `server/package.json`
- Check Vercel build logs for specific errors

### Issue: Database files not accessible
- Vercel serverless functions have read-only file system
- Consider moving to MongoDB or using Vercel's storage solutions

## Important Notes

⚠️ **File System Access**: Vercel serverless functions have read-only access to the file system. Your `database/` folder will be bundled but cannot be modified at runtime. Consider:
- Using MongoDB Atlas for production data
- Using Vercel KV or other serverless databases
- Keeping the file-based system for read-only demo data

✅ **Best Practices**:
- Use environment variables for sensitive data
- Enable automatic deployments from GitHub
- Set up custom domain in Vercel dashboard
- Monitor usage in Vercel analytics

## Next Steps

1. ✅ Configuration files created
2. ⬜ Push to GitHub
3. ⬜ Deploy to Vercel
4. ⬜ Test API endpoints
5. ⬜ Configure custom domain (optional)
6. ⬜ Set up MongoDB for production (optional)

---

For more information, visit [Vercel Documentation](https://vercel.com/docs)
