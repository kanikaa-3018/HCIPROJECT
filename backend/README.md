# Mess Menu & Feedback System - Backend

Node.js + Express + MongoDB backend API for the Mess Menu & Feedback System.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Or production
npm start
```

Server runs on: `http://localhost:5000`

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin support
- **dotenv**: Environment configuration

## 🔧 Configuration

Create/update `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mess-menu-system
JWT_SECRET=your_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 📡 API Endpoints

See `API_DOCUMENTATION.md` for complete API reference.

**Main Routes:**
- `/api/auth` - Authentication (Register, Login)
- `/api/menu` - Menu management
- `/api/rating` - Meal ratings
- `/api/feedback` - User feedback
- `/api/admin` - Analytics & Reports

## 📁 Folder Structure

```
src/
├── server.js              # Main entry point
├── routes/                # API route handlers
│   ├── auth.js
│   ├── menu.js
│   ├── rating.js
│   ├── feedback.js
│   └── admin.js
├── controllers/           # Business logic
│   ├── authController.js
│   ├── menuController.js
│   ├── ratingController.js
│   ├── feedbackController.js
│   └── adminController.js
├── models/                # MongoDB schemas
│   ├── User.js
│   ├── Menu.js
│   ├── Rating.js
│   └── Feedback.js
├── middleware/            # Auth & validation
│   └── auth.js
└── utils/                 # Helper functions
```

## 🔐 Authentication

All protected endpoints require Bearer token:
```
Authorization: Bearer <token_from_login>
```

## 🗂️ Database

Uses MongoDB with these collections:
- **users** - User accounts & roles
- **menus** - Daily/weekly menu items
- **ratings** - Meal ratings
- **feedbacks** - User feedback submissions

## 🧪 Testing

Use Postman or curl to test endpoints. See `API_DOCUMENTATION.md` for example requests.

## 📊 Features

- ✅ Secure authentication with JWT
- ✅ Role-based access control (Student, Admin/Warden)
- ✅ Menu management and display
- ✅ 1-5 star rating system
- ✅ Feedback submission with categories
- ✅ Admin analytics and reports
- ✅ Anonymous feedback support
- ✅ Error handling & validation

## 🤝 Frontend Integration

Frontend connects to backend via `http://localhost:5000/api`

Updated API service in frontend:
- `src/services/api.js` - All API calls

## 📝 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 5000 | Server port |
| MONGODB_URI | localhost:27017 | MongoDB connection |
| JWT_SECRET | (required) | JWT signing key |
| NODE_ENV | development | Environment type |
| FRONTEND_URL | localhost:5173 | Frontend origin for CORS |

## ⚠️ Important

- Change `JWT_SECRET` before production
- Don't commit `.env` to git
- Ensure MongoDB is running
- Use HTTPS in production
- Implement rate limiting for production

## 📚 Related Documentation

- [API Documentation](./API_DOCUMENTATION.md)
- [Backend Setup Guide](../BACKEND_SETUP.md)
- [Project Summary](../PROJECT_SUMMARY.md)

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** March 31, 2026
