# Backend Setup Guide

## 📁 Project Structure

```
HCIPROJECT/
├── frontend/               (React + Vite)
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
├── backend/                (Node.js + Express)
│   ├── src/
│   │   ├── server.js       (Main entry point)
│   │   ├── routes/         (API endpoints)
│   │   ├── controllers/    (Business logic)
│   │   ├── models/         (MongoDB schemas)
│   │   ├── middleware/     (Auth, validation)
│   │   └── utils/          (Helper functions)
│   ├── .env                (Environment variables)
│   ├── package.json
│   └── API_DOCUMENTATION.md
└── ...
```

---

## 🛠️ Backend Installation & Setup

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin requests
- **dotenv** - Environment variables
- **express-validator** - Input validation
- **nodemon** - Development auto-reload

### Step 3: MongoDB Setup

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running locally
mongo  # or mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `.env` file with your URI

### Step 4: Environment Configuration

Update `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mess-menu-system
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 5: Start Backend Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

---

## 🎯 Frontend Connection

The frontend (React app) connects to the backend at `http://localhost:5000/api`

### Frontend Setup (if not done yet)

```bash
# Go to frontend directory (root of HCIPROJECT)
cd ..

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🔄 Frontend-Backend Interaction

### How They Connect

1. **Frontend** makes API calls to `http://localhost:5000/api`
2. **Backend** receives requests, processes them, and responds with JSON
3. Frontend displays the data to users

### Updated API Service (`src/services/api.js`)

The frontend API service has been updated to:
- Use the correct backend URL (`http://localhost:5000/api`)
- Include JWT token in request headers
- Handle authentication tokens automatically
- Redirect to login on unauthorized access

### Example Flow

**Frontend (src/components/FeedbackItem.jsx or similar):**
```javascript
import { feedbackAPI } from '../services/api.js'

// Submit feedback
const response = await feedbackAPI.submitFeedback(
  'Aloo Sabzi',
  'taste',
  'Could use more spices',
  false
)
```

**Backend (src/routes/feedback.js → src/controllers/feedbackController.js):**
```javascript
// Receives the request
// Validates data
// Saves to MongoDB
// Returns response
```

---

## 📋 Backend Features

### ✅ Authentication
- User registration
- Secure login with JWT
- Password hashing with bcryptjs
- Role-based access control

### ✅ Menu Management
- Get daily menu
- Get weekly menu
- Create menu (admin only)
- Time slots (breakfast, lunch, dinner)
- Veg/non-veg indicators

### ✅ Rating System
- Submit 1-5 star ratings
- Prevent duplicate ratings per user per meal
- Get average ratings
- View user's previous ratings

### ✅ Feedback System
- Submit feedback with issue type
- Anonymous feedback option
- Character limit validation (400 chars)
- Status tracking (pending, reviewed, resolved)
- Get feedback by meal

### ✅ Admin Analytics
- Average meal ratings
- Issue distribution statistics
- Weekly rating trends
- Top rated meals
- Total statistics

### ✅ Reports
- Weekly reports
- Feedback trends
- Key observations
- Recommendations

---

## 🚀 Running Both Simultaneously

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
npm run dev
```

Now you have:
- **Backend API:** http://localhost:5000
- **Frontend App:** http://localhost:5173

---

## 🧪 Testing the Backend

### Using cURL

**Test Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "rollNumber": "20BTS001",
    "role": "btech"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Using Postman

1. Create a new collection
2. Add requests for each endpoint
3. Use the token from login in Authorization header
4. Test all endpoints (see API_DOCUMENTATION.md)

---

## 🔧 Troubleshooting

### Issue: "MongoDB Connected" message doesn't appear
**Solution:** 
- Check if MongoDB is running: `mongod`
- Verify connection URI in .env
- Check if port 27017 is open

### Issue: CORS errors in frontend
**Solution:**
- Ensure `FRONTEND_URL` in .env is `http://localhost:5173`
- Restart backend server

### Issue: "Port already in use"
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Issue: Token not being sent from frontend
**Solution:**
- Check if token is saved in localStorage
- Open DevTools → Application → localStorage
- Verify token is present after login

---

## 📊 API Workflow Example

1. **User registers** → POST /auth/register → Token stored in localStorage
2. **User logs in** → POST /auth/login → Token stored
3. **Frontend fetches menu** → GET /menu/today
4. **User rates meal** → POST /rating/submit → Backend saves to DB
5. **User submits feedback** → POST /feedback/submit → Backend saves
6. **Admin views analytics** → GET /admin/analytics → Backend aggregates data
7. **Admin generates report** → GET /admin/report → Backend creates report

---

## 🎓 Key Backend Concepts

### Middleware
- Auth middleware verifies JWT tokens
- Role checking ensures proper access control
- CORS middleware enables frontend communication

### Models (MongoDB)
- **User:** Stores user info with hashed passwords
- **Menu:** Daily meal information
- **Rating:** User ratings (one per user per meal per date)
- **Feedback:** User feedback submissions

### Controllers
Each endpoint has a controller that:
1. Validates input
2. Processes request
3. Interacts with database
4. Returns response

### Error Handling
- Try-catch blocks handle errors
- Proper HTTP status codes
- User-friendly error messages

---

## 📌 Important Notes

- ⚠️ Change `JWT_SECRET` in production
- ⚠️ Use MongoDB connection string with credentials
- ⚠️ Don't commit `.env` file to git
- ⚠️ Implement rate limiting for production
- ⚠️ Add input sanitization for security
- ⚠️ Use HTTPS in production

---

## 🔗 Useful Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT Guide](https://jwt.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

**Backend Ready!** 🚀  
All connections between frontend and backend are properly configured.  
Happy coding! ✨
