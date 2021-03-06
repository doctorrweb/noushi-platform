import ErrorResponse from '../utils/errorResponse'
import asyncHandler from '../middleware/async'
import emailHandler from '../utils/emailHandler'
import User from '../models/user'


/*
@desc       GET all users
@route      GET /api/v1/users
@access     Private
*/
export const getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedFiltering)
    
})


/*
@desc       GET single User
@route      GET /api/v1/users/:id
@access     Private/admin
*/
export const getUser = asyncHandler(async (req, res, next) => {
    
    const user = await User
        .findById(req.params.id)
        // .cache({ key: req.user.id })

    res.status(200).json({
        success: true,
        data: user
    })
})


/*
@desc       Get Users within a radius
@route      GET /api/v1/users/radius/:zipcode/:distance
@access     Private/admin
*/
export const getUsersInRadius = asyncHandler( async (req, res, next) => {
    const { zipcode, distance } = req.params

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    // Calcul radisu using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi || 6,378 km
    const radius = 3963.2 / distance

    const users = await User
    .find({
        location: { $geoWithin: { $centerSphere: [ [lng, lat], radius ] } }
    })

    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    })
})


/*
@desc       Create User
@route      POST /api/v1/users
@access     Private/admin
*/
export const createUser = asyncHandler(async (req, res, next) => {

    const user = new User(req.body)
    const resetPasswordToken = await user.getResetPasswordToken()
    
    await user.save({ validateBeforeSave: false })
    
    // Create Reset url

    // Send an email to the new user
    const message = `
    Your account on Noushi Platform has been created successfully. Please use the link below to update your password. 
    Please make a PUT request to: 
    ${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetPasswordToken}
    `
    await emailHandler({
        email: user.email,
        subject: 'Account created on Noushi Platform',
        message
    })
    
    res.status(200).json({
        success: true,
        data: {
            user, 
            message: 'email sent'
        }
    })
})


/*
@desc       Update User
@route      PUT /api/v1/users/:id
@access     Private/admin
*/
export const updateUser = asyncHandler(async (req, res, next) => {

    await User.updateOne({_id: req.params.id}, req.body, {timestamps: true})
    const user = await User.findById(req.params.id) 

    res.status(200)
        .json({
            success: true,
            data: user
        })
})


/*
@desc       Delete User
@route      DELETE /api/v1/users/:id
@access     Private/admin
*/
export const deleteUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    if(!user) return next(new ErrorResponse(`No Resource found with the Id of ${req.params.id}`))

    user.remove()

    res.status(200).json({
        success: true,
        data: {}
    })

})