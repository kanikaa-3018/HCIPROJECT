import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const STUDENT_ROLES = ['btech', 'mtech', 'phd']

export const register = async (req, res) => {
  try {
    const { name, email, password, rollNumber, role } = req.body
    const requestedRole = role || 'btech'

    if (!name || !email || !password || !requestedRole) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (!STUDENT_ROLES.includes(requestedRole)) {
      return res.status(403).json({ message: 'Admin accounts cannot be created from signup' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedRollNumber = String(rollNumber || '').trim().toUpperCase()

    if (!normalizedRollNumber) {
      return res.status(400).json({ message: 'Roll number is required for student accounts' })
    }

    const userExists = await User.findOne({ email: normalizedEmail })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const rollNumberExists = await User.findOne({ rollNumber: normalizedRollNumber })
    if (rollNumberExists) {
      return res.status(400).json({ message: 'Roll number already exists' })
    }

    const user = new User({
      name,
      email: normalizedEmail,
      password,
      rollNumber: normalizedRollNumber,
      role: requestedRole
    })
    await user.save()

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const allowedAdminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
      .split(',')
      .map((allowedEmail) => allowedEmail.trim().toLowerCase())
      .filter(Boolean)

    if (user.role === 'admin' && allowedAdminEmails.length > 0 && !allowedAdminEmails.includes(user.email)) {
      return res.status(403).json({ message: 'This admin account is not allowed to sign in' })
    }

    let isPasswordValid = await user.comparePassword(password)
    const hasHashedPassword = user.password?.startsWith('$2a$') ||
      user.password?.startsWith('$2b$') ||
      user.password?.startsWith('$2y$')

    if (!isPasswordValid && !hasHashedPassword && user.password === password) {
      user.password = password
      await user.save()
      isPasswordValid = true
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
