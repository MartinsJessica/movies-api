import { searchMovie } from '../movies.js'
import axios from 'axios'

jest.mock('axios')

const FAKE_MOVIE_API_KEY = 'fake-api-key'

describe('searchMovie', () => {
  describe('when the request is executed', () => {
    describe('with the search query', () => {
      const mockResponse = { json: jest.fn() }
      const fakeRequest = { query: { search: 'batman' } }

      beforeAll(() => {
        axios.get.mockResolvedValue({ data: 'movie data' })

        searchMovie(fakeRequest, mockResponse)
      })

      it('should call data from the movie api', () => {
        expect(axios.get).toHaveBeenCalledWith(
          `http://www.omdbapi.com/?s=batman&apikey=${FAKE_MOVIE_API_KEY}`)
      })

      it('should return the movie data', () => {
        expect(mockResponse.json).toHaveBeenCalledWith({ data: 'movie data' })
      })
    })
  })
})
