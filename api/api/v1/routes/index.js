import { Router } from 'express'

// Import All routers
import userRouter from './user'
import authRouter from './auth'

const appRouter = Router()

// appRouter.use(/* name of the router  */)
appRouter.use('/users', userRouter)
appRouter.use('/auth', authRouter)

export default appRouter