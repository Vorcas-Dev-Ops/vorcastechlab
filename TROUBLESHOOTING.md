# 503 Error Troubleshooting Guide

## Quick Fixes (Try These First)

### 1. **Verify Environment Variables in Hostinger**
Go to Hostinger Dashboard → Your Node.js App → Environment Variables

**Required Variables:**
```
PORT=5000
DATABASE_URL=postgresql://user:pass@host/dbname
JWT_SECRET=your_secret_key_here
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=465
MAIL_USER=your_email@vorcastechlab.com
MAIL_PASS=your_password
```

❌ **If DATABASE_URL is missing** → Server crashes on startup
✅ **Add it and redeploy**

### 2. **Update Start Command in Hostinger**
Make sure the start command is:
```
npm install && npm run build && npm start
```

### 3. **Check Application Logs**
In Hostinger Dashboard → Logs → Application Logs
- Look for "Server running on port 5000" (success)
- Look for any error messages
- Share logs if you see errors

---

## Common Issues & Solutions

### Issue A: "DATABASE_URL is not defined"
**Cause:** Environment variable not set in Hostinger
**Fix:**
1. Go to Hostinger Node.js app settings
2. Add environment variable: `DATABASE_URL=your_neon_url`
3. Redeploy

### Issue B: "Cannot find module 'express'"
**Cause:** npm install didn't run
**Fix:**
Make sure start command includes: `npm install &&`

### Issue C: "ENOENT: no such file or directory, open '/dist/index.html'"
**Cause:** React build didn't complete
**Fix:**
1. Ensure `npm run build` is in start command
2. Check build logs for errors
3. Redeploy

### Issue D: "Port 5000 already in use"
**Cause:** Another process using the port
**Fix:**
- Hostinger should handle this automatically
- Try changing PORT to 3000 or 8000

---

## Debugging Steps

### Step 1: Check Build Output
Your build log shows:
```
✓ built in 5.29s
dist/index.html                     2.71 kB
```
✅ This is successful - dist folder was created

### Step 2: Check if dist/ folder exists
After build, you should have:
```
/dist
  ├── index.html
  ├── assets/
  │   ├── index-*.js
  │   └── index-*.css
```

### Step 3: Verify Server Code
Server should:
- ✅ Serve static files from `../dist`
- ✅ Handle API routes at `/api/*`
- ✅ Fall back to `index.html` for SPA routing
- ✅ Listen on `0.0.0.0:5000`

### Step 4: Test Health Endpoint
Once deployed, try:
```
https://vorcastechlab.com/api/health
```
Should return: `{"status":"Server is running"}`

---

## Most Likely Cause of Your 503

Based on the build logs (which look good), the issue is probably:

**1. DATABASE_URL not set in Hostinger** (90% likely)
   - Server tries to connect to DB on startup
   - Connection fails → server crashes
   - Result: 503 error

**2. Node.js server not starting at all**
   - Check Hostinger logs for actual error
   - Might be missing environment variable

---

## Solution Checklist

- [ ] **Verify all environment variables are in Hostinger dashboard**
  - DATABASE_URL (required!)
  - JWT_SECRET
  - MAIL_* variables

- [ ] **Check start command is correct:**
  ```
  npm install && npm run build && npm start
  ```

- [ ] **Redeploy the app**

- [ ] **Wait 5 minutes for deployment to complete**

- [ ] **Check logs in Hostinger** for actual error

- [ ] **Test health endpoint:**
  ```
  https://vorcastechlab.com/api/health
  ```

- [ ] **If still 503, share the actual error logs**

---

## What Changed to Fix This

1. **Improved database connection handling** - Server won't crash if DB fails
2. **Added logging** - Shows exactly what's happening
3. **Added health check endpoint** - Easy to test server is running
4. **Better error messages** - Clear indication of what's missing
5. **Fixed deprecated lenis package** - Uses newer 'lenis' package

---

## If Still Getting 503

1. **Share Hostinger Application Logs** (the actual error message)
2. **Confirm all environment variables are set**
3. **Check if DATABASE_URL is valid and accessible**
4. **Verify port 5000 is available**

The fact that the build succeeded means the problem is in the Node.js server startup, not the React build. Focus on environment variables!
