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
import advancedFiltering from '../middleware/advancedFiltering'
import definitionRouter from './definition'
import ratingRouter from './rating'
import commentRouter from './comment'


const wordRouter = Router()

const populateWord = [
    {
        path: 'definitions',
        select: 'content isActive'
    },
    { 
        path: 'comments',
        select: 'content type word definition isActive' 
    }
]

wordRouter.use('/:wordId/definitions', definitionRouter)
wordRouter.use('/:wordId/comments', commentRouter)
wordRouter.use('/:wordId/ratings', ratingRouter)

wordRouter.route('/')
    .get(advancedFiltering(Word, populateWord), getWords)
    .post(protect, createWord)

wordRouter.route('/:id')
    .get(getWord)
    .put(protect, updateWord)
    .delete(protect, deleteWord)


export default wordRouter