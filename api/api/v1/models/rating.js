import { Schema as MongooseSchema, model, ObjectId } from 'mongoose'
import asyncHandler from '../middleware/async'

const RatingSchema = new MongooseSchema({
    value: {
        type: Number,
        required: [true, 'Please add a value'],
        min: [1, 'Rate must be at least 1'],
        max: [10, 'Rate cannot be more than 10'],
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


// Static method to get avg of word rating
RatingSchema.statics.getAverageWordRating = async function (wordId) {

    const [obj] = await this.aggregate([
        {
            $match: { word: wordId }
        },
        {
            $group: {
                _id: '$word',
                avgRating: { $avg: '$value' }
            }
        }
    ])
    
    try {
        await this.model('Word').findByIdAndUpdate(wordId, {
            avgRating: obj.avgRating
            // avgRating: Math.ceil(obj[0].avgRating / 10) * 10
        })
    } catch (error) {
        console.error(error)
    }

    
}

// Static method to get avg of word rating
RatingSchema.statics.getAverageDefinitionRating = async function (definitionId) {

    const [obj] = await this.aggregate([
        {
            $match: { definition: definitionId }
        },
        {
            $group: {
                _id: '$definition',
                avgRating: { $avg: '$value' }
            }
        }
    ])

    try {
        await this.model('Definition').findByIdAndUpdate(definitionId, {
            avgRating: obj.avgRating
            // avgRating: Math.ceil(obj[0].avgRating / 10) * 10
        })
    } catch (error) {
        console.error(error)
    }

    
}


RatingSchema.statics.certifiedWord = function (wordId) {
    this.model('Rating').count({word: wordId}, function (err, count) {

        if(err) { console.log(err) }
        if(count === process.env.NBR_RATING_WORD && this.avgRating > 7) {
            try {
                this.model('Word').findByIdAndUpdate(wordId, {
                    certified: true
                })
            } catch (error) {
                console.error(error)
            }
        }
    })
}


RatingSchema.statics.activeDefinition = function (definitionId) {
    this.model('Rating').count({definition: definitionId}, function (err, count) {

        if(err) { console.log(err) }
        if(count === process.env.NBR_RATING_DEFINITION && this.avgRating > 7) {
            try {
                this.model('Definition').findByIdAndUpdate(definitionId, {
                    isActive: true
                })
            } catch (error) {
                console.error(error)
            }
        }
    })
}


// Call getAverageRate after save
RatingSchema.post('save', function () {
    if(this.word) {
        this.constructor.getAverageWordRating(this.word)
        this.constructor.certifiedWord(this.word)
    }
    if(this.definition) {
        this.constructor.getAverageDefinitionRating(this.definition)
        this.constructor.activeDefinition(this.definition)
    }
})

// Call getAverageRate before remove
RatingSchema.pre('remove', function () {
    if(this.word) {
        this.constructor.getAverageWordRating(this.word)
    }
    if(this.definition) this.constructor.getAverageDefinitionRating(this.definition)
})

export default model('Rating', RatingSchema)