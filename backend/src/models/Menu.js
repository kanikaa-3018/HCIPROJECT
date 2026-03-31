import mongoose from 'mongoose'

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['veg', 'non-veg'],
    required: true
  },
  description: String,
  timeSlot: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner'],
    required: true
  }
})

const menuSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  dayOfWeek: {
    type: String,
    required: true
  },
  meals: [mealSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Menu', menuSchema)
