import { Router } from 'express'
import passport from 'passport'
import '../authentication/facebook'

const faceBookRouter = Router()

faceBookRouter.route('/')
    .get(passport.authenticate('facebook', { scope: ['profile', 'email'] }))

faceBookRouter.route('/callback')
    .get(passport.authenticate('facebook', { failureRedirect: '/failed' }), function(req, res) {
        res.redirect('/me')
    })

export default faceBookRouter