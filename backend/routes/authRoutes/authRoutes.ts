import { Request, Response, Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../../config/db'

const router = Router()

router.post('/registration', async (req: Request, res: Response): Promise<any> => {
    try {
        const { first_name, last_name, email, password } = req.body

        const [existingUsers]: any = await db.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        )

        if (existingUsers.length > 0)
            return res.status(400).json({ msg: 'User already exists' })

        const hashedPassword = await bcrypt.hash(password, 10)

        await db.execute(
            'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
            [first_name, last_name, email, hashedPassword]
        )

        res.status(201).json({ msg: 'User registered successfully' })
    } catch (error) {
        console.error('Registration Error:', error)
        res.status(500).json({ msg: 'Server error' })
    }
})

router.post('/login', async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body

        const [rows]: any = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        )

        const user = rows[0]
        if (!user) return res.status(400).json({ msg: 'Email not found' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' })

        const token = jwt.sign(
            { id: user.id, name: user.first_name, role: user.role },
            process.env.SECRET!,
            { expiresIn: '1h' }
        )

        res.json({ token })
    } catch (error) {
        console.error('Login Error:', error)
        res.status(500).json({ msg: 'Server error' })
    }
})

export default router
