import crypto from 'crypto'
import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config as dotenvConfig } from 'dotenv'

dotenvConfig()
const env = process.env


const UserSchema = new Schema({
    method: {
        type: String,
        enum: ['local', /* facebook, google, linkedin, github, activDirecvtory */],
        required: [true, 'Please select a connection Method'],
        default: 'local'
    },
    email: {
        type: String,
        required: [true, 'Please add an email address'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email address'
        ],
        unique: true
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
    surname: {
        type: String,
        required: [true, 'Please add a surname']
    },
    firstname: {
        type: String,
        required: [true, 'Please add a firstname']
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
        default: 'suscriber'
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

// Compare Password
UserSchema.methods.matchPassword = async function (password) {
    return bcrypt.compareSync(password, this.password)
}

//Sign a web Token
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRE })
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

// // Reverse populate with virtuals
// UserSchema.virtual('deliverables', {
//     ref: 'Deliverable',
//     localField: '_id',
//     foreignField: 'responsible',
//     justOne: false
// })

export default model('User', UserSchema)