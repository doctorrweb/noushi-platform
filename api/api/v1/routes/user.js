import { Router } from 'express'
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/user'
import User from '../models/user'
import advancedFiltering from '../middleware/adavancedFiltering'
import { protect, authorize } from '../middleware/auth'
import cleanCache from '../middleware/cleanCache'

const userRouter = Router()

const populateUser = [
    { path: 'deliverables',
        select: 'name startDate endDate completionRate type lang translation'}
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