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

// Seed menu data with correct menus
const seedMenuData = async () => {
  try {
    // Check if this week's menus already exist
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const currentDay = today.getDay()
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)
    const monday = new Date()
    monday.setDate(diff)
    monday.setHours(0, 0, 0, 0)
    
    const existingMenuCount = await Menu.countDocuments({
      date: { $gte: monday }
    })
    
    // If we already have this week's menus and they have meals, don't reseed
    if (existingMenuCount >= 7) {
      const existingMenuWithMeals = await Menu.findOne({
        date: { $gte: monday },
        'meals.0': { $exists: true }
      })
      
      if (existingMenuWithMeals && existingMenuWithMeals.meals.length > 0) {
        console.log('✅ Weekly menu already seeded with meals')
        return
      }
    }
    
    // Clear old menus and reseed with correct data
    await Menu.deleteMany({})
    console.log('Cleared existing menus')
    
    const weeklyMenuData = [
      {
        day: 'Monday',
        meals: [
          { name: 'Sandwich', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Upma', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Roti', type: 'veg', timeSlot: 'lunch' },
          { name: 'Aloo Sabji', type: 'veg', timeSlot: 'lunch' },
          { name: 'Kaddu Sabji', type: 'veg', timeSlot: 'lunch' },
          { name: 'Poori', type: 'veg', timeSlot: 'lunch' },
          { name: 'Veg Raita', type: 'veg', timeSlot: 'lunch' },
          { name: 'Maggi', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Toast', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Matar Paneer', type: 'veg', timeSlot: 'dinner' },
          { name: 'Rice', type: 'veg', timeSlot: 'dinner' },
          { name: 'Toor Dal', type: 'veg', timeSlot: 'dinner' }
        ]
      },
      {
        day: 'Tuesday',
        meals: [
          { name: 'Pav Bhaji', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Sprouts', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Kadhi', type: 'veg', timeSlot: 'lunch' },
          { name: 'Aloo Sabji', type: 'veg', timeSlot: 'lunch' },
          { name: 'Fry Mirch', type: 'veg', timeSlot: 'lunch' },
          { name: 'Papad', type: 'veg', timeSlot: 'lunch' },
          { name: 'Tea', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Namkeen', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Sewai', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Dosa', type: 'veg', timeSlot: 'dinner' },
          { name: 'Sambhar', type: 'veg', timeSlot: 'dinner' },
          { name: 'Chutney', type: 'veg', timeSlot: 'dinner' },
          { name: 'Rice', type: 'veg', timeSlot: 'dinner' },
          { name: 'Moong Dal Halwa', type: 'veg', timeSlot: 'dinner' }
        ]
      },
      {
        day: 'Wednesday',
        meals: [
          { name: 'Poha', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Jalebi', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Omelette', type: 'non-veg', timeSlot: 'breakfast' },
          { name: 'Chole Bhature', type: 'veg', timeSlot: 'lunch' },
          { name: 'Boondi Raita', type: 'veg', timeSlot: 'lunch' },
          { name: 'Fry Mirch', type: 'veg', timeSlot: 'lunch' },
          { name: 'Tea', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Coffee', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Bread Pakoda', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Mix Dal Tadka', type: 'veg', timeSlot: 'dinner' },
          { name: 'Methi Aloo', type: 'veg', timeSlot: 'dinner' },
          { name: 'Rice', type: 'veg', timeSlot: 'dinner' }
        ]
      },
      {
        day: 'Thursday',
        meals: [
          { name: 'Paneer Bhurji', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Paratha', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Black Channa Sabji', type: 'veg', timeSlot: 'lunch' },
          { name: 'Toor Dal', type: 'veg', timeSlot: 'lunch' },
          { name: 'Papad', type: 'veg', timeSlot: 'lunch' },
          { name: 'Lassi', type: 'veg', timeSlot: 'lunch' },
          { name: 'Tea', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Bhujia', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Black Masoor Dal', type: 'veg', timeSlot: 'dinner' },
          { name: 'Sabji', type: 'veg', timeSlot: 'dinner' },
          { name: 'Aloo Peas', type: 'veg', timeSlot: 'dinner' },
          { name: 'Gulab Jamun', type: 'veg', timeSlot: 'dinner' }
        ]
      },
      {
        day: 'Friday',
        meals: [
          { name: 'Idli', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Sambhar', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Chutney', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Veg Biryani', type: 'veg', timeSlot: 'lunch' },
          { name: 'Onion Raita', type: 'veg', timeSlot: 'lunch' },
          { name: 'Aloo Shimla', type: 'veg', timeSlot: 'lunch' },
          { name: 'Green Chutney', type: 'veg', timeSlot: 'lunch' },
          { name: 'Tea', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Samosa', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Green & Imli Chutney', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Yellow Dal', type: 'veg', timeSlot: 'dinner' },
          { name: 'Kadhi', type: 'veg', timeSlot: 'dinner' }
        ]
      },
      {
        day: 'Saturday',
        meals: [
          { name: 'Onion Paratha', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Aloo Sabji', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Sprouts', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Paneer Sabji', type: 'veg', timeSlot: 'lunch' },
          { name: 'Dal', type: 'veg', timeSlot: 'lunch' },
          { name: 'Lauki Chana Sabji', type: 'veg', timeSlot: 'lunch' },
          { name: 'Dry Papad', type: 'veg', timeSlot: 'lunch' },
          { name: 'Tea', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Coffee', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Pasta', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Punjabi Dal Tadka', type: 'veg', timeSlot: 'dinner' },
          { name: 'Aloo Baingan', type: 'veg', timeSlot: 'dinner' },
          { name: 'Any Sweet', type: 'veg', timeSlot: 'dinner' }
        ]
      },
      {
        day: 'Sunday',
        meals: [
          { name: 'Uttapam', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Chutney', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Sambhar', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Chana Dal', type: 'veg', timeSlot: 'lunch' },
          { name: 'Dahi', type: 'veg', timeSlot: 'lunch' },
          { name: 'Aloo Paratha', type: 'veg', timeSlot: 'lunch' },
          { name: 'Green Chutney', type: 'veg', timeSlot: 'lunch' },
          { name: 'Tea', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Pav', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Bread', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Chutney', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Egg Curry', type: 'non-veg', timeSlot: 'dinner' },
          { name: 'Paneer Bhurji', type: 'veg', timeSlot: 'dinner' }
        ]
      }
    ]
    
    const menus = weeklyMenuData.map((dayData, index) => {
      const date = new Date(monday)
      date.setDate(date.getDate() + index)
      date.setHours(0, 0, 0, 0)
      
      return {
        date,
        dayOfWeek: dayData.day,
        meals: dayData.meals
      }
    })
    
    await Menu.insertMany(menus)
    console.log('✅ Weekly menu created with correct meals for 7 days')
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
