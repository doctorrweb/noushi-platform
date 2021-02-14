import { Router } from 'express'
import { uploadDoc } from '../controllers/upload'
import { protect } from '../middleware/auth'

const uploadRouter = Router()

uploadRouter.route('/')
    .get(protect, uploadDoc)


export default uploadRouter