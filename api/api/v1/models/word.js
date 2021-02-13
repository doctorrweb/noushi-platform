import { ObjectId } from 'bson'
import { Schema as mongooseSchema, model, ObjectId } from 'mongoose'

const WordSchema = new mongooseSchema({
    text: {
        type: String,
        required: [true, 'Please add a text'],
        maxlength: [50, 'Text cannot be more than 50 characters'],
        unique: true
    },
    definition: {
        type: ObjectId,
        ref: 'Definition'
    },
    etymology: {
        type: ObjectId,
        ref: 'Etymology'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lang: {
        type: String,
        enum: [ 'en', 'fr', 'noushi' ],
        required: [true, 'Please choose a language'],
        default: 'noushi'
    },
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: 'createdAt'}
})

// Reverse populate actions with virtuals
WordSchema.virtual('definitions', {
    ref: 'Definition',
    localField: '_id',
    foreignField: 'word',
    justOne: false
})

// Reverse populate actions with virtuals
WordSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'word',
    justOne: false
})

export default model('Word', WordSchema)