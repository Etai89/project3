import { Router, Request, Response } from 'express'
import { authMiddleware } from '../../middlewares/auth'
import db from '../../config/db'

const router = Router()

router.get('/vacations/followed', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id

        const [rows]: any = await db.execute(`
            SELECT v.*
            FROM vacations v
            JOIN followers f ON v.id = f.vacation_id
            WHERE f.user_id = ?
            ORDER BY v.start_date ASC
        `, [userId])

        res.json(rows)
    } catch (error) {
        res.status(500).json({ msg: 'Server error' })
    }
})

export default router
