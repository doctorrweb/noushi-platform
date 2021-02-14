import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.includes('video')) {
            cb(null, 'public/video/')
        }

        if (file.mimetype.includes('image')) {
            cb(null, 'public/img/')
        }

        if (!file.mimetype.includes('video') && !file.mimetype.includes('image')) {
            cb(null, 'public/uploads/')
        }
    },
    filename: (req, file, cb) => {
        const { originalname, fieldname } = file

        const originalnameParts = originalname.split('.')

        cb(
            null,
            fieldname +
            '-' +
            originalnameParts[0] +
            '-' +
            new Date().toISOString() +
            `.${originalnameParts[originalnameParts.length - 1]}`
        )
    }
})

const upload = multer({
    storage
})


export default upload