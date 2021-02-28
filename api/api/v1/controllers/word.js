import ErrorResponse from '../utils/errorResponse'
import asyncHandler from '../middleware/async'
import Word from '../models/word'


/*
@desc       GET all Words
@route      GET /api/v1/words
@access     Public
*/

export const getWords = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedFiltering)
    
})


/*
@desc       GET single Word
@route      GET /api/v1/words/:id
@access     Public
*/
export const getWord = asyncHandler(async (req, res, next) => {

    
    
    const word = await Word
        .findById(req.params.id)
        // .cache({ key: req.user.id })

    res.status(200).json({
        success: true,
        data: word
    })
})


/*
@desc       Create Word
@route      POST /api/v1/words
@access     Private
*/
export const createWord = asyncHandler(async (req, res, next) => {

    req.body.user = req.user.id

    const word = await Word.create(req.body)
    
    res.status(200).json({
        success: true,
        data: word
    })
    
})


/*
@desc       Update Word
@route      PUT /api/v1/words/:id
@access     Private
*/
export const updateWord = asyncHandler(async (req, res, next) => {

    let word = await Word.findById(req.params.id)

    if(!word) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    // Make sure User is the event owner
    if(word.user.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this content`, 401))
    }

    word = await Word.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: word
    })

    // clearHash(req.user.id)

})


/*
@desc       Delete Word
@route      DELETE /api/v1/words/:id
@access     Private
*/
export const deleteWord = asyncHandler( async (req, res, next) => {

    const word = await Word.findById(req.params.id)

    if(!word) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    // Make sure User is the event owner
    if(word.user.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this content`, 401))
    }

    await word.remove()

    res.status(200).json({
        success: true,
        data: {}
    })

})