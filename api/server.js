import path from 'path'
import express from 'express'
import morgan from 'morgan'
import colors from 'colors'
import database from './database'
import errorHandler from './api/v1/middleware/error'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import xss from 'xss-clean'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import cors from 'cors'
import passport from 'passport'
import appRouter from './api/v1/routes'
import googleRouter from './api/v1/routes/google'

const app = express()
database.connect()

// Test to connection to database
const db = database.connection
db.once('open', () => {
    console.info('🚀 ... Connected to database !'.cyan.underline.bold)
})
// Error to connect to databse
db.on('error', (err) => {
    console.error(err)
})

/* ****
end - SETTING OF THE DATABASE
**** */

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'))
}

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }, { limit: '50mb' }))
app.use(express.json({ limit: '50mb' }, { type: '*/*' }))


//Configure Passport
app.use(passport.initialize())
app.use(passport.session())

app.use(cookieParser())

// To remove data, use:
app.use(mongoSanitize())

// To remove data, use:
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Enable CORS
app.use(cors())

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per wind owMs
})

app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Middleware for Routes
app.use('/api/v1', appRouter)

// Google Auth Routes
app.use('/auth/google', googleRouter)

// Custom Error Handler
app.use(errorHandler)

const server = app.listen(process.env.PORT, () => {
    console.info('🚀*****🚀****🚀')
    console.info('🚀****🚀*****🚀')
    console.info(`The server is running on : ${process.env.BASE_URL}:${process.env.PORT} !`.yellow.bold)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)

    // Close server & exit process
    server.close(() => {
        database.close()
        process.exit(1)
    })
})

export default app