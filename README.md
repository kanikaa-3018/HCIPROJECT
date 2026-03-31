# Mess Menu & Feedback System

A full-stack web application for managing mess menus, collecting student feedback, and providing admin analytics.

## Project Structure

```
HCIPROJECT/
├── frontend/              # React + Vite frontend app
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
├── backend/               # Node.js + Express API server
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── ...
└── [Documentation]
```

## Quick Start

### Step 1: Setup Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### Step 2: Setup Frontend (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Tech Stack

**Frontend:**
- React 18.2
- Tailwind CSS 3.3
- React Router 6
- Zustand (state management)
- Axios (HTTP client)
- Recharts (data visualization)

**Backend:**
- Node.js + Express 4.18
- MongoDB (Mongoose ODM)
- JWT authentication
- bcryptjs (password hashing)

## Features

✅ User Authentication (Register/Login)  
✅ Daily & Weekly Menus  
✅ Meal Ratings (1-5 stars)  
✅ Feedback Collection  
✅ Admin Dashboard with Analytics  
✅ Reports & Trending Data  
✅ Role-Based Access Control  

## Documentation

- [**QUICK_REFERENCE.md**](QUICK_REFERENCE.md) - Quick start guide & API reference
- [**BACKEND_SETUP.md**](BACKEND_SETUP.md) - Backend setup & MongoDB configuration
- [**INTEGRATION_GUIDE.md**](INTEGRATION_GUIDE.md) - Frontend-backend integration & workflows
- [**BACKEND_IMPLEMENTATION_SUMMARY.md**](BACKEND_IMPLEMENTATION_SUMMARY.md) - Complete implementation details

## User Roles

- **Student** (btech/mtech/phd) - View menus, rate meals, submit feedback
- **Admin** (warden) - Manage menus, view analytics, resolve feedback

## Environment Setup

Create `.env` in the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mess-menu-system
JWT_SECRET=your_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Getting Started

1. Install MongoDB locally or use MongoDB Atlas
2. Clone and install frontend dependencies: `cd frontend && npm install`
3. Clone and install backend dependencies: `cd backend && npm install`
4. Start backend: `cd backend && npm run dev`
5. Start frontend in new terminal: `cd frontend && npm run dev`
6. Open http://localhost:5173 in browser

## Next Steps

- Test the system with real data
- Deploy to production
- Enable additional features from roadmap
