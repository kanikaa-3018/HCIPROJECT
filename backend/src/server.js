import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import menuRoutes from './routes/menu.js'
import ratingRoutes from './routes/rating.js'
import feedbackRoutes from './routes/feedback.js'
import adminRoutes from './routes/admin.js'
import User from './models/User.js'
import Menu from './models/Menu.js'
import Feedback from './models/Feedback.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL?.replace(/\/$/, ''), // Remove trailing slash
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173'
    ].filter(Boolean)
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(express.json())

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected')
    seedDemoUsers()
    seedMenuData()
    seedFeedbackData()
  })
  .catch(err => console.log('❌ MongoDB Error:', err.message))

// Seed demo users
const seedDemoUsers = async () => {
  try {
    const existingUser = await User.findOne({ email: 'student@college.edu' })
    if (!existingUser) {
      const demoUsers = [
        {
          name: 'Student Demo',
          email: 'student@college.edu',
          password: 'password',
          rollNumber: 'BT001',
          role: 'btech'
        },
        {
          name: 'Admin Demo',
          email: 'admin@college.edu',
          password: 'password',
          rollNumber: 'ADM001',
          role: 'admin'
        }
      ]
      
      await User.insertMany(demoUsers)
      console.log('✅ Demo users created')
    }
  } catch (error) {
    console.log('⚠️ Seeding error:', error.message)
  }
}

// Seed menu data
const seedMenuData = async () => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const existingMenu = await Menu.findOne({
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    })
    
    if (!existingMenu) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const currentDay = today.getDay()
      
      // Meal options for variety
      const breakfastOptions = [
        { name: 'Idli', type: 'veg', description: 'South Indian Idli with sambar' },
        { name: 'Dosa', type: 'veg', description: 'Crispy dosa with chutney' },
        { name: 'Paratha', type: 'veg', description: 'Buttery paratha with pickle' }
      ]
      
      const lunchOptions = [
        { name: 'Paneer Curry', type: 'veg', description: 'Delicious paneer in gravy' },
        { name: 'Dal Makhani', type: 'veg', description: 'Creamy lentils' },
        { name: 'Chicken Curry', type: 'non-veg', description: 'Spiced chicken curry' }
      ]
      
      const hiTeaOptions = [
        { name: 'Samosa', type: 'veg', description: 'Crispy samosa with tea' },
        { name: 'Pakora', type: 'veg', description: 'Vegetable pakora snacks' },
        { name: 'Chai & Biscuit', type: 'veg', description: 'Tea with biscuits' }
      ]
      
      const dinnerOptions = [
        { name: 'Biryani', type: 'non-veg', description: 'Fragrant biryani rice' },
        { name: 'Pulao', type: 'veg', description: 'Vegetable pulao' },
        { name: 'Tandoori Chicken', type: 'non-veg', description: 'Spiced tandoori chicken' }
      ]

      const menus = []
      
      // Create menus for next 7 days
      for (let i = 0; i < 7; i++) {
        const menuDate = new Date(today)
        menuDate.setDate(menuDate.getDate() + i)
        const dayIndex = menuDate.getDay()
        
        menus.push({
          date: menuDate,
          dayOfWeek: dayNames[dayIndex],
          meals: [
            { ...breakfastOptions[i % 3], timeSlot: 'breakfast' },
            { ...lunchOptions[i % 3], timeSlot: 'lunch' },
            { name: 'Rotli', type: 'veg', description: 'Fresh baked rotli', timeSlot: 'lunch' },
            { name: 'Rice', type: 'veg', description: 'Steamed white rice', timeSlot: 'lunch' },
            { ...hiTeaOptions[i % 3], timeSlot: 'hiTea' },
            { ...dinnerOptions[i % 3], timeSlot: 'dinner' },
          ]
        })
      }
      
      await Menu.insertMany(menus)
      console.log('✅ Weekly menu created for 7 days')
    }
  } catch (error) {
    console.log('⚠️ Menu seeding error:', error.message)
  }
}

// Seed feedback data
const seedFeedbackData = async () => {
  try {
    const existingFeedback = await Feedback.findOne({})
    
    if (!existingFeedback) {
      const studentUser = await User.findOne({ email: 'student@college.edu' })
      
      if (studentUser) {
        const sampleFeedback = [
          {
            userId: studentUser._id,
            mealName: 'Biryani',
            issueType: 'taste',
            comment: 'The biryani was very tasty! Could use a bit more spice next time.',
            isAnonymous: false,
            status: 'resolved'
          },
          {
            userId: null,
            mealName: 'Samosa',
            issueType: 'quantity',
            comment: 'The samosa portions have become smaller recently. Please increase the quantity.',
            isAnonymous: true,
            status: 'pending'
          },
          {
            userId: studentUser._id,
            mealName: 'Dal Makhani',
            issueType: 'taste',
            comment: 'Excellent taste but could be a bit creamier. Overall satisfied!',
            isAnonymous: false,
            status: 'resolved'
          },
          {
            userId: null,
            mealName: 'Idli',
            issueType: 'hygiene',
            comment: 'The idlis taste good but please ensure they are served hot and fresh.',
            isAnonymous: true,
            status: 'reviewed'
          }
        ]
        
        await Feedback.insertMany(sampleFeedback)
        console.log('✅ Sample feedback created')
      }
    }
  } catch (error) {
    console.log('⚠️ Feedback seeding error:', error.message)
  }
}

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/rating', ratingRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/admin', adminRoutes)

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() })
})

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Unknown error'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
