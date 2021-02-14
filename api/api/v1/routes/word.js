import { Router } from 'express'
import {
    createWord,
    getWords,
    getWord,
    updateWord,
    deleteWord
} from '../controllers/word'
import Word from '../models/word'
import { protect } from '../middleware/auth'
import advancedFiltering from '../middleware/advancedFiletring'
import definitionRouter from './definition'
import ratingRouter from './rating'
import commentRouter from './comment'


const wordRouter = Router()

wordRouter.use('/:wordId/definitions', definitionRouter)
wordRouter.use('/:wordId/comments', commentRouter)
wordRouter.use('/:wordId/ratings', ratingRouter)

wordRouter.route('/')
    .get(advancedFiltering(Word), getWords)
    .post(protect, createWord)

wordRouter.route('/:id')
    .get(getWord)
    .put(protect, updateWord)
    .delete(protect, deleteWord)


export default wordRouter