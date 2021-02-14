import { Schema as MongooseSchema, model, ObjectId } from 'mongoose'

const CommentSchema = new MongooseSchema({
    content: {
        type: String,
        required: [true, 'Please add a text'],
        maxlength: [500, 'Description cannot be more than 50 characters'],
        unique: true
    },
    type: {
        type: String,
        enum: ['word', 'definition'],
        required: [true, 'Please add a Type']
    },
    word: {
        type: ObjectId,
        ref: 'Word',
        required: [
            function () {
                return this.type === 'word'
            },
            'Please add a comment'
        ]
    },
    definition: {
        type: ObjectId,
        ref: 'Word',
        required: [
            function () {
                return this.type === 'definition'
            },
            'Please add a comment'
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

export default model('Comment', CommentSchema)