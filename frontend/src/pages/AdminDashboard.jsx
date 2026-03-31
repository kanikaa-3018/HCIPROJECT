import { useEffect, useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { TrendingUp, AlertCircle, Users, BarChart3 } from 'lucide-react'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import SkeletonLoader from '../components/SkeletonLoader'
import Button from '../components/Button'
import { analyticsAPI, feedbackAPI } from '../services/api'
import { useToastStore } from '../store/toastStore'

function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)
  const [summary, setSummary] = useState(null)
  const { addToast } = useToastStore()

  const COLORS = ['#3ebab3', '#e68870', '#f1b950', '#69ccbb', '#84dcc1', '#8b5cf6']
  const chartBg = '#111827'
  const chartText = '#e5e7eb'
  const gridColor = '#374151'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [analyticsData, summaryData] = await Promise.all([
        analyticsAPI.getAnalytics(),
        feedbackAPI.getSummary(),
      ])
      setAnalytics(analyticsData)
      setSummary(summaryData)
    } catch (error) {
      addToast('Failed to load analytics', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <SkeletonLoader count={5} height="h-64" />
  }

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-400 dark:from-primary-600 dark:to-primary-500 rounded-2xl p-8 text-white dark:text-dark-100 animate-slideDown shadow-soft dark:shadow-soft-md">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-primary-100 dark:text-primary-200 text-lg">Mess analytics, ratings, and feedback overview</p>
          </div>
          <BarChart3 className="w-10 h-10 text-primary-100 dark:text-primary-200 animate-float" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slideUp">
        <StatCard
          label="Total Feedback"
          value={summary?.totalFeedback || '0'}
          icon={Users}
          color="primary"
        />
        <StatCard
          label="Average Rating"
          value={summary?.avgRating.toFixed(1) || '0'}
          icon={TrendingUp}
          color="secondary"
        />
        <StatCard
          label="Most Reported Issue"
          value={summary?.mostCommonIssue || '—'}
          icon={AlertCircle}
          color="accent"
        />
        <StatCard
          label="Top Meal"
          value={summary?.bestMeal || '—'}
          color="primary"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slideUp">
        {/* Meal Ratings Bar Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-4">Meal Ratings (Average)</h3>
          {analytics?.ratings ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.ratings} margin={{ bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="meal" angle={-45} textAnchor="end" height={80} tick={{ fill: chartText, fontSize: 12 }} />
                <YAxis domain={[0, 5]} tick={{ fill: chartText }} />
                <Tooltip
                  formatter={(value) => value.toFixed(1)}
                  contentStyle={{ backgroundColor: chartBg, border: `1px solid ${gridColor}`, borderRadius: '8px', color: chartText }}
                />
                <Bar dataKey="avg" fill="#3ebab3" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </Card>

        {/* Issue Distribution Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-4">Feedback Issues Distribution</h3>
          {analytics?.issues ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.issues}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, count }) => `${type} (${count})`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.issues.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value} contentStyle={{ backgroundColor: chartBg, border: `1px solid ${gridColor}`, color: chartText }} />
              </PieChart>
            </ResponsiveContainer>
          ) : null}
        </Card>
      </div>

      {/* Daily Ratings Trend */}
      <Card className="p-6 animate-slideUp">
        <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-4">Weekly Rating Trend</h3>
        {analytics?.dailyRatings ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.dailyRatings}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="day" tick={{ fill: chartText }} />
              <YAxis domain={[0, 5]} tick={{ fill: chartText }} />
              <Tooltip
                formatter={(value) => value.toFixed(1)}
                contentStyle={{ backgroundColor: chartBg, border: `1px solid ${gridColor}`, borderRadius: '8px', color: chartText }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', color: chartText }} />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#3ebab3"
                strokeWidth={3}
                dot={{ fill: '#3ebab3', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : null}
      </Card>

      {/* Issues Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp">
        {/* Top Issues */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-5">Issue Breakdown</h3>
          <div className="space-y-3">
            {analytics?.issues?.map((issue, idx) => (
              <div key={issue.type} className="flex items-center justify-between p-3 bg-light-100 dark:bg-dark-600/50 rounded-lg hover:bg-light-200 dark:hover:bg-dark-600 transition-colors border border-light-200 dark:border-dark-600">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-dark-900 dark:text-dark-100 font-semibold capitalize">{issue.type}</span>
                </div>
                <span className="text-dark-900 dark:text-dark-50 font-bold text-lg">{issue.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Meals */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-5">Top 5 Meals</h3>
          <div className="space-y-3">
            {analytics?.ratings?.slice(0, 5).map((meal, idx) => (
              <div key={meal.meal} className="flex items-center justify-between p-3 bg-light-100 dark:bg-gradient-to-r dark:from-primary-600/20 dark:to-primary-700/20 rounded-lg hover:shadow-soft dark:hover:shadow-glow-sm transition-shadow border border-light-200 dark:border-primary-700">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary-700 dark:text-primary-400">#{idx + 1}</span>
                  <span className="text-dark-900 dark:text-dark-100 font-semibold">{meal.meal}</span>
                </div>
                <div className="text-right">
                  <p className="text-primary-700 dark:text-primary-400 font-bold">{meal.avg.toFixed(1)}/5</p>
                  <p className="text-xs text-dark-600 dark:text-dark-400">{meal.count} ratings</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Actions */}
      <Card className="p-6 bg-gradient-to-r from-primary-600/20 to-primary-700/20 border-primary-700 animate-slideUp">
        <h3 className="font-bold text-dark-50 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-400" /> Admin Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button>
            Generate Weekly Report
          </Button>
          <Button>
            Export Analytics
          </Button>
          <Button>
            View All Feedback
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default AdminDashboard
