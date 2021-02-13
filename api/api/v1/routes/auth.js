import { Router } from 'express'
import { protect } from '../middleware/auth'
import {
    register,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
} from '../controllers/auth'


const authRouter = Router()

authRouter.route('/register')
    .post(register)

authRouter.route('/login')
    .post(login)

authRouter.route('/logout')
    .get(logout)

authRouter.route('/me') 
    .get(protect, getMe)

authRouter.route('/updatedetails') 
    .put(protect, updateDetails)

authRouter.route('/forgotpassword')
    .post(forgotPassword)

authRouter.route('/updatepassword')
    .put(protect, updatePassword)

authRouter.route('/resetpassword/:resettoken')
    .put(resetPassword)




export default authRouter