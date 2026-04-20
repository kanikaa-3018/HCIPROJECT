import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import { authAPI } from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import { UtensilsCrossed, Lock, Mail, User, FileText, Users } from 'lucide-react'

function Signup({ onSwitchToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [role, setRole] = useState('btech')
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuthStore()
  const { addToast } = useToastStore()
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    
    if (!name || !email || !password || !rollNumber) {
      addToast('Please fill in all fields', 'error')
      return
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.register(name, email, password, rollNumber, role)
      setUser(response.user)
      addToast('Signup successful!', 'success')
      navigate(response.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (error) {
      addToast(error.message || 'Signup failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    { value: 'btech', label: 'B.Tech Student' },
    { value: 'mtech', label: 'M.Tech/PhD Student' },
  ]

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
            Create Your Account
          </p>
        </div>

        {/* Signup Card */}
        <Card className="p-8 animate-scaleIn">
          <form onSubmit={handleSignup} className="space-y-6">
            {/* Name */}
            <div>
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                icon={User}
              />
            </div>

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

            {/* Roll Number */}
            <div>
              <Input
                label="Roll Number"
                type="text"
                placeholder="BT2024001"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                disabled={loading}
                icon={FileText}
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

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-bold text-dark-900 dark:text-dark-100 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                Select Your Role
              </label>
              <div className="space-y-3">
                {roles.map((r) => (
                  <label 
                    key={r.value} 
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      role === r.value
                        ? 'border-primary-400 dark:border-primary-500 bg-primary-100 dark:bg-primary-600/20 shadow-glow-sm dark:shadow-glow-sm'
                        : 'border-light-300 dark:border-dark-600 hover:border-primary-500 dark:hover:border-primary-600 hover:bg-light-200 dark:hover:bg-dark-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={role === r.value}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-5 h-5 text-primary-500 dark:text-primary-500 cursor-pointer accent-primary-500"
                    />
                    <span className="ml-3 font-semibold text-dark-900 dark:text-dark-100">
                      {r.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-6 border-t border-light-300 dark:border-dark-600 text-center">
            <p className="text-dark-700 dark:text-dark-300 text-sm">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Signup
