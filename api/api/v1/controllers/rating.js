import ErrorResponse from '../utils/errorResponse'
import asyncHandler from '../middleware/async'
import Rating from '../models/rating'
import Word from '../models/word'
import Definition from '../models/definition'


/*
@desc       Create a new Rating
@route      POST /api/v1/ratings
@access     Private
*/
export const createRating = asyncHandler( async (req, res, next) => {

    if(req.params.wordId) return addWordRating(req, res, next)
    if(req.params.definitionId) return addDefinitionRating(req, res, next)

    req.body.user = req.user.id
    
    const rating = await Rating.create(req.body)
    res.status(200).json({
        success: true,
        data: rating
    })

})


/*
@desc       Get all Ratings
@route      GET /api/v1/ratings
@access     Private
*/
export const getRatings = asyncHandler(async (req, res, next) => {

    if (req.params.wordId) {
        const ratings = Rating
            .find({ word: req.params.wordId })

        res.status(200).json({
            success: true,
            data: ratings
        })
    } else {
        res.status(200).json(res.advancedFiltering)
    }
})


/*
@desc       Get single Rating
@route      GET /api/v1/ratings/:id
@access     Private
*/
export const getRating = asyncHandler( async (req, res, next) => {

    const rating = await Rating
        .findById(req.params.id)

    if(!rating) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    res.status(200).json({
        success: true,
        data: rating
    })
})


/*
@desc       Add a Rating to a Word
@route      Post /api/v1/words/:wordId/ratings
@access     Private
*/
const addWordRating = asyncHandler( async (req, res, next) => {

    req.body.word = req.params.wordId
    req.body.target = 'word'
    req.body.user = req.user.id

    const word = await Word.findById(req.params.wordId)

    if(!word) return next(new ErrorResponse(`Resource not found with id of ${req.params.wordId}`, 404))

    // Check if the user has already rated this word
    const [userRating] = await Rating.find({ user: req.user.id, word: req.params.wordId })
    if(userRating) return next(new ErrorResponse(`The user ${req.user.id} has already rated the word with the id of: ${req.params.wordId}`, 401))

    // Make sure User is the word owner
    if(word.user.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorize to update this content`, 401))
    }

    const rating = await Rating.create(req.body)

    res.status(200).json({
        success: true,
        data: rating
    })

})


/*
@desc       Add a Rating to a Definition
@route      Post /api/v1/definitions/:definitionId/ratings
@access     Private
*/
const addDefinitionRating = asyncHandler( async (req, res, next) => {

    req.body.definition = req.params.definitionId
    req.body.target = 'definition'
    req.body.user = req.user.id

    const definition = await Definition.findById(req.params.definitionId)

    if(!definition) return next(new ErrorResponse(`Resource not found with id of ${req.params.definitionId}`, 404))

    // Check if the user has already rated this definition
    const [userRating] = await Rating.find({ user: req.user.id, definition: req.params.definitionId })
    if(userRating) return next(new ErrorResponse(`The user ${req.user.id} has already rated the definition with the id of: ${req.params.definitionId}`, 401))


    // Make sure User is the definition owner
    if(definition.user.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorize to update this content`, 401))
    }

    const rating = await Rating.create(req.body)

    res.status(200).json({
        success: true,
        data: rating
    })

})


/*
@desc       Update a Rating
@route      PUT /api/v1/ratings/:id
@access     Private
*/
export const updateRating = asyncHandler( async (req, res, next) => {

    let rating = await Rating.findById(req.params.id)

    if(!rating) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    // Make sure User is the event owner
    if(rating.user.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this content`, 401))
    }

    rating = await Rating.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: rating
    })

})


/*
@desc       Delete a Rating
@route      DELETE /api/v1/ratings/:id
@access     Private
*/
export const deleteRating = asyncHandler( async (req, res, next) => {

    const rating = await Rating.findById(req.params.id)

    if(!rating) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    // Make sure User is the event owner
    if(rating.user.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorize to delete this content`, 401))
    }

    await rating.remove()

    res.status(200).json({
        success: true,
        data: {}
    })

})