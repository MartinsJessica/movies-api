import express from 'express'

import { users, movies } from './routes/index.js'


const app = express()

app.use(express.json())

app.get('/', (_request, response) => response.send('MOVIES API'))

app.use('/users', users)
app.use('/movies', movies)

export default app
