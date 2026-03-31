import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'warden') {
    return res.status(403).json({ message: 'Only wardens can access this' })
  }
  next()
}

export const studentOnly = (req, res, next) => {
  const allowedRoles = ['btech', 'mtech', 'phd']
  if (!allowedRoles.includes(req.user?.role)) {
    return res.status(403).json({ message: 'Only students can access this' })
  }
  next()
}
