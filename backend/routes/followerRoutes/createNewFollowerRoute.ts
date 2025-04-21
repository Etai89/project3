import { Router, Request, Response } from 'express'
import { authMiddleware } from '../../middlewares/auth'
import db from '../../config/db'

const router = Router()

router.post('/followers/:vacationId', authMiddleware, async (req: Request, res: Response) => {
    try {
        const vacationId = parseInt(req.params.vacationId)
        const userId = req.user?.id

        await db.execute(
            'INSERT IGNORE INTO followers (user_id, vacation_id) VALUES (?, ?)',
            [userId, vacationId]
        )

        res.status(201).json({ msg: 'Followed vacation successfully' })
    } catch (error) {
        res.status(500).json({ msg: 'Server error' })
    }
})

export default router
