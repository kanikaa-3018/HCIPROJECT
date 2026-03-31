# Backend API Documentation

## 🚀 Backend Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud MongoDB Atlas)
- npm or yarn

### Installation Steps

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file (already provided)
# Update MongoDB URI if needed

# Start development server
npm run dev

# Or start production server
npm start
```

Backend will run on: `http://localhost:5000`

---

## 📡 API Endpoints Documentation

### **BASE URL:** `http://localhost:5000/api`

---

## 1️⃣ Authentication Routes (`/auth`)

### Register User
```
POST /auth/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "rollNumber": "20BITS001",
  "role": "btech"  // or "mtech", "phd", "warden"
}

Response:
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "btech"
  }
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "btech"
  }
}
```

---

## 2️⃣ Menu Routes (`/menu`)

### Get Today's Menu
```
GET /menu/today

Response:
{
  "date": "2026-03-31T00:00:00.000Z",
  "dayOfWeek": "Monday",
  "meals": [
    {
      "name": "Aloo Sabzi",
      "type": "veg",
      "description": "Potato curry",
      "timeSlot": "lunch"
    }
  ]
}
```

### Get Weekly Menu
```
GET /menu/weekly

Response:
[
  {
    "date": "2026-03-31T00:00:00.000Z",
    "dayOfWeek": "Monday",
    "meals": [...]
  },
  ...
]
```

### Create Menu (Admin Only)
```
POST /menu/create
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "date": "2026-03-31",
  "dayOfWeek": "Monday",
  "meals": [
    {
      "name": "Aloo Sabzi",
      "type": "veg",
      "description": "Potato curry",
      "timeSlot": "lunch"
    }
  ]
}

Response:
{
  "message": "Menu created successfully",
  "menu": {...}
}
```

---

## 3️⃣ Rating Routes (`/rating`)

### Submit Rating
```
POST /rating/submit
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "mealId": "507f1f77bcf86cd799439011",
  "mealName": "Aloo Sabzi",
  "rating": 4,
  "date": "2026-03-31"
}

Response:
{
  "message": "Rating submitted successfully",
  "rating": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "mealId": "507f1f77bcf86cd799439011",
    "mealName": "Aloo Sabzi",
    "rating": 4,
    "date": "2026-03-31T00:00:00.000Z"
  }
}
```

### Get Average Ratings
```
GET /rating/averages

Response:
[
  {
    "_id": "Aloo Sabzi",
    "averageRating": 4.2,
    "totalRatings": 42
  },
  ...
]
```

### Get User's Rating for a Meal
```
GET /rating/user/:mealId
Authorization: Bearer <token>

Response:
{
  "rating": 4
}
```

---

## 4️⃣ Feedback Routes (`/feedback`)

### Submit Feedback
```
POST /feedback/submit
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "mealName": "Aloo Sabzi",
  "issueType": "taste",  // "taste", "hygiene", "quantity", "other"
  "comment": "The taste could be improved with more spices",
  "isAnonymous": false
}

Response:
{
  "message": "Feedback submitted successfully",
  "feedback": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "mealName": "Aloo Sabzi",
    "issueType": "taste",
    "comment": "The taste could be improved...",
    "isAnonymous": false,
    "status": "pending",
    "createdAt": "2026-03-31T12:30:00.000Z"
  }
}
```

### Get All Feedback (Admin Only)
```
GET /feedback/all
Authorization: Bearer <token>

Response:
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "userId": {...},
    "mealName": "Aloo Sabzi",
    "issueType": "taste",
    "comment": "...",
    "status": "pending",
    "createdAt": "2026-03-31T12:30:00.000Z"
  }
]
```

### Get Feedback for Specific Meal
```
GET /feedback/meal/:mealName

Response:
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "userId": {...},
    "mealName": "Aloo Sabzi",
    "issueType": "taste",
    "comment": "...",
    "createdAt": "2026-03-31T12:30:00.000Z"
  }
]
```

### Update Feedback Status (Admin Only)
```
PATCH /feedback/:feedbackId/status
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "status": "resolved"  // "pending", "reviewed", "resolved"
}

Response:
{
  "message": "Status updated successfully",
  "feedback": {...}
}
```

---

## 5️⃣ Admin Routes (`/admin`)

### Get Analytics (Admin Only)
```
GET /admin/analytics
Authorization: Bearer <token>

Response:
{
  "mealRatings": [
    {
      "_id": "Aloo Sabzi",
      "averageRating": 4.2,
      "totalRatings": 42
    }
  ],
  "issueDistribution": [
    {
      "_id": "taste",
      "count": 18
    }
  ],
  "topMeals": [...],
  "statistics": {
    "totalRatings": 150,
    "totalFeedback": 45,
    "averageOverallRating": 4.1
  }
}
```

### Generate Report (Admin Only)
```
GET /admin/report
Authorization: Bearer <token>

Response:
{
  "reportDate": "2026-03-31T12:30:00.000Z",
  "period": "7 days",
  "summary": {
    "totalRatings": 120,
    "totalFeedback": 35,
    "weeklyTrend": [
      {
        "_id": "2026-03-31",
        "averageRating": 4.2,
        "count": 25
      }
    ],
    "recentFeedback": [...]
  }
}
```

### Get Top Meals
```
GET /admin/top-meals

Response:
[
  {
    "_id": "Kadai Paneer",
    "averageRating": 4.6,
    "totalRatings": 48
  },
  ...
]
```

---

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token_from_login>
```

---

## 🗂️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  rollNumber: String (unique),
  role: String ("btech", "mtech", "phd", "warden"),
  createdAt: Date
}
```

### Menu Model
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
  ],
  createdAt: Date
}
```

### Rating Model
```javascript
{
  userId: ObjectId (ref: User),
  mealId: ObjectId (ref: Menu),
  mealName: String,
  rating: Number (1-5),
  date: Date,
  createdAt: Date
}
```

### Feedback Model
```javascript
{
  userId: ObjectId (ref: User),
  mealName: String,
  issueType: String ("taste", "hygiene", "quantity", "other"),
  comment: String (max 400 chars),
  isAnonymous: Boolean,
  status: String ("pending", "reviewed", "resolved"),
  createdAt: Date
}
```

---

## ✅ Role-Based Access Control

**Public Endpoints:**
- POST /auth/register
- POST /auth/login
- GET /menu/today
- GET /menu/weekly
- GET /rating/averages
- GET /feedback/meal/:mealName
- GET /admin/top-meals

**Student Only (BTech, MTech, PhD):**
- POST /rating/submit
- GET /rating/user/:mealId
- POST /feedback/submit

**Admin Only (Warden):**
- POST /menu/create
- GET /feedback/all
- PATCH /feedback/:feedbackId/status
- GET /admin/analytics
- GET /admin/report

---

## 📝 Error Handling

All errors follow this format:

```json
{
  "message": "Error description"
}
```

**Common Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized (invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Server Error

---

## 🧪 Testing the API

Use Postman or similar tool to test the endpoints:

1. Register a new user
2. Login to get a token
3. Use the token in Authorization header for protected routes
4. Test different endpoints

---

**Backend Version:** 1.0.0  
**Last Updated:** March 31, 2026
