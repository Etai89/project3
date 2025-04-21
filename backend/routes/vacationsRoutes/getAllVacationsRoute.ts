import { Router, Request, Response } from 'express'
import { authMiddleware } from '../../middlewares/auth'
import db from '../../config/db'

const router = Router()

router.get('/vacations', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const filter = req.query.filter // "future" | "active" | "followed"
    let query = `
      SELECT v.*, 
        EXISTS(SELECT * FROM followers WHERE user_id = ? AND vacation_id = v.id) AS is_following,
        (SELECT COUNT(*) FROM followers WHERE vacation_id = v.id) AS followers_count
      FROM vacations v
    `
    const params: any[] = [userId]

    if (filter === 'future') {
      query += ' WHERE v.start_date > CURDATE()'
    } else if (filter === 'active') {
      query += ' WHERE v.start_date <= CURDATE() AND v.end_date >= CURDATE()'
    } else if (filter === 'followed') {
      query += `
        JOIN followers f ON v.id = f.vacation_id
        WHERE f.user_id = ?
      `
      params.push(userId) // כי יש פעמיים ?
    }

    query += ' ORDER BY v.start_date ASC'

    const [rows]: any = await db.execute(query, params)
    res.json(rows)
  } catch (error: any) {
    console.error('Get vacations error:', error.message)
    res.status(500).json({ msg: 'Server error', error: error.message })
  }
})

export default router
