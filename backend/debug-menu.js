import mongoose from 'mongoose'
import Menu from './src/models/Menu.js'
import dotenv from 'dotenv'

dotenv.config()

async function checkMenus() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB\n')
    
    const menus = await Menu.find().sort({ date: 1 })
    console.log('=== ALL MENUS IN DATABASE ===')
    menus.forEach(menu => {
      console.log(`${menu.dayOfWeek} - ${menu.date.toISOString()} - ${menu.meals.length} meals`)
    })
    
    // Test weekly menu calculation
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    console.log(`\nToday (local): ${today.toISOString()}`)
    console.log(`Today day of week: ${today.getDay()} (0=Sunday, 1=Monday)`)
    
    const currentDay = today.getDay()
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)
    const monday = new Date(today)
    monday.setDate(diff)
    monday.setHours(0, 0, 0, 0)
    console.log(`Calculated Monday: ${monday.toISOString()}`)
    
    const sunday = new Date(monday)
    sunday.setDate(sunday.getDate() + 7)
    console.log(`Calculated Sunday: ${sunday.toISOString()}`)
    
    const weekMenus = await Menu.find({
      date: { $gte: monday, $lt: sunday }
    }).sort({ date: 1 })
    
    console.log(`\n=== WEEKLY MENUS FOUND: ${weekMenus.length} ===`)
    weekMenus.forEach(menu => {
      const breakfastCount = menu.meals.filter(m => m.timeSlot === 'breakfast').length
      const lunchCount = menu.meals.filter(m => m.timeSlot === 'lunch').length
      const hiTeaCount = menu.meals.filter(m => m.timeSlot === 'hiTea').length
      const dinnerCount = menu.meals.filter(m => m.timeSlot === 'dinner').length
      
      console.log(`${menu.dayOfWeek} (${menu.date.toISOString()}):`)
      console.log(`  - Breakfast: ${breakfastCount} items`)
      console.log(`  - Lunch: ${lunchCount} items`)
      console.log(`  - Hi-Tea: ${hiTeaCount} items`)
      console.log(`  - Dinner: ${dinnerCount} items`)
    })
    
    await mongoose.connection.close()
    console.log('\nDebug complete!')
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

checkMenus()
