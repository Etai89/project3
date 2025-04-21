import { Router, Request, Response } from 'express'
import { authMiddleware, isAdmin } from '../../middlewares/auth'
import db from '../../config/db'

const router = Router()

router.delete('/vacations/:id', authMiddleware, isAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        await db.execute('DELETE FROM vacations WHERE id = ?', [id])

        res.json({ msg: 'Vacation deleted successfully' })
    } catch (error) {
        res.status(500).json({ msg: 'Server error' })
    }
})

export default router
