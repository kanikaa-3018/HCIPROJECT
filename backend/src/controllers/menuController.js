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

    // Transform meals into grouped format
    const mealsByType = {
      breakfast: { name: 'Breakfast', time: '7:00 AM', items: [] },
      lunch: { name: 'Lunch', time: '12:00 PM', items: [] },
      hiTea: { name: 'Hi-Tea', time: '4:00 PM', items: [] },
      dinner: { name: 'Dinner', time: '7:30 PM', items: [] }
    }

    menu.meals.forEach((meal) => {
      const meal_obj = {
        id: meal._id.toString(),
        name: meal.name,
        type: meal.type,
        description: meal.description || ''
      }
      
      if (meal.timeSlot === 'breakfast') {
        mealsByType.breakfast.items.push(meal_obj)
      } else if (meal.timeSlot === 'lunch') {
        mealsByType.lunch.items.push(meal_obj)
      } else if (meal.timeSlot === 'hiTea') {
        mealsByType.hiTea.items.push(meal_obj)
      } else if (meal.timeSlot === 'dinner') {
        mealsByType.dinner.items.push(meal_obj)
      }
    })

    res.json({
      date: menu.date,
      dayOfWeek: menu.dayOfWeek,
      today: mealsByType
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getWeeklyMenu = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Calculate Monday of current week
    const currentDay = today.getDay()
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)
    const monday = new Date()
    monday.setDate(diff)
    monday.setHours(0, 0, 0, 0)
    
    // Calculate Sunday (end of week)
    const sunday = new Date(monday)
    sunday.setDate(sunday.getDate() + 7)

    const menus = await Menu.find({
      date: { $gte: monday, $lt: sunday }
    }).sort({ date: 1 })

    if (menus.length === 0) {
      return res.status(404).json({ message: 'No menu available for this week' })
    }

    // Transform each day's menu to simple format
    const weeklyData = menus.map(menu => {
      const mealsByType = {
        breakfast: [],
        lunch: [],
        hiTea: [],
        dinner: []
      }

      menu.meals.forEach((meal) => {
        if (meal.timeSlot === 'breakfast') {
          mealsByType.breakfast.push(meal.name)
        } else if (meal.timeSlot === 'lunch') {
          mealsByType.lunch.push(meal.name)
        } else if (meal.timeSlot === 'hiTea') {
          mealsByType.hiTea.push(meal.name)
        } else if (meal.timeSlot === 'dinner') {
          mealsByType.dinner.push(meal.name)
        }
      })

      return {
        day: menu.dayOfWeek,
        date: menu.date,
        breakfast: mealsByType.breakfast.join(', ') || 'TBD',
        lunch: mealsByType.lunch.join(', ') || 'TBD',
        hiTea: mealsByType.hiTea.join(', ') || 'TBD',
        dinner: mealsByType.dinner.join(', ') || 'TBD'
      }
    })

    res.json(weeklyData)
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
