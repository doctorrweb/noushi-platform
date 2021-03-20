import { Schema as MongooseSchema, model, ObjectId } from 'mongoose'

const DefinitionSchema = new MongooseSchema({
    content: {
        type: String,
        required: [true, 'Please add a text'],
        maxlength: [500, 'Description cannot be more than 50 characters'],
        unique: true
    },
    word: {
        type: ObjectId,
        ref: 'Word',
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
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
DefinitionSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'word',
    justOne: false
})

export default model('Definition', DefinitionSchema)