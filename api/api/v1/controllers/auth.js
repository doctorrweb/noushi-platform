import crypto from 'crypto'
import ErrorResponse from '../utils/errorResponse'
import asyncHandler from '../middleware/async'
import User from '../models/user'
import emailHandler from '../utils/emailHandler'


const env = process.env


/*
@desc       Register user
@route      POST /api/v1/auth/register
@access     Public
*/
 export const register = asyncHandler(async (req, res, next) => {

    const user = await User.create(req.body)

    sendTokenResponse(user, 200, res)

})


/*
@desc       Log user in
@route      POST /api/v1/auth/login
@access     Public
*/
export const login = asyncHandler(async (req, res, next) => {
    const { password, username  } = req.body
    
    // validate email & Password
    if(!username || !password) return next(new ErrorResponse('Please provide an email and password', 400))

    const user = await User.findOne()
        .or([{ username }, { email: username }])
        .select('+password')
        .then(doc => doc)
        .catch(err => console.error(err))

    if(!user) return next(new ErrorResponse('Invalid credentials', 401))

    // Check if password is correct
    const isMatch = await user.matchPassword(password)
    if(!isMatch) return next(new ErrorResponse('Invalid credentials', 401))

    sendTokenResponse(user, 200, res)

})


/*
@desc       Log user out / clear cookie
@route      GET /api/v1/auth/logout
@access     Private
*/
export const logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    // const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: {}
    })
})


/*
@desc       Get current logged in user
@route      GET /api/v1/auth/me
@access     Private
*/
export const getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })
})


/*
@desc       Forgot Password
@route      POST /api/v1/auth/forgotpassword
@access     Public
*/
export const forgotPassword = asyncHandler(async (req, res, next) => {

    const { username  } = req.body

    const user = await User.findOne()
        .or([{ username }, { email: username }])
        .then(doc => doc)
        .catch(err => console.error(err))


    if(!user) return next(new ErrorResponse('There is no user with that email', 404))

    const resetPasswordToken = await user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    // Create Reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetPasswordToken}`

    // Email Message
    const message = `You are receiving this email because you (or somebody else) has requestd a reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

    try {
        await emailHandler({
            email: user.email,
            subject: 'Password Reset Token',
            message
        })

        res.status(200).json({
            success: true,
            data: {
                message: 'email sent'
            }
        })

        return

    } catch (error) {
        console.error(error)
        user.resetPassword = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })

        return next(new ErrorResponse('Email could not be sent', 500))
    }

})


/*
@desc       Reset Password
@route      PUT /api/v1/auth/resetpassword/:resettoken
@access     Public
*/
export const resetPassword = asyncHandler(async (req, res, next) => {

    // get hashed token
    const resetPassword = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex')

    const user = await User.findOne({
        resetPassword,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if(!user) return next(new ErrorResponse('Invalid Token', 404))

    // Set new password
    user.password = req.body.password
    user.resetPassword = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    sendTokenResponse(user, 200, res)
})


/*
@desc       Update user details
@route      PUT /api/v1/auth/updatedetails
@access     Private
*/
export const updateDetails = asyncHandler(async (req, res, next) => {


    // Define fields to update
    const unUpdatableFields = [
        'method', 
        'email',
        'username',
        'google',
        'location',
        'password', 
        'resetPassword', 
        'resetPasswordExpire',
        'role',
        'createdAt',
        'updatedAt'
    ]

    // Define updatable fields
    const fieldsToUpdate = Object.keys(req.body).filter(field => !unUpdatableFields.includes(field))
    const user = fieldsToUpdate.reduce((acc, curr) => {
        acc[curr] = req.body[curr]
        return acc
    }, {})

    const updatedUser = await User.findByIdAndUpdate(req.user.id, user, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: updatedUser
    })
})


/*
@desc       Update Password
@route      PUT /api/v1/auth/updatepassword
@access     Private
*/
export const updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401))
    }

    user.password = req.body.newPassword

    await user.save()

    sendTokenResponse(user, 200, res)
})


// get Token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // create Token
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}