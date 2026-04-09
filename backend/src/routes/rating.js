import express from 'express'
import { submitRating, getAverageRatings, getUserRating, getUserRatings } from '../controllers/ratingController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/submit', authMiddleware, submitRating)
router.get('/averages', getAverageRatings)
router.get('/my-ratings', authMiddleware, getUserRatings)
router.get('/user/:mealId', authMiddleware, getUserRating)

export default router
