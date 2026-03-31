import express from 'express'
import { getTodayMenu, getWeeklyMenu, createMenu } from '../controllers/menuController.js'
import { authMiddleware, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.get('/today', getTodayMenu)
router.get('/weekly', getWeeklyMenu)
router.post('/create', authMiddleware, adminOnly, createMenu)

export default router
