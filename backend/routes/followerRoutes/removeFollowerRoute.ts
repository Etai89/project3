import { Router, Request, Response } from 'express'
import { authMiddleware } from '../../middlewares/auth'
import db from '../../config/db'

const router = Router()

router.delete('/followers/:vacationId', authMiddleware, async (req: Request, res: Response) => {
    try {
        const vacationId = parseInt(req.params.vacationId)
        const userId = req.user?.id

        await db.execute(
            'DELETE FROM followers WHERE user_id = ? AND vacation_id = ?',
            [userId, vacationId]
        )

        res.json({ msg: 'Unfollowed vacation successfully' })
    } catch (error) {
        res.status(500).json({ msg: 'Server error' })
    }
})

export default router
