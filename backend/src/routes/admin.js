import express from 'express'
import { getAnalytics, generateReport, getTopMeals, getAllFeedback, updateFeedbackStatus } from '../controllers/adminController.js'
import { authMiddleware, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.get('/analytics', authMiddleware, adminOnly, getAnalytics)
router.get('/report', authMiddleware, adminOnly, generateReport)
router.get('/top-meals', getTopMeals)
router.get('/feedback', authMiddleware, adminOnly, getAllFeedback)
router.patch('/feedback/:feedbackId/status', authMiddleware, adminOnly, updateFeedbackStatus)

export default router
