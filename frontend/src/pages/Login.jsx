import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import { authAPI } from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import { UtensilsCrossed, Lock, Mail } from 'lucide-react'

function Login({ onSwitchToSignup }) {
  const [email, setEmail] = useState('student@college.edu')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuthStore()
  const { addToast } = useToastStore()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      addToast('Please fill in all fields', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.login(email, password)
      setUser(response.user)
      addToast('Login successful!', 'success')
      navigate(response.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (error) {
      addToast('Login failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-light-50 dark:bg-dark-800 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Gradient Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/5 dark:bg-primary-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/5 dark:bg-secondary-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slideDown">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-400 dark:from-primary-600 dark:to-primary-500 rounded-2xl shadow-soft dark:shadow-glow-md hover:shadow-soft-md dark:hover:shadow-glow-lg transition-shadow duration-300">
              <UtensilsCrossed className="w-8 h-8 text-white dark:text-dark-100" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
                Mess Menu
              </h1>
              <p className="text-sm font-semibold text-primary-700 dark:text-primary-400 mt-1">
                HCI System
              </p>
            </div>
          </div>
          <p className="text-dark-700 dark:text-dark-300 font-medium">
            Sign In to Your Account
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 animate-scaleIn">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <Input
                label="Email Address"
                type="email"
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                icon={Mail}
              />
            </div>

            {/* Password */}
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                icon={Lock}
              />
            </div>

            {/* Demo Credentials Info */}
            <div className="p-4 border-l-4 border-primary-500 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/30 rounded-lg backdrop-blur-sm">
              <p className="font-bold mb-2 text-primary-700 dark:text-primary-300">
                Demo Credentials
              </p>
              <div className="text-sm space-y-1 text-primary-800 dark:text-primary-400">
                <p><span className="font-semibold">Student:</span> student@college.edu</p>
                <p><span className="font-semibold">Password:</span> password</p>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Switch to Signup */}
          <div className="mt-6 pt-6 border-t border-light-300 dark:border-dark-600 text-center">
            <p className="text-dark-700 dark:text-dark-300 text-sm">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Create one
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Login
