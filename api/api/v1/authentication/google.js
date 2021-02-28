import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/user'

passport.serializeUser(function(user, done) {
    done(null, user.id)
  })
  
passport.deserializeUser(function(user, done) {
    done(null, user.id)
})

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, cb) {

    const { email, name, locale, picture, sub } = profile._json

    // Check for user
    const user = await User.findOne({ email }).select('+password')

    // Register User if doesn't exist
    if(!user) {

      await User.create({
        method: 'google',
        username: name,
        locale: locale !== 'fr' ? 'en' : 'fr',
        pic: picture,
        'google.sub': sub
      })
    }

    // Generate Token
    const options = {
        expires: new Date(Date.now() + env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.status(200)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })

    return cb(null, profile)
  }
))