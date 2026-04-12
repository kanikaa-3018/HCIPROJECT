import { useEffect, useState } from 'react'
import { MessageSquare, CheckCircle2, AlertCircle, Clock, Star, ChevronDown, ChevronUp, Filter } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import Select from '../components/Select'
import SkeletonLoader from '../components/SkeletonLoader'
import { analyticsAPI } from '../services/api'
import { useToastStore } from '../store/toastStore'

function AdminFeedback() {
  const [loading, setLoading] = useState(false)
  const [feedbackData, setFeedbackData] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedMeal, setSelectedMeal] = useState('')
  const [expandedMeal, setExpandedMeal] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { addToast } = useToastStore()

  useEffect(() => {
    fetchFeedback()
  }, [selectedStatus, selectedMeal, currentPage])

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      const data = await analyticsAPI.getAllFeedback(selectedStatus, selectedMeal, currentPage, 15)
      setFeedbackData(data)
    } catch (error) {
      addToast('Failed to load feedback', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (feedbackId, newStatus) => {
    try {
      await analyticsAPI.updateFeedbackStatus(feedbackId, newStatus)
      addToast(`Feedback marked as ${newStatus}`, 'success')
      fetchFeedback()
    } catch (error) {
      addToast('Failed to update feedback status', 'error')
    }
  }

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'resolved', label: 'Resolved' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700'
      case 'reviewed':
        return 'text-secondary-600 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-900/30 border-secondary-300 dark:border-secondary-700'
      case 'resolved':
        return 'text-accent-600 dark:text-accent-400 bg-accent-100 dark:bg-accent-900/30 border-accent-300 dark:border-accent-700'
      default:
        return 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900/30 border-neutral-300 dark:border-neutral-700'
    }
  }

  const getIssueColor = (issueType) => {
    switch (issueType) {
      case 'taste':
        return 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
      case 'hygiene':
        return 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400'
      case 'quantity':
        return 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400'
      default:
        return 'bg-neutral-100 dark:bg-neutral-900/30 text-neutral-700 dark:text-neutral-400'
    }
  }

  if (loading && !feedbackData) {
    return <SkeletonLoader count={5} height="h-40" />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-700 dark:to-primary-600 rounded-2xl p-8 text-white dark:text-dark-100 animate-slideDown shadow-soft dark:shadow-soft-md">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Feedback Management</h1>
            <p className="text-primary-100 dark:text-primary-200 text-lg font-medium">Review and manage student feedback</p>
          </div>
          <MessageSquare className="w-10 h-10 text-primary-100 dark:text-primary-200 animate-float" />
        </div>
      </div>

      {/* Statistics */}
      {feedbackData?.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slideUp">
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{feedbackData.stats.byStatus.pending || 0}</p>
            <p className="text-sm text-dark-600 dark:text-dark-400 mt-1">Pending</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{feedbackData.stats.byStatus.reviewed || 0}</p>
            <p className="text-sm text-dark-600 dark:text-dark-400 mt-1">Reviewed</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{feedbackData.stats.byStatus.resolved || 0}</p>
            <p className="text-sm text-dark-600 dark:text-dark-400 mt-1">Resolved</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-accent-600 dark:text-accent-400">{feedbackData.pagination.totalFeedback}</p>
            <p className="text-sm text-dark-600 dark:text-dark-400 mt-1">Total</p>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideUp">
        <Select
          label="Filter by Status"
          options={statusOptions}
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value)
            setCurrentPage(1)
          }}
        />
        <input
          type="text"
          placeholder="Search by meal name..."
          value={selectedMeal}
          onChange={(e) => {
            setSelectedMeal(e.target.value)
            setCurrentPage(1)
          }}
          className="px-4 py-2.5 border-2 border-light-200 dark:border-dark-600 rounded-xl bg-light-50 dark:bg-dark-700 text-dark-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Feedback by Meal */}
      <div className="space-y-4 animate-slideUp">
        {feedbackData?.feedback && Object.keys(feedbackData.feedback).length > 0 ? (
          Object.entries(feedbackData.feedback).map(([mealName, feedbackList]) => (
            <Card key={mealName} className="overflow-hidden">
              <button
                onClick={() => setExpandedMeal(expandedMeal === mealName ? null : mealName)}
                className="w-full p-6 flex items-center justify-between bg-gradient-to-r from-light-100 to-light-50 dark:from-dark-700 dark:to-dark-600 hover:from-light-200 dark:hover:from-dark-600 transition-all"
              >
                <div className="flex items-center gap-4">
                  <MessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  <div className="text-left">
                    <h3 className="font-bold text-lg text-dark-900 dark:text-dark-50">{mealName}</h3>
                    <p className="text-sm text-dark-600 dark:text-dark-400">{feedbackList.length} feedback(s)</p>
                  </div>
                </div>
                {expandedMeal === mealName ? (
                  <ChevronUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                )}
              </button>

              {expandedMeal === mealName && (
                <div className="p-6 space-y-4 bg-light-50 dark:bg-dark-700">
                  {feedbackList.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="p-4 border-2 border-light-200 dark:border-dark-600 rounded-xl bg-white dark:bg-dark-600/50 hover:shadow-soft dark:hover:shadow-glow-sm transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-dark-900 dark:text-dark-50">
                            {feedback.isAnonymous ? '👤 Anonymous' : feedback.user}
                          </p>
                          <p className="text-xs text-dark-600 dark:text-dark-400">
                            {feedback.day} • {new Date(feedback.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getStatusColor(feedback.status)}`}>
                          {feedback.status === 'pending' && <Clock className="w-4 h-4 inline mr-1" />}
                          {feedback.status === 'reviewed' && <AlertCircle className="w-4 h-4 inline mr-1" />}
                          {feedback.status === 'resolved' && <CheckCircle2 className="w-4 h-4 inline mr-1" />}
                          {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                        </span>
                      </div>

                      {/* Issue Tag */}
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className={`px-3 py-1 rounded-lg text-sm font-bold capitalize ${getIssueColor(feedback.issue)}`}>
                          {feedback.issue}
                        </span>
                        {feedback.rating && (
                          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm font-bold">
                            <Star className="w-4 h-4 fill-current" />
                            {feedback.rating}/5
                          </span>
                        )}
                      </div>

                      {/* Comment */}
                      <p className="text-dark-700 dark:text-dark-300 mb-4 p-3 bg-light-100 dark:bg-dark-500 rounded-lg">
                        "{feedback.comment}"
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-wrap">
                        {feedback.status !== 'reviewed' && (
                          <Button
                            size="sm"
                            variant="primary"
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={() => handleStatusChange(feedback.id, 'reviewed')}
                          >
                            Mark Reviewed
                          </Button>
                        )}
                        {feedback.status !== 'resolved' && (
                          <Button
                            size="sm"
                            variant="primary"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleStatusChange(feedback.id, 'resolved')}
                          >
                            Mark Resolved
                          </Button>
                        )}
                        {feedback.status !== 'pending' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleStatusChange(feedback.id, 'pending')}
                          >
                            Revert to Pending
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-dark-400 dark:text-dark-600 mx-auto mb-4" />
            <p className="text-dark-600 dark:text-dark-400 text-lg">No feedback found</p>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {feedbackData?.pagination && feedbackData.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 animate-slideUp">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: feedbackData.pagination.totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, currentPage - 2), Math.min(feedbackData.pagination.totalPages, currentPage + 2))
              .map((page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={page === currentPage ? 'primary' : 'secondary'}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setCurrentPage(Math.min(feedbackData.pagination.totalPages, currentPage + 1))}
            disabled={currentPage === feedbackData.pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default AdminFeedback
