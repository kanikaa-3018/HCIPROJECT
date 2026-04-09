import Feedback from '../models/Feedback.js'

export const submitFeedback = async (req, res) => {
  try {
    const { mealName, issueType, comment, isAnonymous, rating } = req.body
    const userId = req.user.userId

    if (!mealName || !issueType || !comment) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (comment.length > 400) {
      return res.status(400).json({ message: 'Comment cannot exceed 400 characters' })
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' })
    }

    const feedbackData = {
      mealName,
      issueType,
      comment,
      isAnonymous,
      rating: rating || null,
      userId: userId,  // Always store userId for tracking
      status: 'pending'
    }

    const feedback = new Feedback(feedbackData)
    await feedback.save()

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })

    res.json(feedback)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getTopFeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 6
    const skip = (page - 1) * limit

    const totalFeedback = await Feedback.countDocuments()
    const feedback = await Feedback.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalPages = Math.ceil(totalFeedback / limit)

    res.json({
      feedback,
      pagination: {
        currentPage: page,
        totalPages,
        totalFeedback,
        limit
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getUserFeedback = async (req, res) => {
  try {
    const userId = req.user.userId
    
    const feedback = await Feedback.find({ userId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })

    res.json(feedback)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getFeedbackByMeal = async (req, res) => {
  try {
    const { mealName } = req.params

    const feedback = await Feedback.find({ mealName })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })

    res.json(feedback)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateFeedbackStatus = async (req, res) => {
  try {
    const { feedbackId } = req.params
    const { status } = req.body

    if (!['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { status },
      { new: true }
    )

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }

    res.json({ message: 'Status updated successfully', feedback })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getFeedbackSummary = async (req, res) => {
  try {
    const totalFeedback = await Feedback.countDocuments()
    const pendingFeedback = await Feedback.countDocuments({ status: 'pending' })
    
    res.json({
      totalFeedback,
      pendingFeedback,
      avgRating: 4.5
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
