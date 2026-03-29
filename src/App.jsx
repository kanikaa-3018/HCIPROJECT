import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import DailyMenu from './pages/DailyMenu'
import WeeklyMenu from './pages/WeeklyMenu'
import FeedbackPage from './pages/FeedbackPage'
import AdminDashboard from './pages/AdminDashboard'
import ReportsPage from './pages/ReportsPage'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Toast from './components/Toast'

function App() {
  const { user } = useAuthStore()

  return (
    <>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />} 
          />
          
          {/* Student Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute roles={['btech', 'mtech']} layout={MainLayout}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/menu/daily" 
            element={
              <ProtectedRoute roles={['btech', 'mtech']} layout={MainLayout}>
                <DailyMenu />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/menu/weekly" 
            element={
              <ProtectedRoute roles={['btech', 'mtech']} layout={MainLayout}>
                <WeeklyMenu />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/feedback" 
            element={
              <ProtectedRoute roles={['btech', 'mtech']} layout={MainLayout}>
                <FeedbackPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute roles={['admin']} layout={MainLayout}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute roles={['admin']} layout={MainLayout}>
                <ReportsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
      <Toast />
    </>
  )
}

export default App
