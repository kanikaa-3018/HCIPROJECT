# Frontend-Backend Integration Guide

This document explains how the frontend and backend communicate and work together.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│              (http://localhost:5173)                     │
├─────────────────────────────────────────────────────────┤
│  Pages:                  Components:                     │
│  - Login                 - MealCard                      │
│  - StudentDashboard      - StarRating                    │
│  - DailyMenu             - FeedbackItem                  │
│  - WeeklyMenu            - Button, Input, Toast         │
│  - FeedbackPage          - SkeletonLoader                │
│  - AdminDashboard                                        │
│  - ReportsPage                                           │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ HTTP Requests
                      │ (Axios + JWT)
                      │
┌─────────────────────▼───────────────────────────────────┐
│                   API Service Layer                      │
│              (src/services/api.js)                       │
├─────────────────────────────────────────────────────────┤
│  - authAPI     - Manage authentication                  │
│  - menuAPI     - Fetch menu data                        │
│  - ratingAPI   - Submit/get ratings                     │
│  - feedbackAPI - Manage feedback                        │
│  - analyticsAPI- Get admin stats                        │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ REST API Calls
                      │ http://localhost:5000/api
                      │
┌─────────────────────▼───────────────────────────────────┐
│                   BACKEND (Node.js)                      │
│              (http://localhost:5000)                     │
├─────────────────────────────────────────────────────────┤
│  Routes:                                                 │
│  - /api/auth     - Authentication                       │
│  - /api/menu     - Menu operations                      │
│  - /api/rating   - Rating management                    │
│  - /api/feedback - Feedback operations                  │
│  - /api/admin    - Analytics & Reports                  │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ Query/Update
                      │
┌─────────────────────▼───────────────────────────────────┐
│               MongoDB Database                           │
│          (Collections: users, menus, ratings,           │
│           feedbacks)                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Examples

### Example 1: User Login

```
1. USER SEES LOGIN FORM (Frontend)
   └─ src/pages/Login.jsx renders login form

2. USER SUBMITS EMAIL & PASSWORD
   └─ Form validation happens in Login.jsx

3. FRONTEND MAKES API CALL
   └─ authAPI.login('email@example.com', 'password123')
   └─ HTTP POST to http://localhost:5000/api/auth/login
   └─ Body: { email, password }

4. BACKEND RECEIVES REQUEST
   └─ Route: post('/login')
   └─ Controller: authController.login()
   └─ Validates inputs
   └─ Finds user in database (MongoDB)
   └─ Compares password with bcrypt

5. BACKEND SENDS RESPONSE
   └─ Token generated with JWT
   └─ User data returned
   └─ HTTP 200: { token, user }

6. FRONTEND HANDLES RESPONSE
   └─ Token stored in localStorage
   └─ User info stored in Zustand authStore
   └─ Redirect to StudentDashboard

7. TOKEN USED FOR FUTURE REQUESTS
   └─ Axios interceptor adds: Authorization: Bearer <token>
```

---

### Example 2: User Rates a Meal

```
1. USER SEES MEAL CARD (Frontend: DailyMenu.jsx)
   └─ Displays meal info

2. USER HOVERS OVER STARS
   └─ StarRating.jsx shows hover effect

3. USER CLICKS ON A STAR
   └─ onClick handler calls: ratingAPI.submitRating(...)
   └─ HTTP POST to http://localhost:5000/api/rating/submit
   └─ Body: { mealId, mealName, rating, date }
   └─ Header: Authorization: Bearer <token>

4. BACKEND RECEIVES REQUEST (middleware)
   └─ authMiddleware extracts token
   └─ verifies token is valid
   └─ extracts userId from token

5. BACKEND PROCESSES RATING
   └─ Route: post('/submit')
   └─ Controller: ratingController.submitRating()
   └─ Checks if user already rated this meal
   └─ If yes: updates existing rating
   └─ If no: creates new rating in DB

6. BACKEND SAVES TO MONGODB
   └─ Document structure:
      {
        userId: "...",
        mealId: "...",
        mealName: "Aloo Sabzi",
        rating: 4,
        date: "2026-03-31"
      }

7. BACKEND SENDS RESPONSE
   └─ HTTP 201: { message, rating }

8. FRONTEND HANDLES RESPONSE
   └─ Display success toast notification
   └─ Update UI to show saved rating
   └─ User sees checkmark or confirmation
```

---

### Example 3: Admin Views Analytics

```
1. ADMIN OPENS ADMIN DASHBOARD (Frontend)
   └─ adminDashboard.jsx loads
   └─ useEffect calls analyticsAPI.getAnalytics()

2. FRONTEND MAKES API CALL
   └─ HTTP GET to http://localhost:5000/api/admin/analytics
   └─ Header: Authorization: Bearer <admin_token>

3. BACKEND RECEIVES REQUEST (middleware)
   └─ authMiddleware verifies token
   └─ adminOnly middleware checks user.role === 'warden'
   └─ If role mismatch: HTTP 403 Forbidden

4. BACKEND AGGREGATES DATA FROM MONGODB
   └─ Controller: adminController.getAnalytics()
   └─ Queries Rating collection:
      └─ Groups by mealName
      └─ Calculates averageRating
      └─ Counts totalRatings
   └─ Queries Feedback collection:
      └─ Groups by issueType
      └─ Counts each category

5. BACKEND PROCESSES & RETURNS
   ```javascript
   {
     mealRatings: [
       { _id: 'Aloo Sabzi', averageRating: 4.2, totalRatings: 42 },
       { _id: 'Dal', averageRating: 3.8, totalRatings: 38 }
     ],
     issueDistribution: [
       { _id: 'taste', count: 18 },
       { _id: 'hygiene', count: 3 }
     ],
     statistics: { ... }
   }
   ```

6. FRONTEND RECEIVES & DISPLAYS
   └─ Recharts library renders bar/pie charts
   └─ UI updates with analytics data
   └─ Admin sees visualization
```

---

### Example 4: User Submits Feedback

```
1. USER OPENS FEEDBACK FORM (Frontend: FeedbackPage.jsx)
   └─ Sees meal dropdown, issue type selector, textarea

2. USER FILLS FORM
   └─ Select meal: "Aloo Sabzi"
   └─ Select issue: "taste"
   └─ Type comment: "Could use more spices"
   └─ Toggle anonymous: false

3. USER CLICKS SUBMIT
   └─ Frontend validates form
   └─ Checks comment length <= 400 chars
   └─ Calls: feedbackAPI.submitFeedback(...)
   └─ HTTP POST to http://localhost:5000/api/feedback/submit
   └─ Body: { mealName, issueType, comment, isAnonymous }

4. BACKEND RECEIVES REQUEST
   └─ authMiddleware verifies token
   └─ studentOnly middleware allows students

5. BACKEND VALIDATES & SAVES
   └─ Checks required fields
   └─ Validates comment length
   └─ Creates document in Feedback collection
   ```javascript
   {
     userId: "...",
     mealName: "Aloo Sabzi",
     issueType: "taste",
     comment: "Could use more spices",
     isAnonymous: false,
     status: "pending",
     createdAt: new Date()
   }
   ```

6. BACKEND RESPONDS
   └─ HTTP 201: { message, feedback }

7. FRONTEND HANDLES
   └─ Shows success toast: "Feedback submitted"
   └─ Clears form
   └─ Updates UI
```

---

## 🔐 Authentication Flow

### Token-Based Authentication

```
LOGIN PROCESS:
├─ User credentials sent → Backend
├─ Backend validates password
├─ JWT token generated: { userId, email, role, exp: 7days }
├─ Token sent to Frontend
└─ Frontend stores in localStorage

SUBSEQUENT REQUESTS:
├─ Frontend retrieves token from localStorage
├─ Axios interceptor adds to header: Authorization: Bearer <token>
├─ Backend authMiddleware extracts token
├─ JWT verified and decoded
├─ User info attached to req.user
└─ Request proceeds if verified

LOGOUT:
├─ Token removed from localStorage
├─ User redirected to login
└─ Subsequent requests without token → 401 error
```

---

## 📝 API Service Layer (src/services/api.js)

All API calls go through this single service layer:

```javascript
// Example: Rating API
export const ratingAPI = {
  submitRating: async (mealId, mealName, rating, date) => {
    try {
      const response = await api.post('/rating/submit', {
        mealId, mealName, rating, date
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

// Usage in component:
import { ratingAPI } from '../services/api.js'
await ratingAPI.submitRating(mealId, name, 4, date)
```

---

## 🔌 Middleware Protection

### Protected Endpoints

```javascript
// Example: Admin-only endpoint
router.get('/analytics', 
  authMiddleware,      // Verify token
  adminOnly,          // Check role === 'warden'
  getAnalytics        // Execute handler
)

// If checks fail:
authMiddleware → 401 Unauthorized
adminOnly → 403 Forbidden
```

---

## 📊 Data Flow Diagram

```
FRONTEND                          BACKEND
────────                          ───────

User Interaction
      │
      ├─ Fill Form
      │
      └─ Click Submit
            │
            ├─ Validation
            │
            └─ API Call (Axios)
                  │
                  ├─ Add Token (interceptor)
                  │
                  └─ HTTP Request
                        │
                        ├─ Route Handler
                        │
                        ├─ Middleware (auth)
                        │
                        ├─ Controller Logic
                        │
                        ├─ MongoDB Query/Update
                        │
                        └─ Response
                              │
                              ├─ Error Check
                              │
                              ├─ Status Code
                              │
                              └─ JSON Data
                                    │
                                    ├─ Handle Response
                                    │
                                    ├─ Update UI
                                    │
                                    └─ Show Feedback (Toast)
```

---

## 🔗 Component-API Mapping

| Frontend Component | API Called | Backend Route |
|---|---|---|
| Login.jsx | authAPI.login() | POST /auth/login |
| DailyMenu.jsx | menuAPI.getDailyMenu() | GET /menu/today |
| WeeklyMenu.jsx | menuAPI.getWeeklyMenu() | GET /menu/weekly |
| StarRating.jsx (submit) | ratingAPI.submitRating() | POST /rating/submit |
| FeedbackItem.jsx | feedbackAPI.submitFeedback() | POST /feedback/submit |
| AdminDashboard.jsx | analyticsAPI.getAnalytics() | GET /admin/analytics |
| ReportsPage.jsx | analyticsAPI.generateReport() | GET /admin/report |

---

## ⚙️ Error Handling

### Frontend (api.js interceptor)

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### Backend (server.js)

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  })
})
```

---

## 🚀 Starting Both

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
npm run dev
```

Both should be running:
- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:5173

---

## 🧪 Testing Integration

### Test User Flow

1. **Register**
   - Frontend: Signup form
   - Backend: Save to DB, return token

2. **Login**
   - Frontend: Login form
   - Backend: Verify credentials, return token

3. **View Menu**
   - Frontend: Display menu
   - Backend: Fetch from DB

4. **Rate Meal**
   - Frontend: Click stars
   - Backend: Save rating to DB

5. **Submit Feedback**
   - Frontend: Fill form
   - Backend: Save feedback to DB

6. **Admin Analytics**
   - Frontend: Show charts
   - Backend: Aggregate data

---

## 📚 Key Files

**Frontend:**
- `src/services/api.js` - API service layer
- `src/store/authStore.js` - Auth state management
- `src/pages/` - Page components
- `src/components/` - Reusable components

**Backend:**
- `backend/src/server.js` - Main server
- `backend/src/routes/` - API routes
- `backend/src/controllers/` - Business logic
- `backend/src/models/` - Database schemas
- `backend/src/middleware/auth.js` - Auth protection

---

## ✅ Everything Connected!

The frontend and backend are now fully integrated and ready to work together. All API calls are properly configured and authentication is in place.

**Next Steps:**
1. Install MongoDB
2. Run backend: `npm run dev` (in backend folder)
3. Run frontend: `npm run dev` (in root)
4. Test by logging in and using the app!

---

**Happy Coding!** 🎉
