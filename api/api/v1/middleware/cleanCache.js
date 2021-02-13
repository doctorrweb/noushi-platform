import { clearHash } from '../utils/cache'

export default async (req, res, next) => {
    await next()

    clearHash(req.user.id)
}