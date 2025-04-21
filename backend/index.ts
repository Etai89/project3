/// <reference path="./types/express.d.ts" />

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import { initDB } from './config/db'

// routes
import AuthRoute from './routes/authRoutes/authRoutes'
import CreateVacationRoute from './routes/vacationsRoutes/createNewVacationRoute'
import GetVacationsRoute from './routes/vacationsRoutes/getAllVacationsRoute'
import UpdateVacationRoute from './routes/vacationsRoutes/updateVacationRoute'
import DeleteVacationRoute from './routes/vacationsRoutes/deleteVacationroute'
import CreateFollowerRoute from './routes/followerRoutes/createNewFollowerRoute'
import RemoveFollowerRoute from './routes/followerRoutes/removeFollowerRoute'
import GetFollowerQuantityRoute from './routes/followerRoutes/getFollowerQuantityRoute'
import GetFollowedVacationsRoute from './routes/followerRoutes/getFollowedVacationsRoute'
import ReportRoute from './routes/reports/reportRoute'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))


// Init DB
initDB()

// Routes
app.use('/auth', AuthRoute)
app.use('/api', CreateVacationRoute)
app.use('/api', GetVacationsRoute)
app.use('/api', UpdateVacationRoute)
app.use('/api', DeleteVacationRoute)
app.use('/api', CreateFollowerRoute)
app.use('/api', RemoveFollowerRoute)
app.use('/api', GetFollowerQuantityRoute)
app.use('/api', GetFollowedVacationsRoute)
app.use('/api', ReportRoute)

// Health check
app.get('/check', (req, res) => {
  res.send('Server OK')
})

// Don't run server in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  })
}

export default app
