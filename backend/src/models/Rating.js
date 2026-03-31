import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true
  },
  mealName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Ensure one rating per user per meal
ratingSchema.index({ userId: 1, mealId: 1, date: 1 }, { unique: true })

export default mongoose.model('Rating', ratingSchema)
