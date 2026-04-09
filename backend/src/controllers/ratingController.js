import Rating from '../models/Rating.js'
import Menu from '../models/Menu.js'

export const submitRating = async (req, res) => {
  try {
    const { mealId, mealName, rating, date } = req.body
    const userId = req.user.userId

    if (!mealId || !mealName || !rating || !date) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' })
    }

    // Check if user already rated this meal on this date
    const existingRating = await Rating.findOne({
      userId,
      mealId,
      date: new Date(date)
    })

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating
      await existingRating.save()
      return res.json({ message: 'Rating updated successfully', rating: existingRating })
    }

    const newRating = new Rating({
      userId,
      mealId,
      mealName,
      rating,
      date: new Date(date)
    })

    await newRating.save()

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: newRating
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAverageRatings = async (req, res) => {
  try {
    const ratings = await Rating.aggregate([
      {
        $group: {
          _id: '$mealName',
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 }
        }
      },
      { $sort: { averageRating: -1 } }
    ])

    res.json(ratings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getUserRating = async (req, res) => {
  try {
    const { mealId } = req.params
    const userId = req.user.userId

    const rating = await Rating.findOne({ userId, mealId })

    if (!rating) {
      return res.json({ rating: 0, message: 'No rating found' })
    }

    res.json({ rating: rating.rating })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.userId

    const userRatings = await Rating.find({ userId })
      .sort({ date: -1 })
      .limit(50)

    res.json(userRatings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
