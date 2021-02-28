import ErrorResponse from '../utils/errorResponse'
import asyncHandler from '../middleware/async'
import Definition from '../models/definition'
import Word from '../models/word'


/*
@desc       Create a new Definition
@route      POST /api/v1/definitions
@access     Private
*/
export const createDefinition = asyncHandler( async (req, res, next) => {

    if(req.params.wordId) return addDefinition(req, res, next)

    req.body.user = req.user.id
    
    const definition = await Definition.create(req.body)
    res.status(200).json({
        success: true,
        data: definition
    })
})


/*
@desc       Get all Definitions
@route      GET /api/v1/definitions
@access     Private
*/
export const getDefinitions = asyncHandler(async (req, res, next) => {

    if (req.params.wordId) {
        const definitions = await Definition
            .find({ word: req.params.wordId })

        res.status(200).json({
            success: true,
            data: definitions
        })
    } else {
        res.status(200).json(res.advancedFiltering)
    }
})


/*
@desc       Get single Definition
@route      GET /api/v1/definitions/:id
@access     Private
*/
export const getDefinition = asyncHandler( async (req, res, next) => {

    const definition = await Definition
        .findById(req.params.id)

    if(!definition) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    res.status(200).json({
        success: true,
        data: definition
    })
})


/*
@desc       Add a Definition
@route      Post /api/v1/words/:wordId/definitions
@access     Private
*/
const addDefinition = asyncHandler( async (req, res, next) => {


    req.body.word = req.params.wordId
    req.body.user = req.user.id

    const word = await Word.findById(req.params.wordId)

    if(!word) return next(new ErrorResponse(`Resource not found with id of ${req.params.wordId}`, 404))

    // Make sure User is the event owner
    if(word.user.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorize to update this content`, 401))
    }

    const definition = await Definition.create(req.body)

    res.status(200).json({
        success: true,
        data: definition
    })

})


/*
@desc       Update a Definition
@route      PUT /api/v1/definitions/:id
@access     Private
*/
export const updateDefinition = asyncHandler( async (req, res, next) => {

    let definition = await Definition.findById(req.params.id)

    if(!definition) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    // Make sure User is the event owner
    if(definition.user.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this content`, 401))
    }

    definition = await Definition.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: definition
    })

})


/*
@desc       Delete a Definition
@route      DELETE /api/v1/definitions/:id
@access     Private
*/
export const deleteDefinition = asyncHandler( async (req, res, next) => {

    const definition = await Definition.findById(req.params.id)

    if(!definition) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    // Make sure User is the event owner
    if(definition.user.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorize to delete this content`, 401))
    }

    await definition.remove()

    res.status(200).json({
        success: true,
        data: {}
    })

})