import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UtensilsCrossed, Calendar, MessageSquare, TrendingUp, Sparkles } from 'lucide-react'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import SkeletonLoader from '../components/SkeletonLoader'
import { menuAPI, feedbackAPI } from '../services/api'
import { useToastStore } from '../store/toastStore'
import Button from '../components/Button'

function StudentDashboard() {
  const [loading, setLoading] = useState(true)
  const [menu, setMenu] = useState(null)
  const [summary, setSummary] = useState(null)
  const { addToast } = useToastStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [menuData, summaryData] = await Promise.all([
          menuAPI.getDailyMenu(),
          feedbackAPI.getSummary(),
        ])
        setMenu(menuData)
        setSummary(summaryData)
      } catch (error) {
        addToast('Failed to load data', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [addToast])

  if (loading) {
    return (
      <div className="space-y-8">
        <SkeletonLoader count={4} height="h-32" />
      </div>
    )
  }

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-400 dark:from-primary-600 dark:via-primary-500 dark:to-primary-400 rounded-2xl p-8 text-white dark:text-dark-100 animate-slideDown shadow-soft dark:shadow-soft-md">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
            <p className="text-primary-100 dark:text-primary-200 text-lg font-medium">{todayDate}</p>
          </div>
          <Sparkles className="w-10 h-10 text-primary-100 dark:text-primary-200 animate-float" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slideUp">
        <StatCard
          label="Today's Meals"
          value={menu ? Object.values(menu.today).filter(slot => slot.items.length > 0).reduce((sum, slot) => sum + slot.items.length, 0) : '0'}
          icon={UtensilsCrossed}
          color="primary"
        />
        <StatCard
          label="Avg Rating"
          value={summary?.avgRating.toFixed(1) || '0'}
          icon={TrendingUp}
          color="primary"
        />
        <StatCard
          label="Your Feedback"
          value={summary?.totalFeedback || '0'}
          icon={MessageSquare}
          color="primary"
        />
        <StatCard
          label="Best Meal"
          value={summary?.bestMeal || '—'}
          icon={UtensilsCrossed}
          color="primary"
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-6 animate-slideUp">
        <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/menu/daily">
            <Button className="w-full justify-center">
              <UtensilsCrossed className="w-5 h-5" />
              Today's Menu
            </Button>
          </Link>
          <Link to="/menu/weekly">
            <Button className="w-full justify-center">
              <Calendar className="w-5 h-5" />
              Weekly Menu
            </Button>
          </Link>
          <Link to="/feedback">
            <Button className="w-full justify-center">
              <MessageSquare className="w-5 h-5" />
              Give Feedback
            </Button>
          </Link>
        </div>
      </Card>

      {/* Today's Highlight */}
      {menu && (
        <Card className="p-8 bg-light-100 dark:bg-gradient-to-br dark:from-dark-700 dark:to-primary-900/40 border-light-200 dark:border-primary-700 animate-slideUp">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6">Today's Featured Meal</h2>
          <div className="space-y-4">
            <div className="bg-light-50 dark:bg-dark-800 rounded-xl p-5 border-l-4 border-primary-600 dark:border-primary-400">
              <h3 className="font-bold text-dark-900 dark:text-dark-100 text-lg mb-2">Lunch: 12:00 PM - 2:00 PM</h3>
              <p className="text-primary-700 dark:text-primary-300 font-bold text-xl">Kadai Paneer with Rice</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-primary-700 dark:text-primary-400 font-bold text-lg">4.7/5</span>
                <span className="text-dark-600 dark:text-dark-400 text-sm">(Most popular meal today)</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp">
        <Card className="p-6 bg-light-100 dark:bg-gradient-to-br dark:from-dark-700 dark:to-primary-900/30 border-light-200 dark:border-primary-700">
          <h3 className="font-bold text-dark-900 dark:text-dark-50 mb-3 flex items-center gap-2">
            <span className="text-primary-700 dark:text-primary-400">→</span> How to Use
          </h3>
          <ul className="text-sm text-dark-600 dark:text-dark-300 space-y-2 ml-4">
            <li><span className="font-semibold">View Menus:</span> Check today's or weekly meals</li>
            <li><span className="font-semibold">Rate Meals:</span> Give 1-5 star ratings</li>
            <li><span className="font-semibold">Send Feedback:</span> Report issues or suggestions</li>
            <li><span className="font-semibold">Track Status:</span> See feedback resolutions from wardens</li>
          </ul>
        </Card>

        <Card className="p-6 bg-light-100 dark:bg-gradient-to-br dark:from-dark-700 dark:to-secondary-900/30 border-light-200 dark:border-secondary-700">
          <h3 className="font-bold text-dark-900 dark:text-dark-50 mb-3 flex items-center gap-2">
            <span className="text-secondary-700 dark:text-secondary-400">★</span> Your Impact
          </h3>
          <p className="text-sm text-dark-600 dark:text-dark-300 mb-3">
            Your feedback helps us improve the mess menu and meal quality. Each suggestion matters!
          </p>
          <p className="text-xs text-dark-600 dark:text-dark-400 font-semibold">
            Resolved 3 issues this month
          </p>
        </Card>
      </div>
    </div>
  )
}

export default StudentDashboard
