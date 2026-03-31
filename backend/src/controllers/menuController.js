import Menu from '../models/Menu.js'

export const getTodayMenu = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const menu = await Menu.findOne({
      date: { $gte: today, $lt: tomorrow }
    })

    if (!menu) {
      return res.status(404).json({ message: 'No menu for today' })
    }

    res.json({
      date: menu.date,
      dayOfWeek: menu.dayOfWeek,
      meals: menu.meals
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getWeeklyMenu = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const weekEnd = new Date(today)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const menus = await Menu.find({
      date: { $gte: today, $lt: weekEnd }
    }).sort({ date: 1 })

    if (menus.length === 0) {
      return res.status(404).json({ message: 'No menu available for this week' })
    }

    res.json(menus)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createMenu = async (req, res) => {
  try {
    const { date, dayOfWeek, meals } = req.body

    if (!date || !dayOfWeek || !meals || meals.length === 0) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const menu = new Menu({ date: new Date(date), dayOfWeek, meals })
    await menu.save()

    res.status(201).json({
      message: 'Menu created successfully',
      menu
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
