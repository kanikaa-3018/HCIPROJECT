import express from 'express'
import { 
  submitFeedback, 
  getAllFeedback,
  getTopFeedback,
  getUserFeedback,
  getFeedbackByMeal, 
  updateFeedbackStatus,
  getFeedbackSummary 
} from '../controllers/feedbackController.js'
import { authMiddleware, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.post('/submit', authMiddleware, submitFeedback)
router.get('/all', getAllFeedback)
router.get('/top', getTopFeedback)
router.get('/user', authMiddleware, getUserFeedback)
router.get('/summary', authMiddleware, getFeedbackSummary)
router.get('/meal/:mealName', getFeedbackByMeal)
router.patch('/:feedbackId/status', authMiddleware, adminOnly, updateFeedbackStatus)

export default router
