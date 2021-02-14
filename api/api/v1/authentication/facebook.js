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