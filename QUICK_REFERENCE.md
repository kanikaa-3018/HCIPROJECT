# Quick Reference Guide

## 📁 Project Structure Overview

```
HCIPROJECT/
│
├── 📂 backend/                          ← Node.js + Express Backend
│   ├── src/
│   │   ├── server.js                    ← Main entry point
│   │   ├── routes/                      ← API endpoints
│   │   │   ├── auth.js                  ← /api/auth
│   │   │   ├── menu.js                  ← /api/menu
│   │   │   ├── rating.js                ← /api/rating
│   │   │   ├── feedback.js              ← /api/feedback
│   │   │   └── admin.js                 ← /api/admin
│   │   ├── controllers/                 ← Business logic
│   │   │   ├── authController.js
│   │   │   ├── menuController.js
│   │   │   ├── ratingController.js
│   │   │   ├── feedbackController.js
│   │   │   └── adminController.js
│   │   ├── models/                      ← MongoDB schemas
│   │   │   ├── User.js
│   │   │   ├── Menu.js
│   │   │   ├── Rating.js
│   │   │   └── Feedback.js
│   │   ├── middleware/
│   │   │   └── auth.js                  ← JWT & role validation
│   │   └── utils/                       ← Helper functions
│   ├── .env                             ← Config (not in git)
│   ├── package.json                     ← Dependencies
│   ├── API_DOCUMENTATION.md             ← Full API reference
│   └── README.md                        ← Backend setup
│
├── 📂 src/                              ← React Frontend
│   ├── App.jsx                          ← Main component
│   ├── main.jsx                         ← Entry point
│   ├── index.css                        ← Global styles
│   ├── 📂 components/                   ← Reusable UI
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── FeedbackItem.jsx
│   │   ├── Input.jsx
│   │   ├── MealCard.jsx
│   │   ├── Select.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StarRating.jsx
│   │   ├── SkeletonLoader.jsx
│   │   ├── Toast.jsx
│   │   └── ...
│   ├── 📂 pages/                        ← Page components
│   │   ├── Login.jsx                    ← /login
│   │   ├── StudentDashboard.jsx         ← /dashboard
│   │   ├── DailyMenu.jsx                ← /menu
│   │   ├── WeeklyMenu.jsx               ← /menu/weekly
│   │   ├── FeedbackPage.jsx             ← /feedback
│   │   ├── AdminDashboard.jsx           ← /admin
│   │   └── ReportsPage.jsx              ← /admin/reports
│   ├── 📂 layouts/
│   │   └── MainLayout.jsx               ← Sidebar layout
│   ├── 📂 services/
│   │   └── api.js                       ← ⭐ Backend API calls
│   └── 📂 store/
│       ├── authStore.js                 ← Auth state (Zustand)
│       ├── themeStore.js                ← Theme state
│       └── toastStore.js                ← Toast state
│
├── 📄 Documentation Files
│   ├── README.md                        ← Project overview
│   ├── SETUP_GUIDE.md                   ← How to setup
│   ├── PROJECT_SUMMARY.md               ← Features list
│   ├── ARCHITECTURE.md                  ← Tech stack
│   ├── COMPONENTS.md                    ← Component details
│   ├── FEATURES.md                      ← Feature checklist
│   ├── BACKEND_SETUP.md                 ← ⭐ Backend guide
│   ├── INTEGRATION_GUIDE.md             ← ⭐ Frontend-Backend
│   ├── USER_INTERVIEW_FEEDBACK.md       ← User testing feedback
│   └── FOLDER_STRUCTURE.txt             ← File organization
│
├── Config Files
│   ├── package.json                     ← Frontend deps
│   ├── vite.config.js                   ← Vite config
│   ├── tailwind.config.js               ← Tailwind config
│   ├── postcss.config.js                ← PostCSS config
│   └── index.html                       ← HTML template
│
└── 🔧 Other Files
    ├── .env.example
    ├── .eslintrc.json
    ├── .gitignore
    └── node_modules/
```

---

## 🚀 Quick Start (5 minutes)

### 1️⃣ Install MongoDB
- Download from https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### 2️⃣ Backend Setup
```bash
cd backend
npm install
npm run dev
```
✅ Backend running on http://localhost:5000

### 3️⃣ Frontend Setup (New Terminal)
```bash
npm install
npm run dev
```
✅ Frontend running on http://localhost:5173

### 4️⃣ Test Login
- Register a new account or login with test credentials
- Explore the app!

---

## 📡 API Quick Reference

### Base URL
```
http://localhost:5000/api
```

### Main Routes

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/auth/register` | POST | ❌ | Create new user |
| `/auth/login` | POST | ❌ | Login user |
| `/menu/today` | GET | ❌ | Today's menu |
| `/menu/weekly` | GET | ❌ | Weekly menu |
| `/rating/submit` | POST | ✅ | Submit rating |
| `/rating/averages` | GET | ❌ | Get avg ratings |
| `/feedback/submit` | POST | ✅ | Submit feedback |
| `/feedback/all` | GET | ✅🔐 | All feedback (admin) |
| `/admin/analytics` | GET | ✅🔐 | Get analytics (admin) |
| `/admin/report` | GET | ✅🔐 | Generate report (admin) |

**Auth Legend:**
- ❌ = No authentication needed
- ✅ = JWT token required
- 🔐 = Admin/Warden only

---

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mess-menu-system
JWT_SECRET=your_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend
Already configured to use `http://localhost:5000/api`

---

## 👥 User Roles

| Role | Features | Access Level |
|------|----------|--------------|
| **BTech Student** | View menu, Rate meals, Submit feedback | Student |
| **MTech Student** | Same as BTech | Student |
| **PhD Student** | Same as BTech | Student |
| **Warden (Admin)** | View analytics, Generate reports, Manage feedback | Admin |

---

## 📊 Database Collections

### Users
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  rollNumber: String,
  role: String ("btech", "mtech", "phd", "warden"),
  createdAt: Date
}
```

### Menus
```javascript
{
  date: Date,
  dayOfWeek: String,
  meals: [
    {
      name: String,
      type: String ("veg", "non-veg"),
      description: String,
      timeSlot: String ("breakfast", "lunch", "dinner")
    }
  ]
}
```

### Ratings
```javascript
{
  userId: ObjectId,
  mealId: ObjectId,
  mealName: String,
  rating: Number (1-5),
  date: Date
}
```

### Feedbacks
```javascript
{
  userId: ObjectId,
  mealName: String,
  issueType: String ("taste", "hygiene", "quantity", "other"),
  comment: String (max 400),
  isAnonymous: Boolean,
  status: String ("pending", "reviewed", "resolved")
}
```

---

## 🔐 Authentication Flow

```
1. User submits login form
   ↓
2. Frontend calls authAPI.login()
   ↓
3. Backend verifies credentials
   ↓
4. JWT token generated
   ↓
5. Token sent to frontend
   ↓
6. Token stored in localStorage
   ↓
7. Token added to all future requests (Authorization header)
```

---

## 🔄 Frontend-Backend Communication

```
Frontend Component
   ↓
Import from src/services/api.js
   ↓
Call API method (e.g., ratingAPI.submitRating())
   ↓
Axios sends HTTP request to backend
   ↓
Backend middleware checks JWT token
   ↓
Backend controller processes request
   ↓
MongoDB query/update
   ↓
Backend returns JSON response
   ↓
Frontend handles response
   ↓
Update state/UI
   ↓
Show success/error message to user
```

---

## 🧪 Common Testing Scenarios

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "password": "pass123",
    "rollNumber": "20BTS001",
    "role": "btech"
  }'
```

### Test Login & Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "pass123"
  }'
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:5000/api/admin/analytics \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## 📱 Frontend Features

- ✅ Login/Signup with role selection
- ✅ Student Dashboard with quick stats
- ✅ Daily menu with time slots (7-10am, 12-2pm, etc)
- ✅ Weekly menu calendar view
- ✅ 1-5 star rating system
- ✅ Anonymous feedback submission
- ✅ Feedback form with categories
- ✅ Admin dashboard with charts
- ✅ Weekly reports generation
- ✅ Responsive design (mobile-friendly)
- ✅ Toast notifications
- ✅ Dark/Light theme ready

---

## 🖼️ Page Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/login` | Login.jsx | Public |
| `/dashboard` | StudentDashboard.jsx | Students |
| `/menu` | DailyMenu.jsx | Students |
| `/menu/weekly` | WeeklyMenu.jsx | Students |
| `/feedback` | FeedbackPage.jsx | Students |
| `/admin` | AdminDashboard.jsx | Admin |
| `/admin/reports` | ReportsPage.jsx | Admin |

---

## 📚 Important Files to Know

| File | Purpose |
|------|---------|
| `backend/src/server.js` | Backend entry point |
| `src/services/api.js` | All API calls → Backend |
| `src/store/authStore.js` | User auth state |
| `backend/.env` | Backend configuration |
| `INTEGRATION_GUIDE.md` | How frontend talks to backend |
| `backend/API_DOCUMENTATION.md` | Full API reference |

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongod`
- Check port 5000 is free
- Check .env configuration

### Frontend won't connect to backend
- Ensure backend is running on 5000
- Check browser console for errors
- Check CORS settings in backend

### Login fails
- Verify email/password are correct
- Check MongoDB has user collection
- Check JWT_SECRET in .env

### Ratings not saving
- Ensure you have valid JWT token
- Check MongoDB is storing ratings
- Check browser console for errors

---

## 🔗 Useful Commands

```bash
# Backend
cd backend
npm install               # Install deps
npm run dev              # Start dev server
npm start                # Start production

# Frontend
npm install              # Install deps
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview build

# MongoDB
mongod                   # Start MongoDB locally
mongo                    # Connect to MongoDB shell
```

---

## 📖 Documentation Index

1. **SETUP_GUIDE.md** - Initial project setup
2. **BACKEND_SETUP.md** - Backend installation & configuration ⭐
3. **INTEGRATION_GUIDE.md** - How frontend-backend work together ⭐
4. **API_DOCUMENTATION.md** - Detailed API endpoints (backend/) ⭐
5. **PROJECT_SUMMARY.md** - Features implementation
6. **ARCHITECTURE.md** - Tech stack overview
7. **USER_INTERVIEW_FEEDBACK.md** - User testing results

**⭐ = Most useful for dev**

---

## ✅ Checklist: Everything is Ready

- ✅ Backend folder created with full structure
- ✅ Database models (User, Menu, Rating, Feedback)
- ✅ API routes for all features
- ✅ Authentication middleware with JWT
- ✅ Role-based access control
- ✅ Frontend API service updated
- ✅ Frontend stores auth token
- ✅ All API calls properly configured
- ✅ Error handling in place
- ✅ Documentation complete

---

## 🎯 Next Steps

1. **Install MongoDB** if not already done
2. **Run backend**: `npm run dev` (in backend folder)
3. **Run frontend**: `npm run dev` (in root folder)
4. **Register a test account**
5. **Login and explore the app**
6. **Test all features**
7. **Check admin dashboard** (use role: "warden" when registering admin)

---

## 🚀 You're all set!

The complete frontend-backend system is ready to use.  
Happy coding! ✨

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** March 31, 2026
