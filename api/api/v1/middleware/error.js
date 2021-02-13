import ErrorResponse from '../utils/errorResponse'

const errorHandler = (err, req, res, next) => {

    let error = { ...err }
    error. message = err.message

    // Log to console for Devs
    console.log(err)

    // Mongoose Bad ObjectId
    if (err.name === 'CastError') {
        const message = `Ressource not found`
        error = new ErrorResponse(message, 404)
    }

    // Mongoose duplicate key
    if (err.code === 1100) {
        const message = 'Duplicate field value enterred'
        error = new ErrorResponse(message, 400)
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(err.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    })
}

export default errorHandler