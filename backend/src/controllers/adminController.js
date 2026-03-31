import Rating from '../models/Rating.js'
import Feedback from '../models/Feedback.js'

export const getAnalytics = async (req, res) => {
  try {
    // Average ratings per meal
    const mealRatings = await Rating.aggregate([
      {
        $group: {
          _id: '$mealName',
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 }
        }
      },
      { $sort: { averageRating: -1 } }
    ])

    // Issue distribution
    const issueDistribution = await Feedback.aggregate([
      {
        $group: {
          _id: '$issueType',
          count: { $sum: 1 }
        }
      }
    ])

    // Top 5 rated meals
    const topMeals = mealRatings.slice(0, 5)

    // Total statistics
    const totalRatings = await Rating.countDocuments()
    const totalFeedback = await Feedback.countDocuments()
    const averageOverallRating = await Rating.aggregate([
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ])

    res.json({
      mealRatings,
      issueDistribution,
      topMeals,
      statistics: {
        totalRatings,
        totalFeedback,
        averageOverallRating: averageOverallRating[0]?.avg || 0
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const generateReport = async (req, res) => {
  try {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    // Weekly ratings trend
    const weeklyTrend = await Rating.aggregate([
      {
        $match: { createdAt: { $gte: oneWeekAgo } }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          averageRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // Recent feedback
    const recentFeedback = await Feedback.find({
      createdAt: { $gte: oneWeekAgo }
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })

    // Summary
    const summary = {
      totalRatings: await Rating.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      totalFeedback: await Feedback.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      weeklyTrend,
      recentFeedback
    }

    res.json({
      reportDate: new Date(),
      period: '7 days',
      summary
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getTopMeals = async (req, res) => {
  try {
    const topMeals = await Rating.aggregate([
      {
        $group: {
          _id: '$mealName',
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 }
        }
      },
      { $sort: { averageRating: -1 } },
      { $limit: 5 }
    ])

    res.json(topMeals)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
