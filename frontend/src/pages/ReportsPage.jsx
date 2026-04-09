import { useEffect, useState } from 'react'
import { Calendar, Download, Share2, FileText, TrendingUp, Printer } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import StatCard from '../components/StatCard'
import SkeletonLoader from '../components/SkeletonLoader'
import { analyticsAPI } from '../services/api'
import { useToastStore } from '../store/toastStore'

function ReportsPage() {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [generated, setGenerated] = useState(false)
  const { addToast } = useToastStore()

  const generateReport = async () => {
    setLoading(true)
    try {
      const data = await analyticsAPI.generateReport()
      setReport(data.report)
      setGenerated(true)
      addToast('Report generated successfully!', 'success')
    } catch (error) {
      addToast('Failed to generate report', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const reportData = `MESS MENU & FEEDBACK SYSTEM - WEEKLY REPORT
${'='.repeat(70)}

Report Date: ${report?.date}
Period: Last 7 days

${'='.repeat(70)}
KEY METRICS
${'='.repeat(70)}
Average Overall Rating: ${report?.avgRating?.toFixed(2)}/5.0
Total Ratings: ${report?.totalRatings}
Total Feedback: ${report?.totalFeedback}
Top Rated Meal: ${report?.topMeal}

${'='.repeat(70)}
TOP 5 MEALS
${'='.repeat(70)}
${report?.topMeals?.map((m, i) => `${i + 1}. ${m.meal}: ${m.avg}/5 (${m.count} ratings)`).join('\n') || 'No data'}

${'='.repeat(70)}
ISSUE DISTRIBUTION
${'='.repeat(70)}
${report?.issues?.map(i => `• ${i.type}: ${i.count} reports`).join('\n') || 'No data'}

${'='.repeat(70)}
7-DAY RATING TREND
${'='.repeat(70)}
${report?.weeklyTrend?.map(w => `${w.day}: ${w.avg}/5 (${w.count} ratings)`).join('\n') || 'No data'}

${'='.repeat(70)}
RECENT FEEDBACK (Last 10)
${'='.repeat(70)}
${report?.recentFeedback?.map(f => `\n[${f.date}] ${f.user} - ${f.meal}\nIssue: ${f.type}${f.rating ? ` | Rating: ${f.rating}/5` : ''}\nComment: ${f.comment}`).join('\n---\n') || 'No feedback'}

${'='.repeat(70)}
Report Generated: ${new Date().toLocaleString()}
`
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportData))
    element.setAttribute('download', `Weekly_Report_${new Date().toISOString().split('T')[0]}.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    addToast('Report downloaded successfully!', 'success')
  }

  const handlePrint = () => {
    if (!report) {
      addToast('Generate a report first', 'warning')
      return
    }
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Weekly Report - ${report.date}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background-color: #3ebab3; color: white; padding: 20px; text-align: center; margin-bottom: 20px; }
          .section { margin: 20px 0; padding: 15px; border-left: 4px solid #3ebab3; }
          .metric { display: inline-block; margin: 10px 20px; text-align: center; }
          .metric-value { font-size: 24px; font-weight: bold; color: #3ebab3; }
          .metric-label { font-size: 12px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f0f0f0; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Weekly Report</h1>
          <p>Generated on ${report.date}</p>
        </div>
        
        <div class="section">
          <h2>Key Metrics</h2>
          <div class="metric">
            <div class="metric-value">${report.avgRating?.toFixed(2)}/5</div>
            <div class="metric-label">Average Rating</div>
          </div>
          <div class="metric">
            <div class="metric-value">${report.totalFeedback}</div>
            <div class="metric-label">Total Feedback</div>
          </div>
          <div class="metric">
            <div class="metric-value">${report.totalRatings}</div>
            <div class="metric-label">Total Ratings</div>
          </div>
          <div class="metric">
            <div class="metric-value">${report.topMeal}</div>
            <div class="metric-label">Top Meal</div>
          </div>
        </div>

        <div class="section">
          <h2>Issue Distribution</h2>
          <table>
            <tr><th>Issue Type</th><th>Count</th></tr>
            ${report?.issues?.map(i => `<tr><td>${i.type}</td><td>${i.count}</td></tr>`).join('')}
          </table>
        </div>

        <div class="section">
          <h2>Top 5 Meals</h2>
          <table>
            <tr><th>Rank</th><th>Meal</th><th>Avg Rating</th><th>Ratings</th></tr>
            ${report?.topMeals?.map((m, i) => `<tr><td>${i + 1}</td><td>${m.meal}</td><td>${m.avg}/5</td><td>${m.count}</td></tr>`).join('')}
          </table>
        </div>

        <div class="footer">
          <p>Mess Menu & Feedback System | ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `
    const printWindow = window.open('', '', 'width=800,height=600')
    printWindow.document.write(printContent)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
      addToast('Opening print dialog...', 'success')
    }, 250)
  }

  const handleShare = () => {
    if (!report) {
      addToast('Generate a report first', 'warning')
      return
    }
    
    const shareText = `Check out this week's Mess Report! Average Rating: ${report.avgRating?.toFixed(2)}/5, Top Meal: ${report.topMeal}, Total Feedback: ${report.totalFeedback} entries`
    
    if (navigator.share) {
      navigator.share({
        title: 'Weekly Mess Report',
        text: shareText,
        url: window.location.href
      }).catch(err => console.log('Share cancelled'))
    } else {
      // Fallback: Copy to clipboard
      const textToCopy = `Weekly Report - ${report.date}\n${shareText}`
      navigator.clipboard.writeText(textToCopy).then(() => {
        addToast('Report summary copied to clipboard!', 'success')
      }).catch(() => {
        addToast('Share not supported on this device', 'warning')
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-400 dark:from-primary-600 dark:via-primary-500 dark:to-primary-400 rounded-2xl p-8 text-white dark:text-dark-100 animate-slideDown shadow-soft dark:shadow-soft-md">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Weekly Reports</h1>
            <p className="text-primary-100 dark:text-primary-200 text-lg font-medium">Generate and download mess operation reports</p>
          </div>
          <TrendingUp className="w-10 h-10 text-primary-100 dark:text-primary-200 animate-float" />
        </div>
      </div>

      {/* Generate Report Section */}
      <Card className="p-6 bg-light-100 dark:bg-gradient-to-br dark:from-primary-600/20 dark:to-primary-700/20 border-light-200 dark:border-primary-700 animate-slideUp">
        <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-4">Generate New Report</h3>
        <p className="mb-6 text-dark-600 dark:text-dark-300">
          Create a comprehensive weekly report including ratings, feedback summary, and analytics.
        </p>
        <Button
          onClick={generateReport}
          loading={loading}
          disabled={loading}
          className="px-6 py-3 text-lg font-bold"
        >
          <FileText className="w-5 h-5" />
          Generate Report Now
        </Button>
      </Card>

      {/* Report Preview */}
      {generated && report ? (
        <>
          {/* Report Header */}
          <Card className="p-6 border-l-4 border-l-primary-600 dark:border-l-primary-400 animate-slideUp">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50">Weekly Report</h2>
                <p className="text-sm mt-1 text-dark-600 dark:text-dark-400">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Generated: {report.date}
                </p>
              </div>
              <span className="px-4 py-2 bg-primary-100 dark:bg-primary-600/20 text-primary-700 dark:text-primary-400 rounded-full text-sm font-bold border border-primary-300 dark:border-primary-700">
                Complete
              </span>
            </div>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp">
            <StatCard
              label="Average Rating"
              value={report.avgRating.toFixed(1)}
              color="primary"
            />
            <StatCard
              label="Total Feedback"
              value={report.totalFeedback}
              color="secondary"
            />
            <StatCard
              label="Top Meal"
              value={report.topMeal}
              color="primary"
            />
          </div>

          {/* Issues Summary */}
          <Card className="p-6 animate-slideUp">
            <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-5">Issue Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.issues?.map((issue) => (
                <div key={issue.type} className="p-4 rounded-lg border-2 bg-light-100 dark:bg-gradient-to-br dark:from-primary-600/20 dark:to-primary-700/20 border-light-200 dark:border-primary-700">
                  <p className="text-sm font-semibold capitalize mb-2 text-primary-700 dark:text-primary-400">{issue.type}</p>
                  <p className="text-3xl font-bold text-primary-600 dark:bg-gradient-to-r dark:from-primary-400 dark:to-primary-300 dark:bg-clip-text dark:text-transparent">{issue.count}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Observations */}
          <Card className="p-6 bg-light-100 dark:bg-gradient-to-r dark:from-primary-600/20 dark:to-primary-700/20 border-light-200 dark:border-primary-700 animate-slideUp">
            <h3 className="font-bold text-dark-900 dark:text-dark-50 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-700 dark:text-primary-400" /> Key Observations
            </h3>
            <ul className="text-sm space-y-2 text-dark-600 dark:text-dark-300">
              <li className="flex items-center gap-2">
                <span className="text-primary-700 dark:text-primary-400 font-bold">→</span>
                Overall student satisfaction is <span className="font-semibold">{report.avgRating > 4 ? 'high' : 'moderate'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-700 dark:text-primary-400 font-bold">→</span>
                <span><span className="font-semibold">{report.topMeal}</span> is the most preferred meal</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-700 dark:text-primary-400 font-bold">→</span>
                Most common feedback: <span className="font-semibold">{report.issues?.[0]?.type || 'N/A'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-700 dark:text-primary-400 font-bold">→</span>
                <span><span className="font-semibold">{report.totalFeedback}</span> students provided feedback</span>
              </li>
            </ul>
          </Card>

          {/* Recommendations */}
          <Card className="p-6 bg-light-100 dark:bg-gradient-to-r dark:from-secondary-600/20 dark:to-secondary-700/20 border-light-200 dark:border-secondary-700 animate-slideUp">
            <h3 className="font-bold text-dark-900 dark:text-dark-50 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary-700 dark:text-secondary-400" /> Recommendations
            </h3>
            <ul className="text-sm space-y-2 text-dark-600 dark:text-dark-300">
              <li className="flex items-center gap-2">
                <span className="text-secondary-700 dark:text-secondary-400 font-bold">•</span>
                Continue serving <span className="font-semibold">{report.topMeal}</span> - highly rated
              </li>
              <li className="flex items-center gap-2">
                <span className="text-secondary-700 dark:text-secondary-400 font-bold">•</span>
                Address <span className="font-semibold">{report.issues?.[0]?.type || 'feedback'}</span> concerns
              </li>
              <li className="flex items-center gap-2">
                <span className="text-secondary-700 dark:text-secondary-400 font-bold">•</span>
                Maintain current standards for high-rated meals
              </li>
              <li className="flex items-center gap-2">
                <span className="text-secondary-700 dark:text-secondary-400 font-bold">•</span>
                Schedule review meeting with catering team
              </li>
            </ul>
          </Card>

          {/* Download Actions */}
          <Card className="p-6 bg-gradient-to-br from-primary-700/20 via-teal-600/15 to-primary-600/20 border-primary-600 shadow-lg shadow-primary-500/10 animate-slideUp">
            <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-5 flex items-center gap-2">
              <Download className="w-5 h-5 text-primary-500" /> Export Report
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleDownload}
                variant="primary"
                size="md"
                className="bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 shadow-lg hover:shadow-xl hover:shadow-blue-500/30"
              >
                <Download className="w-5 h-5" />
                Download as Text
              </Button>
              <Button
                onClick={handleShare}
                variant="primary"
                size="md"
                className="bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500 shadow-lg hover:shadow-xl hover:shadow-purple-500/30"
              >
                <Share2 className="w-5 h-5" />
                Share Report
              </Button>
              <Button
                onClick={handlePrint}
                variant="primary"
                size="md"
                className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 shadow-lg hover:shadow-xl hover:shadow-orange-500/30"
              >
                <Printer className="w-5 h-5" />
                Print
              </Button>
            </div>
          </Card>

          {/* Historical Reports */}
          <Card className="p-6 animate-slideUp">
            <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-5 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" /> Recent Reports
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl border-2 bg-gradient-to-r from-primary-600/10 to-teal-500/10 dark:from-primary-700/20 dark:to-teal-600/20 border-primary-400/30 dark:border-primary-600/50 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-soft dark:hover:shadow-glow-sm transition-all"
                >
                  <div>
                    <p className="font-semibold text-dark-900 dark:text-dark-50">Week {i}</p>
                    <p className="text-sm text-dark-500 dark:text-dark-400">
                      {new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 shadow-md hover:shadow-lg hover:shadow-teal-500/30 gap-2"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-12 text-center animate-slideUp">
          <FileText className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">Generate a report to view details and statistics</p>
        </Card>
      )}
    </div>
  )
}

export default ReportsPage
