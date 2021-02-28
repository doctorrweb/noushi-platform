import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import User from '../models/user'

const localOptions = { usernameField: 'email' }

const verify = async (email, password, done) => {

    // Find the user given email
    const user = await User.findOne({ email })

    // If not, handle it
    if (!user) {
        return done(null, false)
    }

    // Check if the password is correct
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
        return done(null, false)
    }

    return done(null, user)
}

passport.use(new LocalStrategy(localOptions, verify))