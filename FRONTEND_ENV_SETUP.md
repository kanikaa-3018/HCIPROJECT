# Frontend Environment Setup Guide

## Environment Variables

The frontend uses Vite's environment variable system. All frontend-exposed variables must be prefixed with `VITE_`.

### Available Environment Variables

| Variable | Purpose | Default | Example |
|----------|---------|---------|---------|
| `VITE_API_BASE_URL` | Backend API endpoint | `http://localhost:5000/api` | `https://api.yourdomain.com/api` |
| `VITE_APP_NAME` | Application name | `Mess Menu & Feedback System` | Custom name |
| `VITE_APP_ENV` | Environment type | `development` | `production` |

### Development Setup

1. **Development (.env)** - Used locally with `npm run dev`
```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Mess Menu & Feedback System
VITE_APP_ENV=development
```

2. **Production (.env.production)** - Used for production builds with `npm run build`
```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_APP_NAME=Mess Menu & Feedback System
VITE_APP_ENV=production
```

### How to Configure

#### For Development
Create/update `.env` file in the frontend directory:
```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_ENV=development
```

#### For Production
1. Create `.env.production` file in the frontend directory
2. Update `VITE_API_BASE_URL` to your production API URL:
```bash
VITE_API_BASE_URL=https://your-production-api.com/api
VITE_APP_ENV=production
```

3. Build the frontend:
```bash
npm run build
```

### Build Commands

```bash
# Development - uses .env
npm run dev

# Production build - uses .env.production
npm run build
```

### Important Notes

⚠️ **Security:**
- Only variables prefixed with `VITE_` are exposed to the frontend
- Never store sensitive data (API keys, secrets) in frontend env files
- Environment variables are embedded in the bundled JavaScript at build time
- They are visible to anyone who views the page source

✅ **Git Handling:**
- `.env` and `.env.production` are in `.gitignore` - they won't be committed
- Use `.env.example` as a template for your team
- Each deployment should have its own `.env.production` file

### Accessing Variables in Code

Variables are accessible via `import.meta.env`:

```javascript
// API Service (already configured)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// In components
const appName = import.meta.env.VITE_APP_NAME
const isDev = import.meta.env.VITE_APP_ENV === 'development'
```

### Troubleshooting

**Issue:** API connection fails in production
- Check that `VITE_API_BASE_URL` is correct in `.env.production`
- Verify the API is accessible from the frontend's deployment location
- Check CORS settings on the backend API

**Issue:** Environment variables not updating
- For development: Restart `npm run dev` after changing `.env`
- For production: Rebuild with `npm run build` after changing `.env.production`
- Clear browser cache and local storage if needed
