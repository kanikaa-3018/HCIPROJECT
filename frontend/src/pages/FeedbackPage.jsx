import { useEffect, useState } from 'react'
import { MessageSquare, Send, AlertCircle, CheckCircle2, Filter } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import SkeletonLoader from '../components/SkeletonLoader'
import FeedbackItem from '../components/FeedbackItem'
import { feedbackAPI, menuAPI } from '../services/api'
import { useToastStore } from '../store/toastStore'

function FeedbackPage() {
  const [loading, setLoading] = useState(false)
  const [menu, setMenu] = useState(null)
  const [feedback, setFeedback] = useState([])
  const [filterResolution, setFilterResolution] = useState('all')
  const [formData, setFormData] = useState({
    mealId: '',
    meal: '',
    issue: 'taste',
    description: '',
    anonymous: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const { addToast } = useToastStore()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [menuData, feedbackData] = await Promise.all([
        menuAPI.getDailyMenu(),
        feedbackAPI.getFeedback(),
      ])
      setMenu({
        breakfast: menuData.today.breakfast,
        lunch: menuData.today.lunch,
        hiTea: menuData.today.hiTea,
        dinner: menuData.today.dinner,
      })
      setFeedback(feedbackData)
    } catch (error) {
      addToast('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const allMeals = menu && [
    ...menu.breakfast.items,
    ...menu.lunch.items,
    ...(menu.hiTea?.items || []),
    ...menu.dinner.items,
  ]

  const mealOptions = allMeals
    ? [
        { value: '', label: 'Select a meal...' },
        ...allMeals.map((meal) => ({ value: meal.id, label: meal.name })),
      ]
    : [{ value: '', label: 'Loading meals...' }]

  const issueOptions = [
    { value: 'taste', label: 'Taste' },
    { value: 'quantity', label: 'Quantity' },
    { value: 'hygiene', label: 'Hygiene' },
    { value: 'other', label: 'Other' },
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleMealChange = (e) => {
    const mealId = e.target.value
    const selected = allMeals?.find((m) => m.id === parseInt(mealId))
    setFormData({
      ...formData,
      mealId: parseInt(mealId) || '',
      meal: selected?.name || '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.mealId || !formData.description.trim()) {
      addToast('Please select a meal and provide feedback', 'error')
      return
    }

    if (formData.description.length < 10) {
      addToast('Feedback should be at least 10 characters', 'error')
      return
    }

    setLoading(true)
    try {
      await feedbackAPI.submitFeedback(formData)
      addToast('Thank you! Your feedback helps us improve.', 'success')
      setSubmitted(true)
      setFormData({
        mealId: '',
        meal: '',
        issue: 'taste',
        description: '',
        anonymous: false,
      })
      setTimeout(() => setSubmitted(false), 3000)
      fetchData()
    } catch (error) {
      addToast('Failed to submit feedback', 'error')
    } finally {
      setLoading(false)
    }
  }

  const filteredFeedback =
    filterResolution === 'all'
      ? feedback
      : filterResolution === 'resolved'
      ? feedback.filter((f) => f.resolved)
      : feedback.filter((f) => !f.resolved)

  const stats = {
    total: feedback.length,
    resolved: feedback.filter((f) => f.resolved).length,
    pending: feedback.filter((f) => !f.resolved).length,
  }

  if (loading && feedback.length === 0) {
    return <SkeletonLoader count={4} height="h-32" />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-slideDown">
        <h1 className="text-4xl font-bold text-primary-600 dark:bg-gradient-to-r dark:from-primary-400 dark:to-primary-300 dark:bg-clip-text dark:text-transparent mb-2">
          Share Your Feedback
        </h1>
        <p className="text-dark-600 dark:text-dark-300 text-lg font-medium">
          Your feedback directly impacts meal quality. Help us serve better!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slideUp">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{stats.total}</p>
          <p className="text-sm text-dark-600 dark:text-dark-400 mt-1">Total Feedback</p>
        </Card>
        <Card className="p-4 text-center border-primary-300 dark:border-primary-700">
          <p className="text-3xl font-bold text-primary-700 dark:text-primary-400">{stats.resolved}</p>
          <p className="text-sm text-dark-600 dark:text-dark-400 mt-1">Resolved</p>
        </Card>
        <Card className="p-4 text-center border-accent-300 dark:border-accent-700">
          <p className="text-3xl font-bold text-accent-700 dark:text-accent-400">{stats.pending}</p>
          <p className="text-sm text-dark-600 dark:text-dark-400 mt-1">Under Review</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feedback Form */}
        <div className="lg:col-span-2 animate-slideUp">
          <Card className="p-6 md:p-8 bg-light-100 dark:bg-dark-700 dark:bg-gradient-to-br dark:from-primary-600/20 dark:to-primary-700/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary-200 dark:bg-primary-600/20 rounded-xl border border-primary-300 dark:border-primary-700">
                <MessageSquare className="w-6 h-6 text-primary-700 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50">Submit Feedback</h2>
                <p className="text-sm text-dark-600 dark:text-dark-300">Help us understand your experience</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Meal Selection */}
              <Select
                label="Meal Feedback (Required)"
                name="meal"
                value={formData.mealId}
                onChange={handleMealChange}
                options={mealOptions}
              />

              {/* Issue Type */}
              <Select
                label="What's the issue? (Required)"
                name="issue"
                value={formData.issue}
                onChange={handleInputChange}
                options={issueOptions}
              />

              {/* Detailed Feedback */}
              <div>
                <label className="block text-sm font-semibold text-dark-900 dark:text-dark-200 mb-2">
                  Your Detailed Feedback (Required)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Please be specific and constructive. What can we improve? (Min. 10 characters)"
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-light-200 dark:border-dark-600 rounded-xl bg-light-50 dark:bg-dark-700 text-dark-900 dark:text-dark-100 placeholder-dark-600 dark:placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all duration-300"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-dark-600 dark:text-dark-400">
                    {formData.description.length}/500 characters
                  </p>
                  {formData.description.length >= 10 && (
                    <p className="text-xs text-primary-700 dark:text-primary-400">Character limit OK</p>
                  )}
                </div>
              </div>

              {/* Anonymous Toggle */}
              <label className="flex items-center gap-3 p-4 rounded-xl bg-light-100 dark:bg-dark-600/50 cursor-pointer hover:bg-light-200 dark:hover:bg-dark-600 transition-colors border border-light-200 dark:border-dark-600">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary-500 rounded cursor-pointer accent-primary-500"
                />
                <div>
                  <p className="font-semibold text-dark-900 dark:text-dark-100">Send as Anonymous</p>
                  <p className="text-xs text-dark-600 dark:text-dark-400">Your name won't be shared</p>
                </div>
              </label>

              {/* Submit Button */}
              <Button
                type="submit"
                loading={loading}
                disabled={loading || !formData.mealId}
                className="w-full"
                size="lg"
              >
                <Send className="w-5 h-5" />
                Submit Feedback
              </Button>

              {submitted && (
                <div className="p-4 bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700 rounded-xl animate-slideUp">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary-700 dark:text-primary-400" />
                    <p className="text-primary-700 dark:text-primary-300 font-semibold">Your feedback has been recorded!</p>
                  </div>
                  <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">The warden will review and take action soon.</p>
                </div>
              )}
            </form>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-4 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <Card className="p-5 bg-light-100 dark:bg-gradient-to-br dark:from-dark-700 dark:to-primary-900/30 border-primary-300 dark:border-primary-700">
            <h3 className="font-semibold text-primary-700 dark:text-primary-300 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Feedback Tips
            </h3>
            <ul className="text-sm text-dark-600 dark:text-dark-300 space-y-2">
              <li>Be specific about issues</li>
              <li>Suggest improvements</li>
              <li>Use constructive language</li>
              <li>Mention meal names clearly</li>
              <li>Check if already resolved</li>
            </ul>
          </Card>

          <Card className="p-5 bg-light-100 dark:bg-gradient-to-br dark:from-dark-700 dark:to-secondary-900/30 border-secondary-300 dark:border-secondary-700">
            <h3 className="font-semibold text-secondary-700 dark:text-secondary-300 mb-3">
              Impact Your Meal
            </h3>
            <p className="text-sm text-dark-600 dark:text-dark-300">
              Each feedback helps the warden improve the mess. Your voice matters!
            </p>
          </Card>
        </div>
      </div>

      {/* Submitted Feedbacks Section */}
      <div className="animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50">Community Feedback</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-dark-600 dark:text-dark-400" />
            <select
              value={filterResolution}
              onChange={(e) => setFilterResolution(e.target.value)}
              className="px-4 py-2 border-2 border-light-200 dark:border-dark-600 rounded-lg bg-light-100 dark:bg-dark-700 text-dark-900 dark:text-dark-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
            >
              <option value="all">All Feedback</option>
              <option value="resolved">Resolved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {filteredFeedback.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFeedback.map((fb) => (
              <FeedbackItem key={fb.id} feedback={fb} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-dark-400 dark:text-dark-600 mx-auto mb-4" />
            <p className="text-dark-600 dark:text-dark-400">
              {filterResolution === 'all'
                ? 'No feedback yet. Be the first to share!'
                : filterResolution === 'resolved'
                ? 'No resolved feedback yet'
                : 'All feedback has been resolved!'}
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

export default FeedbackPage
