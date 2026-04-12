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

    // Transform to match frontend expectations
    const ratings = mealRatings.map(item => ({
      meal: item._id,
      avg: item.averageRating,
      count: item.totalRatings
    }))

    // Issue distribution
    const issueDistributionRaw = await Feedback.aggregate([
      {
        $group: {
          _id: '$issueType',
          count: { $sum: 1 }
        }
      }
    ])

    const issues = issueDistributionRaw.map(item => ({
      type: item._id,
      count: item.count
    }))

    // Average feedback rating
    const avgFeedbackRating = await Feedback.aggregate([
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ])

    // Most common issue
    const mostCommonIssue = issues.length > 0 
      ? issues.reduce((prev, current) => (prev.count > current.count) ? prev : current).type
      : null

    // Best meal
    const bestMeal = ratings.length > 0 ? ratings[0].meal : null

    // Daily ratings trend (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const dailyRatings = await Rating.aggregate([
      {
        $match: { createdAt: { $gte: sevenDaysAgo } }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          avg: { $avg: '$rating' }
        }
      },
      { $sort: { _id: 1 } }
    ])

    const dailyTrend = dailyRatings.map(item => ({
      day: item._id,
      avg: item.avg
    }))

    // Total statistics
    const totalRatings = await Rating.countDocuments()
    const totalFeedback = await Feedback.countDocuments()
    const averageOverallRating = avgFeedbackRating[0]?.avg || 0

    res.json({
      ratings,
      issues,
      dailyRatings: dailyTrend,
      statistics: {
        totalRatings,
        totalFeedback,
        averageOverallRating,
        mostCommonIssue,
        bestMeal
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

    // Get all ratings from the past week
    const ratings = await Rating.aggregate([
      {
        $match: { createdAt: { $gte: oneWeekAgo } }
      },
      {
        $group: {
          _id: '$mealName',
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 }
        }
      },
      { $sort: { averageRating: -1 } }
    ])

    // Get feedback issues distribution
    const issues = await Feedback.aggregate([
      {
        $match: { createdAt: { $gte: oneWeekAgo } }
      },
      {
        $group: {
          _id: '$issueType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])

    // Calculate overall average rating from both ratings and feedback
    const allRatings = await Rating.find({ createdAt: { $gte: oneWeekAgo } })
    const allFeedbackWithRating = await Feedback.find({ 
      createdAt: { $gte: oneWeekAgo },
      rating: { $exists: true, $ne: null }
    })

    let totalRatingSum = allRatings.reduce((sum, r) => sum + r.rating, 0)
    let totalRatingCount = allRatings.length

    if (allFeedbackWithRating.length > 0) {
      totalRatingSum += allFeedbackWithRating.reduce((sum, f) => sum + f.rating, 0)
      totalRatingCount += allFeedbackWithRating.length
    }

    const avgRating = totalRatingCount > 0 ? totalRatingSum / totalRatingCount : 0

    // Get top meal
    const topMeal = ratings.length > 0 ? ratings[0]._id : 'N/A'

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

    // Recent feedback with details
    const recentFeedback = await Feedback.find({
      createdAt: { $gte: oneWeekAgo }
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)

    // Summary stats
    const totalRatings = await Rating.countDocuments({ createdAt: { $gte: oneWeekAgo } })
    const totalFeedback = await Feedback.countDocuments({ createdAt: { $gte: oneWeekAgo } })

    res.json({
      report: {
        date: new Date().toLocaleDateString(),
        period: 'Last 7 days',
        avgRating: parseFloat(avgRating.toFixed(2)),
        totalFeedback,
        totalRatings,
        topMeal,
        issues: issues.map(i => ({
          type: i._id || 'Other',
          count: i.count
        })),
        topMeals: ratings.slice(0, 5).map(r => ({
          meal: r._id,
          avg: parseFloat(r.averageRating.toFixed(2)),
          count: r.totalRatings
        })),
        weeklyTrend: weeklyTrend.map(w => ({
          day: w._id,
          avg: parseFloat(w.averageRating.toFixed(2)),
          count: w.count
        })),
        recentFeedback: recentFeedback.map(f => ({
          id: f._id,
          user: f.userId?.name || 'Anonymous',
          meal: f.mealName,
          type: f.issueType,
          comment: f.comment,
          rating: f.rating,
          date: new Date(f.createdAt).toLocaleDateString()
        }))
      }
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

export const getAllFeedback = async (req, res) => {
  try {
    const { status, mealName, page = 1, limit = 10 } = req.query
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    // Build filter
    const filter = {}
    if (status && status !== 'all') {
      filter.status = status
    }
    if (mealName) {
      filter.mealName = mealName
    }

    // Get total count
    const totalFeedback = await Feedback.countDocuments(filter)

    // Get feedback with pagination
    const feedback = await Feedback.find(filter)
      .populate('userId', 'name email rollNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)

    // Group feedback by meal
    const feedbackByMeal = {}
    feedback.forEach(fb => {
      if (!feedbackByMeal[fb.mealName]) {
        feedbackByMeal[fb.mealName] = []
      }
      feedbackByMeal[fb.mealName].push({
        id: fb._id,
        user: fb.userId?.name || 'Anonymous',
        email: fb.userId?.email,
        issue: fb.issueType,
        comment: fb.comment,
        rating: fb.rating,
        status: fb.status,
        isAnonymous: fb.isAnonymous,
        date: fb.createdAt,
        day: new Date(fb.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
      })
    })

    // Get status statistics
    const stats = await Feedback.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    // Get meal count
    const mealStats = await Feedback.aggregate([
      { $group: { _id: '$mealName', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    res.json({
      feedback: feedbackByMeal,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalFeedback / limitNum),
        totalFeedback,
        limit: limitNum
      },
      stats: {
        byStatus: stats.reduce((acc, s) => {
          acc[s._id] = s.count
          return acc
        }, {}),
        byMeal: mealStats
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateFeedbackStatus = async (req, res) => {
  try {
    const { feedbackId } = req.params
    const { status } = req.body

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'resolved']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { status },
      { new: true }
    ).populate('userId', 'name email')

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }

    res.json({
      message: 'Feedback status updated successfully',
      feedback
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
