import Feedback from '../models/Feedback.js'

export const submitFeedback = async (req, res) => {
  try {
    const { mealName, issueType, comment, isAnonymous } = req.body
    const userId = req.user.userId

    if (!mealName || !issueType || !comment) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (comment.length > 400) {
      return res.status(400).json({ message: 'Comment cannot exceed 400 characters' })
    }

    const feedback = new Feedback({
      userId: isAnonymous ? null : userId,
      mealName,
      issueType,
      comment,
      isAnonymous
    })

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
