import axios from 'axios'

const { MOVIE_API_KEY } = process.env

const movieApiUrl = 'http://www.omdbapi.com/'

const searchMovie = async (request, response) => {
  const { search } = request.query

  const { data } = await axios.get(
    `${movieApiUrl}?s=${search}&apikey=${MOVIE_API_KEY}`
  )

  response.json({ data })
}

export {
  searchMovie
}
