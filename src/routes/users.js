import { Router } from 'express'
import { usersController } from '../controllers/index.js'

const router = Router()

// rotas comuns de usuário
router.get('/')
router.get('/:id')
router.post('/', usersController.createUser)
router.put('/:id')
router.delete('/:id')

// rotas para favoritar filmes
router.post('/:id/favorites', usersController.createFavoriteMovie)
router.get('/:id/favorites')
router.delete('/:id/favorites/:movieId')

export default router
