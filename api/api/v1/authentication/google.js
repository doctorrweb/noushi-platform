import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

passport.serializeUser(function(user, done) {
    done(null, user)
  })
  
passport.deserializeUser(function(user, done) {
    done(null, user)
})

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile)
  }
))