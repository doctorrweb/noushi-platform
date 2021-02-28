import { Schema as MongooseSchema, model, ObjectId } from 'mongoose'

const RatingSchema = new MongooseSchema({
    value: {
        type: Number,
        required: [true, 'Please add a value'],
        min: [1, 'Completion rate must be at least 1'],
        max: [5, 'Completion rate cannot be more than 10'],
    },
    target: {
        type: String,
        enum: ['word', 'definition'],
        required: [true, 'Please add a Target']
    },
    word: {
        type: ObjectId,
        ref: 'Word',
        required: [
            function () {
                return this.type === 'word'
            },
            'Please add a word'
        ]
    },
    definition: {
        type: ObjectId,
        ref: 'Definition',
        required: [
            function () {
                return this.type === 'definition'
            },
            'Please add a definition'
        ]
    },
    isActive: {
        type: Boolean,
        default: true
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
RatingSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'word',
    justOne: false
})

export default model('Rating', RatingSchema)