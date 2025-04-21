import { Router, Request, Response } from 'express'
import { authMiddleware, isAdmin } from '../../middlewares/auth'
import upload from '../../middlewares/upload'
import db from '../../config/db'

const router = Router()

router.post(
  '/vacations',
  authMiddleware,
  isAdmin,
  upload.single('image'),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { destination, description, start_date, end_date, price } = req.body
      const image = req.file?.filename

      console.log('BODY:', req.body)
      console.log('FILE:', req.file)

      if (!destination || !description || !start_date || !end_date || !price || !image) {
        return res.status(400).json({ msg: 'All fields are required' })
      }

      const numericPrice = parseFloat(price)
      if (isNaN(numericPrice) || numericPrice <= 0 || numericPrice > 10000) {
        return res.status(400).json({ msg: 'Invalid price' })
      }

      await db.execute(
        'INSERT INTO vacations (destination, description, start_date, end_date, price, image) VALUES (?, ?, ?, ?, ?, ?)',
        [destination, description, start_date, end_date, numericPrice, image]
      )

      res.status(201).json({ msg: 'Vacation created successfully' })
    } catch (error: any) {
      console.error('Vacation creation error:', error.message)
      res.status(500).json({ msg: 'Server error', error: error.message })
    }
  }
)

export default router
