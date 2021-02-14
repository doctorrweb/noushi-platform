import crypto from 'crypto'
import { Schema as MongooseSchema, model } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import setLocation from '../utils/geocoder'

const UserSchema = new MongooseSchema({
    method: {
        type: [String],
        enum: ['local', 'facebook', 'google', 'instagram'],
        required: [true, 'Please select a connection Method'],
        default: ['local']
    },
    email: {
        type: String,
        required: [true, 'Please add an email address'],
        match: [
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            'Please add a valid email address'
        ],
        trim: true,
        unique: true
    },
    username: {
        type: String,
        required: [true, 'Please add an username'],
        unique: true
    },
    address: {
        type: String,
    },
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    role: {
        type: String,
        lowercase: true,
        enum: [
            'suscriber',
            'manager',
            'contributor',
            'administrator'
        ],
        required: true,
        default: 'administrator'
    },
    password: {
        type: String,
        required: [
            function () {
                return this.method === 'local'
            },
            'For local connections, the password is required'
        ],
        minlength: [6, 'Your password must have 6 characters minimum'],
        select: false,
    },
    resetPassword: {
        type: String,
        select: false
    },
    resetPasswordExpire: {
        type: Date,
        select: false
    },
    pic: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


// Encrypt Password
UserSchema.pre('save', async function (next) {

    if(!this.isModified('password')) return next()

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})


// Geocode & create location field 
UserSchema.pre('save', async function (next) {

    if (!this.address) next()

    const location = await setLocation(this.address)
    this.location = location

    // Do not save address in DB
    this.address = undefined

    next()
})


// Geocode & create location field 
UserSchema.pre('updateOne', async function (next) {

    if (!this.isModified('address')) next()

    const location = await setLocation(this.address)
    this.location = location

    // Do not save address in DB
    this.address = undefined

    next()
})


// Compare Password
UserSchema.methods.matchPassword = async function (password) {
    return bcrypt.compareSync(password, this.password)
}

//Sign a web Token
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
} 

// Generate and Hash Password Token
UserSchema.methods.getResetPasswordToken = function(req, res, next) {

    // Generate Token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // Hash Token and set to the esetPassword field
    this.resetPassword = crypto
        .createHash('sha256') 
        .update(resetToken)
        .digest('hex')

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    return resetToken
}

// Reverse populate with virtuals
UserSchema.virtual('words', {
    ref: 'Word',
    localField: '_id',
    foreignField: 'user',
    justOne: false
})
// Reverse populate with virtuals
UserSchema.virtual('definitions', {
    ref: 'Definition',
    localField: '_id',
    foreignField: 'user',
    justOne: false
})
// Reverse populate with virtuals
UserSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'user',
    justOne: false
})

export default model('User', UserSchema)