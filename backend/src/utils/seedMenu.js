import Menu from '../models/Menu.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const seedMenu = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')

    // Clear existing menus
    await Menu.deleteMany({})
    console.log('Cleared existing menus')

    // Get start date (Monday of current week)
    const today = new Date()
    const currentDay = today.getDay()
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)
    const monday = new Date(today.setDate(diff))
    monday.setHours(0, 0, 0, 0)

    // Menu data for the week
    const weeklyMenuData = [
      {
        day: 'Monday',
        meals: [
          { name: 'Sandwich', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Upma', type: 'veg', timeSlot: 'breakfast' },
          
          { name: 'Rajma', type: 'veg', timeSlot: 'lunch' },
          { name: 'Salad', type: 'veg', timeSlot: 'lunch' },
          { name: 'Rice', type: 'veg', timeSlot: 'lunch' },
          { name: 'Roti', type: 'veg', timeSlot: 'lunch' },
          { name: 'Aloo Sabji', type: 'veg', timeSlot: 'lunch' },
          { name: 'Kaddu Sabji', type: 'veg', timeSlot: 'lunch' },
          { name: 'Poori', type: 'veg', timeSlot: 'lunch' },
          { name: 'Veg Raita', type: 'veg', timeSlot: 'lunch' },
          
          { name: 'Maggi', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Toast', type: 'veg', timeSlot: 'hiTea' },
          
          { name: 'Rajma', type: 'veg', timeSlot: 'dinner' },
          { name: 'Salad', type: 'veg', timeSlot: 'dinner' },
          { name: 'Rice', type: 'veg', timeSlot: 'dinner' },
          { name: 'Achar', type: 'veg', timeSlot: 'dinner' },
          { name: 'Matar Paneer', type: 'veg', timeSlot: 'dinner' },
          { name: 'Toor Dal', type: 'veg', timeSlot: 'dinner' }
        ]
      },
      {
        day: 'Tuesday',
        meals: [
          { name: 'Pav Bhaji', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Sprouts', type: 'veg', timeSlot: 'breakfast' },
          
          { name: 'Kadhi', type: 'veg', timeSlot: 'lunch' },
          { name: 'Aloo Sabji', type: 'veg', timeSlot: 'lunch' },
          { name: 'Fry Mirch', type: 'veg', timeSlot: 'lunch' },
          { name: 'Papad', type: 'veg', timeSlot: 'lunch' },
          
          { name: 'Tea', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Namkeen', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Sewai', type: 'veg', timeSlot: 'hiTea' },
          
          { name: 'Dosa', type: 'veg', timeSlot: 'dinner' },
          { name: 'Sambhar', type: 'veg', timeSlot: 'dinner' },
          { name: 'Chutney', type: 'veg', timeSlot: 'dinner' },
          { name: 'Rice', type: 'veg', timeSlot: 'dinner' },
          { name: 'Moong Dal Halwa', type: 'veg', timeSlot: 'dinner' }
        ]
      },
      {
        day: 'Wednesday',
        meals: [
          { name: 'Poha', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Jalebi', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Omelette', type: 'non-veg', timeSlot: 'breakfast' },
          
          { name: 'Chole Bhature', type: 'veg', timeSlot: 'lunch' },
          { name: 'Boondi Raita', type: 'veg', timeSlot: 'lunch' },
          { name: 'Fry Mirch', type: 'veg', timeSlot: 'lunch' },
          
          { name: 'Tea', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Coffee', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Bread Pakoda', type: 'veg', timeSlot: 'hiTea' },
          
          { name: 'Mix Dal Tadka', type: 'veg', timeSlot: 'dinner' },
          { name: 'Methi Aloo', type: 'veg', timeSlot: 'dinner' },
          { name: 'Rice', type: 'veg', timeSlot: 'dinner' }
        ]
      },
      {
        day: 'Thursday',
        meals: [
          { name: 'Paneer Bhurji', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Paratha', type: 'veg', timeSlot: 'breakfast' },
          
          { name: 'Black Channa Sabji', type: 'veg', timeSlot: 'lunch' },
          { name: 'Toor Dal', type: 'veg', timeSlot: 'lunch' },
          { name: 'Papad', type: 'veg', timeSlot: 'lunch' },
          { name: 'Lassi', type: 'veg', timeSlot: 'lunch' },
          
          { name: 'Tea', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Bhujia', type: 'veg', timeSlot: 'hiTea' },
          
          { name: 'Black Masoor Dal', type: 'veg', timeSlot: 'dinner' },
          { name: 'Sabji', type: 'veg', timeSlot: 'dinner' },
          { name: 'Aloo Peas', type: 'veg', timeSlot: 'dinner' },
          { name: 'Gulab Jamun', type: 'veg', timeSlot: 'dinner' }
        ]
      },
      {
        day: 'Friday',
        meals: [
          { name: 'Idli', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Sambhar', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Chutney', type: 'veg', timeSlot: 'breakfast' },
          
          { name: 'Veg Biryani', type: 'veg', timeSlot: 'lunch' },
          { name: 'Onion Raita', type: 'veg', timeSlot: 'lunch' },
          { name: 'Aloo Shimla', type: 'veg', timeSlot: 'lunch' },
          { name: 'Green Chutney', type: 'veg', timeSlot: 'lunch' },
          
          { name: 'Tea', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Samosa', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Green & Imli Chutney', type: 'veg', timeSlot: 'hiTea' },
          
          { name: 'Yellow Dal', type: 'veg', timeSlot: 'dinner' },
          { name: 'Kadhi', type: 'veg', timeSlot: 'dinner' }
        ]
      },
      {
        day: 'Saturday',
        meals: [
          { name: 'Onion Paratha', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Aloo Sabji', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Sprouts', type: 'veg', timeSlot: 'breakfast' },
          
          { name: 'Paneer Sabji', type: 'veg', timeSlot: 'lunch' },
          { name: 'Dal', type: 'veg', timeSlot: 'lunch' },
          { name: 'Lauki Chana Sabji', type: 'veg', timeSlot: 'lunch' },
          { name: 'Dry Papad', type: 'veg', timeSlot: 'lunch' },
          
          { name: 'Tea', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Coffee', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Pasta', type: 'veg', timeSlot: 'hiTea' },
          
          { name: 'Punjabi Dal Tadka', type: 'veg', timeSlot: 'dinner' },
          { name: 'Aloo Baingan', type: 'veg', timeSlot: 'dinner' },
          { name: 'Any Sweet', type: 'veg', timeSlot: 'dinner' }
        ]
      },
      {
        day: 'Sunday',
        meals: [
          { name: 'Uttapam', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Chutney', type: 'veg', timeSlot: 'breakfast' },
          { name: 'Sambhar', type: 'veg', timeSlot: 'breakfast' },
          
          { name: 'Chana Dal', type: 'veg', timeSlot: 'lunch' },
          { name: 'Dahi', type: 'veg', timeSlot: 'lunch' },
          { name: 'Aloo Paratha', type: 'veg', timeSlot: 'lunch' },
          { name: 'Green Chutney', type: 'veg', timeSlot: 'lunch' },
          
          { name: 'Tea', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Pav', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Bread', type: 'veg', timeSlot: 'hiTea' },
          { name: 'Chutney', type: 'veg', timeSlot: 'hiTea' },
          
          { name: 'Egg Curry', type: 'non-veg', timeSlot: 'dinner' },
          { name: 'Paneer Bhurji', type: 'veg', timeSlot: 'dinner' }
        ]
      }
    ]

    // Create menu documents for each day
    const menus = weeklyMenuData.map((dayData, index) => {
      const date = new Date(monday)
      date.setDate(date.getDate() + index)
      date.setHours(0, 0, 0, 0)
      
      return {
        date,
        dayOfWeek: dayData.day,
        meals: dayData.meals
      }
    })

    // Insert all menus
    const result = await Menu.insertMany(menus)
    console.log(`✅ Successfully seeded ${result.length} days of menus`)

    console.log('\nMenu Summary:')
    result.forEach(menu => {
      console.log(`${menu.dayOfWeek} (${menu.date.toDateString()}):`)
      console.log(`  - Breakfast: ${menu.meals.filter(m => m.timeSlot === 'breakfast').length} items`)
      console.log(`  - Lunch: ${menu.meals.filter(m => m.timeSlot === 'lunch').length} items`)
      console.log(`  - Hi-Tea: ${menu.meals.filter(m => m.timeSlot === 'hiTea').length} items`)
      console.log(`  - Dinner: ${menu.meals.filter(m => m.timeSlot === 'dinner').length} items`)
    })

    mongoose.connection.close()
    console.log('\n✅ Database connection closed')
  } catch (error) {
    console.error('❌ Error seeding menu:', error.message)
    process.exit(1)
  }
}

seedMenu()
