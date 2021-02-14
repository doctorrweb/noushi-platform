import { Router } from 'express'
import passport from 'passport'
import '../authentication/google'

const googleRouter = Router()

googleRouter.route('/')
    .get(passport.authenticate('google', { scope: ['profile', 'email'] }))

googleRouter.route('/callback')
    .get(passport.authenticate('google', { failureRedirect: '/failed' }), function(req, res) {
        res.redirect('/me')
    })

export default googleRouter