import { useState } from 'react'
import Login from './Login'
import Signup from './Signup'

function Auth() {
  const [isSignup, setIsSignup] = useState(true)

  return isSignup ? (
    <Signup onSwitchToLogin={() => setIsSignup(false)} />
  ) : (
    <Login onSwitchToSignup={() => setIsSignup(true)} />
  )
}

export default Auth
