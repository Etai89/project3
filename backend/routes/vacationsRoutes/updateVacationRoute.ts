import { Router, Request, Response } from 'express'
import { authMiddleware, isAdmin } from '../../middlewares/auth'
import upload from '../../middlewares/upload'
import db from '../../config/db'

const router = Router()

router.put(
  '/vacations/:id',
  authMiddleware,
  isAdmin,
  upload.single('image'),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params
      const { destination, description, start_date, end_date, price } = req.body
      const numericPrice = parseFloat(price)

      if (!destination || !description || !start_date || !end_date || isNaN(numericPrice)) {
        return res.status(400).json({ msg: 'Missing or invalid fields' })
      }

      let image = req.file?.filename

      // אם לא נשלחה תמונה חדשה – שלוף את הישנה מה-DB
      if (!image) {
        const [rows]: any = await db.execute('SELECT image FROM vacations WHERE id = ?', [id])
        if (!rows.length) return res.status(404).json({ msg: 'Vacation not found' })
        image = rows[0].image
      }

      await db.execute(
        'UPDATE vacations SET destination = ?, description = ?, start_date = ?, end_date = ?, price = ?, image = ? WHERE id = ?',
        [destination, description, start_date, end_date, numericPrice, image, id]
      )

      res.json({ msg: 'Vacation updated successfully' })
    } catch (error: any) {
      console.error('Update error:', error.message)
      res.status(500).json({ msg: 'Server error', error: error.message })
    }
  }
)

export default router
