import { Router } from 'express'
import { moviesController } from '../controllers/index.js'

const router = Router()

router.get('/', moviesController.searchMovie)

export default router
