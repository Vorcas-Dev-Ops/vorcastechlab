# Deployment Guide - Hostinger Node.js

## Step-by-Step Deployment Instructions

### Prerequisites
- GitHub repository created and linked to your project
- Hostinger account with Node.js support
- Domain `vorcastechlab.com` added to Hostinger

### Local Setup (Before Pushing to GitHub)

1. **Install Dependencies**
   ```bash
   npm install
   cd server
   npm install
   cd ..
   ```

2. **Create Environment Variables**
   - Copy `server/.env` with your actual credentials
   - Make sure `server/.env` is in `.gitignore` (already done)
   - Example values in `.env.example`

3. **Build React Frontend**
   ```bash
   npm run build
   ```
   This creates the `dist/` folder with all frontend files.

4. **Test Locally**
   ```bash
   npm start
   ```
   Visit `http://localhost:5000` - should see your website

### GitHub Deployment

1. **Commit and Push**
   ```bash
   git add .
   git commit -m "Setup deployment configuration"
   git push origin main
   ```

2. **Hostinger Configuration**
   - Go to Hostinger Dashboard → Web Apps → Node.js
   - Click "Create New App"
   - Select your domain: `vorcastechlab.com`
   - Repository: `your-github-username/vorcastechlab`
   - Branch: `main`
   - **Start Command**: `npm install && npm run build && npm start`
   - **Environment Variables**: Add these in Hostinger panel:
     ```
     PORT=5000
     DATABASE_URL=your_neon_db_url
     JWT_SECRET=your_secret_key
     MAIL_HOST=smtp.hostinger.com
     MAIL_PORT=465
     MAIL_USER=support@vorcastechlab.com
     MAIL_PASS=your_password
     ```

3. **Deploy**
   - Click Deploy
   - Wait for build to complete (5-10 minutes)
   - Check logs if any errors

### Troubleshooting 503 Error

**Common Issues & Solutions:**

1. **Missing Dist Folder**
   - ❌ `dist/` is in `.gitignore` (correct for development)
   - ✅ Hostinger will build it: `npm run build` in start command

2. **Port Not Listening**
   - ✅ Server now listens on `0.0.0.0:5000`
   - Hostinger will forward traffic to this port

3. **Database Connection**
   - Check `DATABASE_URL` in Hostinger environment variables
   - Ensure Neon database allows connections from Hostinger IP

4. **API Routes Not Working**
   - API endpoints: `/api/auth`, `/api/projects`, `/api/blogs`, etc.
   - Server now properly routes API requests

5. **Static Files Not Serving**
   - React build should be in `dist/` folder
   - Server serves from `../dist` directory
   - Falls back to `index.html` for SPA routing

### Monitoring & Logs

- Check Hostinger logs after deployment
- Look for: "Server running on port 5000"
- Check for database connection errors
- Check for missing environment variables

### After Successful Deployment

1. Visit `https://vorcastechlab.com`
2. Test navigation between pages
3. Check console for API errors
4. Test admin login
5. Test contact form

### Auto-Deployment

- Any push to `main` branch will trigger automatic rebuild
- Hostinger will run: `npm install && npm run build && npm start`
- Logs available in Hostinger dashboard

### Important Notes

- `.env` file is not pushed to GitHub (security best practice)
- Set environment variables in Hostinger dashboard instead
- `dist/` folder is auto-generated during build
- The server serves both React frontend and API
- Database connection must be accessible from Hostinger servers

### Performance Tips

- Ensure database URL uses connection pooling (already set in your Neon URL)
- Consider caching strategies for static assets
- Monitor server logs for bottlenecks
