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

const definitionRouter = Router({ mergeParams: true })

definitionRouter.use('/:definitionId/comments', commentRouter)

definitionRouter.route('/')
    .get(advancedFiltering(Definition), getDefinitions)
    .post(protect, createDefinition)

definitionRouter.route('/:id')
    .get(getDefinition)
    .put(protect, updateDefinition)
    .delete(protect, deleteDefinition)

export default definitionRouter
