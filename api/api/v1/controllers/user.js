import ErrorResponse from '../utils/errorResponse'
import asyncHandler from '../middleware/async'
import User from '../models/user'
import { config as dotenvConfig } from 'dotenv'
import { clearHash } from '../utils/cache'

dotenvConfig()
const env = process.env

/*
@desc       GET all users
@route      GET /api/v1/users
@access     Private
*/
export const getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedFiltering)
    
    // clearHash(req.user.id)
})


/*
@desc       GET single user
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
@desc       Create user
@route      POST /api/v1/users
@access     Private/admin
*/
export const createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body)
    
    res.status(200).json({
        success: true,
        data: user
    })
    
    // clearHash(req.user.id)

})


/*
@desc       Update user
@route      PUT /api/v1/users/:id
@access     Private/admin
*/
export const updateUser = asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: user
    })

    // clearHash(req.user.id)

})


/*
@desc       Delete user
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

    // clearHash(req.user.id)
})