import { Router } from 'express'

// Import All routers
import userRouter from './user'
import authRouter from './auth'
import wordRouter from './word'
import definitionRouter from './definition'
import ratingRouter from './rating'
import commentRouter from './comment'

const appRouter = Router()

// appRouter.use(/* name of the router  */)
appRouter.use('/users', userRouter)
appRouter.use('/auth', authRouter)
appRouter.use('/words', wordRouter)
appRouter.use('definitions', definitionRouter)
appRouter.use('/ratings', ratingRouter)
appRouter.use('/comments', commentRouter)

export default appRouter