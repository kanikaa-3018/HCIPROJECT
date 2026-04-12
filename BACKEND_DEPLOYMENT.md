# Backend Deployment Guide

## Deployment Platforms

Choose one of the following platforms for deploying your Node.js backend:

### 1. **Heroku** (Recommended for beginners)
```bash
# Install Heroku CLI
# Then in backend directory:
heroku login
heroku create your-app-name
git push heroku main
```

**Procfile** (create in backend root):
```
web: npm start
```

### 2. **Railway** (Easiest with MongoDB)
1. Go to https://railway.app
2. Connect your GitHub repository
3. Set environment variables in Railway dashboard:
   - `PORT=5000`
   - `MONGODB_URI=your_mongodb_uri`
   - `JWT_SECRET=your_secret`
   - `NODE_ENV=production`

### 3. **Render**
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repo
4. Set environment variables
5. Deploy

### 4. **AWS/Azure/DigitalOcean**
- Deploy as standard Node.js application
- Ensure environment variables are set
- MongoDB must be accessible from deployment server

## Environment Variables for Production

Update `.env` file with production values:

```bash
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mess-menu-system
JWT_SECRET=your-secure-random-secret-key-here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

⚠️ **Important:**
- Use MongoDB Atlas (cloud) for production, not local MongoDB
- Generate strong JWT_SECRET (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- Update FRONTEND_URL to your frontend deployment URL
- Never commit `.env` file to git

## Local Deployment Testing

Before deploying, test locally:

```bash
# Terminal 1: Start MongoDB (if local)
mongod

# Terminal 2: Start backend
npm start
```

Should see:
```
Server running on http://localhost:5000
Connected to MongoDB
```

## Production Build Commands

```bash
# These commands should work now:
npm run build   # No-op (Node doesn't need build)
npm start       # Starts production server
npm run dev     # Development with auto-reload
```

## Common Deployment Errors & Fixes

### Error: "Cannot find module"
```bash
# Solution: Reinstall dependencies
rm -rf node_modules
npm install
```

### Error: "Connection refused" (MongoDB)
- Check `MONGODB_URI` is correct
- For MongoDB Atlas, whitelist your server IP
- Test connection locally first

### Error: "CORS error" in frontend
- Check `FRONTEND_URL` in backend `.env`
- Verify API routes have CORS middleware enabled
- Frontend must call correct API URL from `.env`

### Port already in use
```bash
# Change PORT in .env or:
# Find and kill process on port:
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

## Deployment Checklist

- [ ] `.env` file created with production values
- [ ] MongoDB URI is set correctly
- [ ] JWT_SECRET is a strong random string
- [ ] FRONTEND_URL matches your frontend deployment
- [ ] All dependencies installed (`npm install`)
- [ ] No `node_modules` or `.env` in git
- [ ] Backend starts without errors: `npm start`
- [ ] API endpoints respond: `curl http://localhost:5000/api/menu/today`

## Post-Deployment

1. Test API endpoints are working
2. Check database connections
3. Verify CORS is allowing frontend requests
4. Monitor logs for errors
5. Set up error tracking (Sentry, etc.)
