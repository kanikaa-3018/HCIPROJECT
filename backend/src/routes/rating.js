import express from 'express'
import { submitRating, getAverageRatings, getUserRating } from '../controllers/ratingController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/submit', authMiddleware, submitRating)
router.get('/averages', getAverageRatings)
router.get('/user/:mealId', authMiddleware, getUserRating)

export default router
