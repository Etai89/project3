import { Request, Response, Router } from 'express';
const router = Router()
router.get('/test', async(req: Request, res: Response) => {

    const response = await fetch('http://localhost:3006/')
    const data = await response.json()
    console.log(data)
    res.json(data)
})
export default router