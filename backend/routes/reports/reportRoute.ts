import { Router, Request, Response } from 'express'
import { authMiddleware, isAdmin } from '../../middlewares/auth'
import db from '../../config/db'
import { Parser } from 'json2csv'

const router = Router()

// Get report data
router.get('/reports/vacations', authMiddleware, isAdmin, async (req: Request, res: Response) => {
    try {
        const [rows]: any = await db.execute(`
            SELECT v.destination, COUNT(f.user_id) AS followers
            FROM vacations v
            LEFT JOIN followers f ON v.id = f.vacation_id
            GROUP BY v.destination
        `)

        res.json(rows)
    } catch (error) {
        res.status(500).json({ msg: 'Server error' })
    }
})

// Download CSV
router.get('/reports/vacations/csv', authMiddleware, isAdmin, async (req: Request, res: Response) => {
    try {
        const [rows]: any = await db.execute(`
            SELECT v.destination, COUNT(f.user_id) AS followers
            FROM vacations v
            LEFT JOIN followers f ON v.id = f.vacation_id
            GROUP BY v.destination
        `)

        const parser = new Parser({ fields: ['destination', 'followers'] })
        const csv = parser.parse(rows)

        res.header('Content-Type', 'text/csv')
        res.attachment('vacation_report.csv')
        res.send(csv)
    } catch (error) {
        res.status(500).json({ msg: 'CSV generation error' })
    }
})

export default router
