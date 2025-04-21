import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('x-auth-token')
    if (!token) {
        res.status(401).json({ msg: 'No token, authorization denied' })
        return
    }
    

    try {
        const decoded = jwt.verify(token, process.env.SECRET!)
        req.user = decoded as {
            id: number
            name: string
            role: string
        }
        next()
    } catch (err) {
        res.status(401).json({ msg: 'Invalid token' })
    }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ msg: 'Access denied – Admins only' })
        return
    }
    next()
}
