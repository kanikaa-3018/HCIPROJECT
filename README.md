# Mess Menu & Feedback System

A production-ready HCI (Human-Computer Interaction) frontend application for a college mess menu display and student feedback system. Built with React, Tailwind CSS, and modern web technologies.

## ✨ Features

### For Students
- **Daily Menu Display**: View breakfast, lunch, and dinner with time slots
- **Rating System**: Rate meals 1-5 stars with visual feedback
- **Feedback Form**: Submit detailed feedback with issue categorization
- **Weekly Menu**: Calendar-style weekly meal planning view
- **Responsive Design**: Works seamlessly on mobile and desktop

### For Admin (Warden)
- **Analytics Dashboard**: View meal ratings, feedback distribution
- **Chart Visualizations**: Bar charts, pie charts, and trend lines
- **Weekly Reports**: Generate and download comprehensive reports
- **Statistical Summary**: Key metrics and performance indicators

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build Production
```bash
npm build
```

### Preview Build
```bash
npm preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Input.jsx
│   ├── Select.jsx
│   ├── StarRating.jsx
│   ├── MealCard.jsx
│   ├── Sidebar.jsx
│   ├── Toast.jsx
│   ├── SkeletonLoader.jsx
│   ├── EmptyState.jsx
│   ├── StatCard.jsx
│   └── ProtectedRoute.jsx
├── pages/               # Page components
│   ├── Login.jsx
│   ├── StudentDashboard.jsx
│   ├── DailyMenu.jsx
│   ├── WeeklyMenu.jsx
│   ├── FeedbackPage.jsx
│   ├── AdminDashboard.jsx
│   └── ReportsPage.jsx
├── layouts/             # Layout wrappers
│   └── MainLayout.jsx
├── services/            # API calls & mock data
│   └── api.js
├── store/               # State management (Zustand)
│   ├── authStore.js
│   └── toastStore.js
├── App.jsx              # Main app router
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#9333ea)
- **Secondary**: Gray tones
- **Accent**: Yellow (#eab308)
- **Status**: Green (success), Red (error), Blue (info)

### Components
- Clean, card-based layout
- Smooth animations and transitions
- Responsive grid system
- Skeleton loaders
- Empty states
- Toast notifications

## 👥 User Roles

### B.Tech Students
- View daily and weekly menu
- Rate meals
- Submit feedback
- Access personal dashboard

### M.Tech/PhD Students
- Same access as B.Tech students

### Admin (Warden)
- View analytics dashboard
- See all rankings and ratings
- Analyze feedback patterns
- Generate and download reports
- Manage system

## 🔐 Authentication

Demo Credentials:
```
Email: student@college.edu
Password: password

Roles: btech | mtech | admin
```

## 📊 Mock Data

All API calls use mock data for demo purposes:
- 9 meals across breakfast, lunch, dinner
- 5 feedback entries
- Analytics with ratings and issue breakdown
- Weekly menu data

## 🛠️ Technologies Used

### Frontend Framework
- **React 18.2**: Modern JavaScript library
- **React Router 6**: Client-side routing
- **Vite**: Fast build tool

### Styling
- **Tailwind CSS 3**: Utility-first CSS
- **PostCSS**: CSS processing

### State Management
- **Zustand**: Lightweight state management
- React Hooks (useState, useEffect)

### HTTP Client
- **Axios**: Promise-based HTTP client

### Data Visualization
- **Recharts**: React charting library

### UI Icons
- **Lucide React**: Modern icon library

## 📱 Responsive Design

Fully responsive across all devices:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Large screens (1280px+)

Mobile navigation with collapsible sidebar.

## 🎯 Key Features Implementation

### Rating System
- One rating per meal per user
- Visual star feedback
- Average rating calculation
- Loading states

### Feedback System
- Dropdown meal selection
- Issue categorization (taste, quantity, hygiene, other)
- Anonymous option
- Form validation
- Success/error messages

### Analytics
- Bar charts for meal ratings
- Pie charts for issue distribution
- Line charts for weekly trends
- Statistical summary cards
- Top meals and issues

### Reports
- Report generation
- Download functionality
- Key observations
- Recommendations
- Report history

## 🎨 UI/UX Highlights

- Clean, modern aesthetic
- Intuitive navigation
- Minimal friction flows
- Visual hierarchy
- Consistent spacing
- Smooth animations
- Loading skeletons
- Error boundaries
- Empty states
- Toast notifications

## 📦 Dependencies

See `package.json` for full list. Key packages:
- react: ^18.2.0
- react-router-dom: ^6.20.0
- tailwindcss: ^3.3.6
- recharts: ^2.10.3
- axios: ^1.6.2
- zustand: ^4.4.1
- lucide-react: ^0.294.0

## 🔄 State Management

### Auth Store (Zustand)
- User data
- Login/logout
- Persistent storage

### Toast Store (Zustand)
- Toast notifications
- Auto-dismissal
- Multiple toasts

## 🚀 Performance

- Vite for fast development
- Code splitting via React Router
- Skeleton loaders for UX
- Efficient re-renders
- Optimized images
- CSS minification

## 🤝 Contributing

This is a demo HCI project. Modifications welcome for educational purposes.

## 📝 License

Educational Project - Use freely for learning

---

**Built with ❤️ for HCI Project**
