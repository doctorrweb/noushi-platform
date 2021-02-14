import asyncHandler from '../middleware/async'
import AWS from 'aws-sdk'
import { v1 } from 'uuid'

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET,
    region: process.env.AWS_REGION
})


/*
@desc       Upload a new document
@route      POST /api/v1/uploads
@access     Private
*/
export const uploadDoc = asyncHandler( async (req, res, next) => {

    const key = `${req.user.id}/${v1()}.jpeg`

    s3.getSignedUrl('putObject', {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        ContentType: 'image/jpeg',
        Key: key
    }, (err, url) => {
        if(err) return console.log(err)
        res.status(200).json({
            success: true,
            data: { key, url }
        })
    })


    /* 
    In front-end make a put request on the url returned in the respond 
    with the file in the body to upload it.
    in the headers add {'Content-type': file.type}
    the link of the file is the key prefixed by the base url of the aws bucket
    */

})