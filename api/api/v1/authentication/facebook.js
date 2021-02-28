// import passport from 'passport'
// import { Strategy as FacebookStrategy } from 'passport-facebook'
// import User from '../models/user'

// export default passport.use(new FacebookStrategy({
//     clientID: FACEBOOK_APP_ID,
//     clientSecret: FACEBOOK_APP_SECRET,
//     callbackURL: "http://www.example.com/auth/facebook/callback"
//   },

//   function(accessToken, refreshToken, profile, done) {
//     User.findOrCreate(..., function(err, user) {
//       if (err) { return done(err); }
//       done(null, user)
//     })
//   }

// ))

import passport from "passport"
import { Strategy as FacebookStrategy } from "passport-facebook"
import User from '../models/user'

passport.serializeUser(function(user, done) {
    done(null, user.id)
  })
  
passport.deserializeUser(function(user, done) {
    done(null, user.id)
})

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        console.log('accessToken', accessToken)
        console.log('refreshToken', refreshToken)
        console.log('profile', profile._json)
      done(null, profile)
    }
  )
)