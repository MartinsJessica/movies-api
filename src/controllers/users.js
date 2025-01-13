import { database } from '../clients/database.js'
import axios from 'axios'

const { MOVIE_API_KEY } = process.env

const movieApiUrl = 'http://www.omdbapi.com/'

const createUser = async (request, response) => {
  try {
    const { email, name } = request.body

    const newUser = await database.user.create({
      data: {
        email,
        name
      }
    })

    response.status(201).json({ data: newUser })
  } catch (_error) {
    response.status(500).json({ error: 'Erro ao gravar o usuário!' })
  }
}

const createFavoriteMovie = async (request, response) => {
  try {
    const userId = Number(request.params.id)
    const { imdbId } = request.body

    const existingMovie = await database.movie.findUnique({
      where: {
        imdbId
      }
    })

    if (existingMovie) {
      await database.favorite.create({
        data: {
          userId,
          movieId: existingMovie.id
        }
      })

      return response.status(201).json({
        data: {
          message: `O filme ${existingMovie.title} foi ♥️ com sucesso!`
        }
      })
    }

    const movieOmdb = await axios
      .get(`${movieApiUrl}?i=${imdbId}&apikey=${MOVIE_API_KEY}`)
      .then(result => result.data)
      .catch(() => undefined)

    if (movieOmdb?.Response === 'False') {
      return response.status(404).json({ data: { message: 'Filme não encontrado!' } })
    }

    const newMovie = {
      imdbId,
      title: movieOmdb.Title,
      description: movieOmdb.Plot,
      releaseYear: Number(movieOmdb.Year),
      genres: movieOmdb.Genre,
      poster: movieOmdb.Poster,
      runTime: movieOmdb.Runtime
    }

    const { id: movieId } = await database.movie.create({
      data: {
        ...newMovie
      }
    })

    await database.favorite.create({
      data: {
        movieId,
        userId
      }
    })

    response.status(201).json({
      data: {
        message: `O filme ${newMovie.title} foi ♥️ com sucesso!`
      }
    })
  } catch (error) {
    console.log(error)
    response.status(500).json({ error: 'Erro ao favoritar o filme!' })
  }
}

export {
  createUser,
  createFavoriteMovie
}
