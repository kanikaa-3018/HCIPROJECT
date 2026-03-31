import express from 'express'
import { 
  submitFeedback, 
  getAllFeedback, 
  getFeedbackByMeal, 
  updateFeedbackStatus 
} from '../controllers/feedbackController.js'
import { authMiddleware, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.post('/submit', authMiddleware, submitFeedback)
router.get('/all', authMiddleware, adminOnly, getAllFeedback)
router.get('/meal/:mealName', getFeedbackByMeal)
router.patch('/:feedbackId/status', authMiddleware, adminOnly, updateFeedbackStatus)

export default router
