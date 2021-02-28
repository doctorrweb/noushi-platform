import { Router } from 'express'
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/user'
import User from '../models/user'
import advancedFiltering from '../middleware/advancedFiltering'
import { protect, authorize } from '../middleware/auth'

const userRouter = Router()

const populateUser = [
    { 
        path: 'words',
        select: 'text status certified' 
    },
    { 
        path: 'definitions',
        select: 'content isActive' 
    },
    { 
        path: 'comments',
        select: 'content type word definition isActive' 
    }
]

 userRouter.use(protect)
 userRouter.use(authorize('administrator'))

userRouter.route('/')
    .get(advancedFiltering(User, populateUser), getUsers) 
    .post(createUser)

userRouter.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

export default userRouter