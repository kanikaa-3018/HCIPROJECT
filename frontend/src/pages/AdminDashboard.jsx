import { useEffect, useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { TrendingUp, AlertCircle, Users, BarChart3, Download, FileText, ClipboardList } from 'lucide-react'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import SkeletonLoader from '../components/SkeletonLoader'
import Button from '../components/Button'
import { analyticsAPI } from '../services/api'
import { useToastStore } from '../store/toastStore'

function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)
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
      const analyticsData = await analyticsAPI.getAnalytics()
      setAnalytics(analyticsData)
    } catch (error) {
      addToast('Failed to load analytics', 'error')
    } finally {
      setLoading(false)
    }
  }
  const handleGenerateReport = () => {
    try {
      if (!analytics) {
        addToast('No analytics data available', 'warning')
        return
      }

      const reportContent = `WEEKLY ANALYTICS REPORT
Generated: ${new Date().toLocaleString()}

${'='.repeat(60)}
STATISTICS
${'='.repeat(60)}
Total Ratings: ${analytics.statistics?.totalRatings || 0}
Total Feedback: ${analytics.statistics?.totalFeedback || 0}
Average Overall Rating: ${analytics.statistics?.averageOverallRating?.toFixed(2) || 'N/A'}/5
Best Meal: ${analytics.statistics?.bestMeal || 'N/A'}
Most Common Issue: ${analytics.statistics?.mostCommonIssue || 'N/A'}

${'='.repeat(60)}
TOP RATED MEALS
${'='.repeat(60)}
${analytics.ratings?.map((r, i) => `${i + 1}. ${r.meal}: ${r.avg?.toFixed(2)}/5 (${r.count} ratings)`).join('\n') || 'No data'}

${'='.repeat(60)}
FEEDBACK ISSUES
${'='.repeat(60)}
${analytics.issues?.map((i) => `• ${i.type}: ${i.count} reports`).join('\n') || 'No data'}

${'='.repeat(60)}
7-DAY RATING TREND
${'='.repeat(60)}
${analytics.dailyRatings?.map(d => `${d.day}: ${d.avg?.toFixed(2)}/5`).join('\n') || 'No data'}`

      const blob = new Blob([reportContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Weekly_Report_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      addToast('Weekly report generated successfully', 'success')
    } catch (error) {
      addToast('Failed to generate report', 'error')
      console.error(error)
    }
  }

  const handleExportAnalytics = () => {
    try {
      if (!analytics) {
        addToast('No analytics data available', 'warning')
        return
      }

      const csvContent = [
        ['Metric', 'Value'],
        ['Total Ratings', analytics.statistics?.totalRatings || 0],
        ['Total Feedback', analytics.statistics?.totalFeedback || 0],
        ['Average Rating', analytics.statistics?.averageOverallRating?.toFixed(2) || 'N/A'],
        ['Best Meal', analytics.statistics?.bestMeal || 'N/A'],
        ['Most Common Issue', analytics.statistics?.mostCommonIssue || 'N/A'],
        [],
        ['Meal', 'Average Rating', 'Number of Ratings'],
        ...analytics.ratings?.map(r => [r.meal, r.avg?.toFixed(2) || 'N/A', r.count]) || [],
        [],
        ['Issue Type', 'Count'],
        ...analytics.issues?.map(i => [i.type, i.count]) || [],
      ]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `Analytics_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      addToast('Analytics exported as CSV', 'success')
    } catch (error) {
      addToast('Failed to export analytics', 'error')
      console.error(error)
    }
  }

  const handleViewAllFeedback = () => {
    addToast('Navigate to Feedback page to view all feedback', 'info')
    // In a real app, you might navigate using React Router
    window.location.href = '/feedback'
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
          value={analytics?.statistics?.totalFeedback || '0'}
          icon={Users}
          color="primary"
        />
        <StatCard
          label="Average Rating"
          value={analytics?.statistics?.averageOverallRating?.toFixed(1) || '0'}
          icon={TrendingUp}
          color="secondary"
        />
        <StatCard
          label="Most Reported Issue"
          value={analytics?.statistics?.mostCommonIssue ? analytics.statistics.mostCommonIssue.charAt(0).toUpperCase() + analytics.statistics.mostCommonIssue.slice(1) : '—'}
          icon={AlertCircle}
          color="accent"
        />
        <StatCard
          label="Top Meal"
          value={analytics?.statistics?.bestMeal || '—'}
          color="primary"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slideUp">
        {/* Meal Ratings Bar Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-4">Meal Ratings (Average)</h3>
          {analytics?.ratings && analytics.ratings.length > 0 ? (
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
          ) : (
            <div className="text-center text-dark-600 dark:text-dark-400 py-8">
              <p>No rating data available</p>
            </div>
          )}
        </Card>

        {/* Issue Distribution Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-4">Feedback Issues Distribution</h3>
          {analytics?.issues && analytics.issues.length > 0 ? (
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
          ) : (
            <div className="text-center text-dark-600 dark:text-dark-400 py-8">
              <p>No issue data available</p>
            </div>
          )}
        </Card>
      </div>

      {/* Daily Ratings Trend */}
      <Card className="p-6 animate-slideUp">
        <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-4">Weekly Rating Trend</h3>
        {analytics?.dailyRatings && analytics.dailyRatings.length > 0 ? (
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
        ) : (
          <div className="text-center text-dark-600 dark:text-dark-400 py-8">
            <p>No rating data available</p>
          </div>
        )}
      </Card>

      {/* Issues Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp">
        {/* Top Issues */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-5">Issue Breakdown</h3>
          <div className="space-y-3">
            {analytics?.issues && analytics.issues.length > 0 ? (
              analytics.issues.map((issue, idx) => (
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
              ))
            ) : (
              <p className="text-center text-dark-600 dark:text-dark-400 py-4">No feedback issues data</p>
            )}
          </div>
        </Card>

        {/* Top Meals */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-5">Top 5 Meals</h3>
          <div className="space-y-3">
            {analytics?.ratings && analytics.ratings.length > 0 ? (
              analytics.ratings.slice(0, 5).map((meal, idx) => (
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
              ))
            ) : (
              <p className="text-center text-dark-600 dark:text-dark-400 py-4">No meal ratings data</p>
            )}
          </div>
        </Card>
      </div>

      {/* Actions */}
      <Card className="p-6 bg-gradient-to-br from-primary-700/30 via-primary-600/20 to-teal-500/20 border-primary-600 shadow-lg shadow-primary-500/10 animate-slideUp">
        <h3 className="font-bold text-dark-50 mb-5 flex items-center gap-2 text-lg">
          <BarChart3 className="w-6 h-6 text-primary-300" /> Admin Actions
        </h3>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="primary"
            size="md"
            onClick={handleGenerateReport}
            className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 shadow-lg hover:shadow-xl hover:shadow-teal-500/30"
          >
            <FileText className="w-5 h-5" />
            Generate Weekly Report
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleExportAnalytics}
            className="bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 shadow-lg hover:shadow-xl hover:shadow-blue-500/30"
          >
            <Download className="w-5 h-5" />
            Export Analytics
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleViewAllFeedback}
            className="bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500 shadow-lg hover:shadow-xl hover:shadow-purple-500/30"
          >
            <ClipboardList className="w-5 h-5" />
            View All Feedback
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default AdminDashboard
