import ErrorResponse from '../utils/errorResponse'
import asyncHandler from '../middleware/async'
import Comment from '../models/comment'
import Definition from '../models/definition'
import Word from '../models/word'



/*
@desc       Create a new Comment
@route      POST /api/v1/comments
@access     Private
*/
export const createComment = asyncHandler( async (req, res, next) => {

    if (req.params.definitionId) return addDefinitionComment(req, res, next)
    if (req.params.wordId) return addWordComment(req, res, next)

    req.body.user = req.user.id
    
    const comment = await Comment.create(req.body)
    res.status(200).json({
        success: true,
        data: comment
    })

})


/*
@desc       Get all Comments
@route      GET /api/v1/comments
@access     Private
*/
export const getComments = asyncHandler(async (req, res, next) => {

    if (req.params.wordId) {
        const comments = Comment
            .find({ word: req.params.wordId })

        res.status(200).json({
            success: true,
            data: comments
        })
    } else {
        res.status(200).json(res.advancedFiltering)
    }
})


/*
@desc       Get single Comment
@route      GET /api/v1/comments/:id
@access     Private
*/
export const getComment = asyncHandler( async (req, res, next) => {

    const comment = await Comment
        .findById(req.params.id)

    if(!comment) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    res.status(200).json({
        success: true,
        data: comment
    })
})


/*
@desc       Add a Comment to a Word
@route      Post /api/v1/words/:wordId/comments
@access     Private
*/
const addWordComment = asyncHandler( async (req, res, next) => {

    req.body.word = req.params.wordId
    req.body.type = 'word'
    req.body.user = req.user.id

    const word = await Word.findById(req.params.wordId)

    if(!word) return next(new ErrorResponse(`Resource not found with id of ${req.params.wordId}`, 404))

    // Make sure User is the event owner
    if(word.user.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorize to update this content`, 401))
    }

    const comment = await Comment.create(req.body)

    res.status(200).json({
        success: true,
        data: comment
    })
})


/*
@desc       Add a Comment to a Definition
@route      Post /api/v1/definitions/:definitionId/comments
@access     Private
*/
const addDefinitionComment = asyncHandler( async (req, res, next) => {

    req.body.definition = req.params.definitionId
    req.body.type = 'definition'
    req.body.user = req.user.id

    const definition = await Definition.findById(req.params.definitionId)

    if(!definition) return next(new ErrorResponse(`Resource not found with id of ${req.params.definitionId}`, 404))

    // Make sure User is the event owner
    if(definition.user.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorize to update this content`, 401))
    }

    const comment = await Comment.create(req.body)

    res.status(200).json({
        success: true,
        data: comment
    })

})


/*
@desc       Update a Comment
@route      PUT /api/v1/comments/:id
@access     Private
*/
export const updateComment = asyncHandler( async (req, res, next) => {

    let comment = await Comment.findById(req.params.id)

    if(!comment) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    // Make sure User is the event owner
    if(comment.user.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this content`, 401))
    }

    comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: comment
    })

})


/*
@desc       Delete a Comment
@route      DELETE /api/v1/comments/:id
@access     Private
*/
export const deleteComment = asyncHandler( async (req, res, next) => {

    const comment = await Comment.findById(req.params.id)

    if(!comment) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    // Make sure User is the event owner
    if(comment.user.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorize to delete this content`, 401))
    }

    await comment.remove()

    res.status(200).json({
        success: true,
        data: {}
    })

})