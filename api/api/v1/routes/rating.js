import { Router } from 'express'
import {
    createRating,
    getRatings,
    getRating,
    updateRating,
    deleteRating
} from '../controllers/rating'
import Rating from '../models/rating'
import { protect } from '../middleware/auth'
import advancedFiltering from '../middleware/advancedFiletring'


const ratingRouter = Router({ mergeParams: true })

ratingRouter.route('/')
    .get(advancedFiltering(Rating), getRatings)
    .post(protect, createRating)

ratingRouter.route('/:id')
    .get(getRating)
    .put(protect, updateRating)
    .delete(protect, deleteRating)


export default ratingRouter