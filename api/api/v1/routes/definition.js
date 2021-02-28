import { Router } from 'express'
import {
    createDefinition,
    getDefinitions,
    getDefinition,
    updateDefinition,
    deleteDefinition
} from '../controllers/definition'
import Definition from '../models/definition'
import { protect } from '../middleware/auth'
import advancedFiltering from '../middleware/advancedFiltering'
import commentRouter from './comment'
import ratingRouter from './rating'

const definitionRouter = Router({ mergeParams: true })

const populateDefinition = [
    { 
        path: 'words',
        select: 'text status certified' 
    },
    { 
        path: 'comments',
        select: 'content type word definition isActive' 
    }
]

definitionRouter.route('/')
    .get(advancedFiltering(Definition, populateDefinition), getDefinitions)
    .post(protect, createDefinition)

definitionRouter.route('/:id')
    .get(getDefinition)
    .put(protect, updateDefinition)
    .delete(protect, deleteDefinition)

definitionRouter.use('/:definitionId/comments', commentRouter)
definitionRouter.use('/:definitionId/ratings', ratingRouter)

export default definitionRouter
