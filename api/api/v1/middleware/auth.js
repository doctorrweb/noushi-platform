import jwt from 'jsonwebtoken'
import asyncHandler from './async'
import ErrorResponse from '../utils/errorResponse'
import User from '../models/user'
import { config as dotenvConfig } from 'dotenv'

dotenvConfig()
const env = process.env


// Protect Routes
export const protect = asyncHandler(async (req, res, next) => {
    let token
    const authorization = req.headers.authorization

    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1]
    } 

    if (req.cookies.token) token = req.cookies.token

    // Make sure token exists
    if (!token) return next(new ErrorResponse('Not authorized to access this route', 401))

    try {
        // Verify Token
        const decoded = jwt.verify(token, env.JWT_SECRET)

        req.user = await User.findById(decoded.id)

        next()
    } catch (error) {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }
})

// Grant access to specific roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
        }
        next()
    }
}