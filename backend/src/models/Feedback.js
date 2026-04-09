import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  mealName: {
    type: String,
    required: true
  },
  issueType: {
    type: String,
    enum: ['taste', 'hygiene', 'quantity', 'other'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  },
  comment: {
    type: String,
    required: true,
    maxlength: 400
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Feedback', feedbackSchema)
