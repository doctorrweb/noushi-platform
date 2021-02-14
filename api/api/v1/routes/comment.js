import { Router } from 'express'
import {
    createComment,
    getComments,
    getComment,
    updateComment,
    deleteComment
} from '../controllers/comment'
import Comment from '../models/comment'
import { protect } from '../middleware/auth'
import advancedFiltering from '../middleware/advancedFiltering'

const commentRouter = Router({ mergeParams: true })

commentRouter.route('/')
    .get(advancedFiltering(Comment), getComments)
    .post(protect, createComment)

commentRouter.route('/:id')
    .get(getComment)
    .put(protect, updateComment)
    .delete(protect, deleteComment)

export default commentRouter