import { Router, Request, Response } from 'express'
import { authMiddleware } from '../../middlewares/auth'
import db from '../../config/db'

const router = Router()

router.get('/followers/count', authMiddleware, async (req: Request, res: Response) => {
    try {
        const [rows]: any = await db.execute(`
            SELECT vacation_id, COUNT(user_id) AS followers
            FROM followers
            GROUP BY vacation_id
        `)

        res.json(rows)
    } catch (error) {
        res.status(500).json({ msg: 'Server error' })
    }
})

export default router
