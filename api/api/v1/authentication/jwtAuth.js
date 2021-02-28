import passport from 'passport'
import User from '../models/user'
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'


const verify = async (payload, done) => {
    try {
    // Find the user specified in token
        const user = await User.findById(payload.id)

        // If usrer doesn't exist, handle it
        if (!user) {
            return done(null, false)
        }

        // Otherwise, return user
        done(null, user)
    } catch (error) {
        done(error, false)
    }
}

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromHeader('authorization'),
            secretOrKey: process.env.SECRET
        },
        verify
    )
)