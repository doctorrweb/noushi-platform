import { Schema as MongooseSchema, model, ObjectId } from 'mongoose'

const WordSchema = new MongooseSchema({
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
    certified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'deprecated'],
        default: 'pending'
    },
    lang: {
        type: String,
        enum: [ 'en', 'fr', 'noushi' ],
        required: [true, 'Please choose a language'],
        default: 'noushi'
    },
    avgRating: {
        type: Number,
        min: [1, 'Average Rating must be at least 1'],
        max: [10, 'Average Rating cannot be more than 10']
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