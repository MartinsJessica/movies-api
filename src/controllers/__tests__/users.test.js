import { createUser, createFavoriteMovie } from '../users.js'
import { database } from '../../clients/database.js'
import axios from 'axios'

jest.mock('../../clients/database.js', () => ({
  database: {
    user: {
      create: jest.fn()
    },
    movie: {
      findUnique: jest.fn(),
      create: jest.fn()
    },
    favorite: {
      create: jest.fn()
    }
  }
}))

jest.mock('axios')

global.console = { log: jest.fn() }

describe('createUser', () => {
  describe('when the request is executed', () => {
    describe('with a users data', () => {
      describe('and the user is created', () => {
        const fakeRequest = {
          body: {
            email: 'test@test.com',
            name: 'test'
          }
        }

        const mockJson = jest.fn()

        const mockResponse = {
          status: jest.fn(() => ({
            json: mockJson
          }))
        }

        beforeAll(async () => {
          database.user.create.mockResolvedValue({ id: 1, email: 'test@test.com', name: 'test' })

          await createUser(fakeRequest, mockResponse)
        })

        afterAll(() => {
          jest.clearAllMocks()
        })

        it('should create a new user', () => {
          expect(database.user.create).toHaveBeenCalledWith({
            data: {
              email: 'test@test.com', name: 'test'
            }
          })
          expect(database.user.create).toHaveBeenCalledTimes(1)
        })

        it('should return a new user', () => {
          expect(mockResponse.status).toHaveBeenCalledWith(201)
          expect(mockJson).toHaveBeenCalledWith({
            data: {
              id: 1,
              email: 'test@test.com',
              name: 'test'
            }
          })
        })
      })

      describe('and the user is not created', () => {
        const fakeRequest = {
          body: {
            email: 'test@test.com',
            name: 'test'
          }
        }

        const mockJson = jest.fn()

        const mockResponse = {
          status: jest.fn(() => ({
            json: mockJson
          }))
        }

        beforeAll(async () => {
          database.user.create.mockRejectedValue(new Error('Error creating user'))

          await createUser(fakeRequest, mockResponse)
        })

        afterAll(() => {
          jest.clearAllMocks()
        })

        it('should try create a new user', () => {
          expect(database.user.create).toHaveBeenCalledWith({
            data: {
              email: 'test@test.com', name: 'test'
            }
          })
          expect(database.user.create).toHaveBeenCalledTimes(1)
        })

        it('should return an error', () => {
          expect(mockResponse.status).toHaveBeenCalledWith(500)
          expect(mockJson).toHaveBeenCalledWith({ error: 'Erro ao gravar o usuário!' })
        })
      })
    })
  })
})

describe('createFavoriteMovie', () => {
  describe('when the request is executed', () => {
    describe('with movie identifer', () => {
      describe('and the movie exist in database', () => {
        describe('and the movie was successfully favorited', () => {
          const fakeRequest = {
            params: {
              id: 1
            },
            body: {
              imdbId: '123'
            }
          }

          const mockJson = jest.fn()

          const mockResponse = {
            status: jest.fn(() => ({
              json: mockJson
            }))
          }

          beforeAll(async () => {
            database.movie.findUnique.mockResolvedValue({ id: 1, title: 'test' })
            database.favorite.create.mockResolvedValue()

            await createFavoriteMovie(fakeRequest, mockResponse)
          })

          afterAll(() => {
            jest.clearAllMocks()
          })

          it('should find the movie in database', () => {
            expect(database.movie.findUnique).toHaveBeenCalledWith({
              where: {
                imdbId: fakeRequest.body.imdbId
              }
            })
            expect(database.movie.findUnique).toHaveBeenCalledTimes(1)
          })

          it('should create a favorite movie', () => {
            expect(database.favorite.create).toHaveBeenCalledWith({
              data: {
                userId: fakeRequest.params.id,
                movieId: 1
              }
            })
            expect(database.favorite.create).toHaveBeenCalledTimes(1)
          })

          it('should return a success message', () => {
            expect(mockResponse.status).toHaveBeenCalledWith(201)
            expect(mockJson).toHaveBeenCalledWith({
              data: {
                message: `O filme test foi ♥️ com sucesso!`
              }
            })
          })
        })

        describe('and the movie was not favorited', () => {
          const fakeRequest = {
            params: {
              id: 1
            },
            body: {
              imdbId: '123'
            }
          }

          const mockJson = jest.fn()

          const mockResponse = {
            status: jest.fn(() => ({
              json: mockJson
            }))
          }

          const fakeError = new Error('Error creating favorite')

          beforeAll(async () => {
            database.movie.findUnique.mockResolvedValue({ id: 1, title: 'test' })
            database.favorite.create.mockRejectedValue(fakeError)

            await createFavoriteMovie(fakeRequest, mockResponse)
          })

          afterAll(() => {
            jest.clearAllMocks()
          })

          it('should find the movie in database', () => {
            expect(database.movie.findUnique).toHaveBeenCalledWith({
              where: {
                imdbId: fakeRequest.body.imdbId
              }
            })
            expect(database.movie.findUnique).toHaveBeenCalledTimes(1)
          })

          it('should try create a favorite movie', () => {
            expect(database.favorite.create).toHaveBeenCalledWith({
              data: {
                userId: fakeRequest.params.id,
                movieId: 1
              }
            })
            expect(database.favorite.create).toHaveBeenCalledTimes(1)
          })

          it('should return an error', () => {
            expect(console.log).toHaveBeenCalledWith(fakeError)
            expect(mockResponse.status).toHaveBeenCalledWith(500)
            expect(mockJson).toHaveBeenCalledWith({ error: 'Erro ao favoritar o filme!' })
          })
        })
      })

      describe('and the movie not exist in database', () => {
        describe('and the movie was located in the movie api', () => {
          describe('and the movie was successfully favorited', () => {
            const fakeRequest = {
              params: {
                id: 1
              },
              body: {
                imdbId: 'fake-movie-imdb-id'
              }
            }

            const fakeMovieApiResponse = {
              Response: 'True',
              Title: 'fake-movie-title',
              imdbID: 'fake-movie-imdb-id',
              Plot: 'fake-movie-plot',
              Year: '2021',
              Genre: 'fake-movie-genre',
              Poster: 'fake-movie-poster',
              Runtime: '110 min'
            }

            const mockJson = jest.fn()

            const mockResponse = {
              status: jest.fn(() => ({
                json: mockJson
              }))
            }

            beforeAll(async () => {
              database.movie.findUnique.mockResolvedValue(null)
              axios.get.mockResolvedValue({
                data: fakeMovieApiResponse
              })

              database.movie.create.mockResolvedValue({ id: 1, title: 'fake-movie-title' })

              database.favorite.create.mockResolvedValue()

              await createFavoriteMovie(fakeRequest, mockResponse)
            })

            afterAll(() => {
              jest.clearAllMocks()
            })

            it('should try find the movie in database', () => {
              expect(database.movie.findUnique).toHaveBeenCalledWith({
                where: {
                  imdbId: fakeRequest.body.imdbId
                }
              })
              expect(database.movie.findUnique).toHaveBeenCalledTimes(1)
            })

            it('should search imdbId in movie api', () => {
              expect(axios.get).toHaveBeenCalledWith(`http://www.omdbapi.com/?i=${fakeRequest.body.imdbId}&apikey=fake-api-key`)
              expect(axios.get).toHaveBeenCalledTimes(1)
            })

            it('should create a new movie in database', () => {
              expect(database.movie.create).toHaveBeenCalledWith({
                data: {
                  description: 'fake-movie-plot',
                  genres: 'fake-movie-genre',
                  imdbId: 'fake-movie-imdb-id',
                  poster: 'fake-movie-poster',
                  releaseYear: 2021,
                  runTime: '110 min',
                  title: 'fake-movie-title'
                }
              })
              expect(database.movie.create).toHaveBeenCalledTimes(1)
            })

            it('should create a favorite movie', () => {
              expect(database.favorite.create).toHaveBeenCalledWith({
                data: {
                  userId: fakeRequest.params.id,
                  movieId: 1
                }
              })
              expect(database.favorite.create).toHaveBeenCalledTimes(1)
            })

            it('should return a success message', () => {
              expect(mockResponse.status).toHaveBeenCalledWith(201)
              expect(mockJson).toHaveBeenCalledWith({
                data: {
                  message: `O filme ${fakeMovieApiResponse.Title} foi ♥️ com sucesso!`
                }
              })
            })
          })

          describe('and the movie was not favorited', () => {
            const fakeRequest = {
              params: {
                id: 1
              },
              body: {
                imdbId: 'fake-movie-imdb-id'
              }
            }

            const fakeMovieApiResponse = {
              Response: 'True',
              Title: 'fake-movie-title',
              imdbID: 'fake-movie-imdb-id',
              Plot: 'fake-movie-plot',
              Year: '2021',
              Genre: 'fake-movie-genre',
              Poster: 'fake-movie-poster',
              Runtime: '110 min'
            }


            const mockJson = jest.fn()
            const mockStatus = jest.fn(() => ({ json: mockJson }))
            const mockResponse = {
              status: mockStatus
            }

            const fakeError = new Error('Error creating favorite')

            beforeAll(async () => {
              database.movie.findUnique.mockResolvedValue(null)
              axios.get.mockResolvedValue({
                data: fakeMovieApiResponse
              })

              database.movie.create.mockResolvedValue({ id: 1, title: 'fake-movie-title' })

              database.favorite.create.mockRejectedValue(fakeError)

              await createFavoriteMovie(fakeRequest, mockResponse)
            })

            afterAll(() => {
              jest.clearAllMocks()
            })

            it('should try to find the movie in the database', () => {
              expect(database.movie.findUnique).toHaveBeenCalledWith({
                where: {
                  imdbId: fakeRequest.body.imdbId
                }
              })
              expect(database.movie.findUnique).toHaveBeenCalledTimes(1)
            })

            it('should search imdbId in the movie API', () => {
              expect(axios.get).toHaveBeenCalledWith(`http://www.omdbapi.com/?i=${fakeRequest.body.imdbId}&apikey=fake-api-key`)
              expect(axios.get).toHaveBeenCalledTimes(1)
            })

            it('should create a new movie in the database', () => {
              expect(database.movie.create).toHaveBeenCalledWith({
                data: {
                  description: fakeMovieApiResponse.Plot,
                  genres: fakeMovieApiResponse.Genre,
                  imdbId: fakeMovieApiResponse.imdbID,
                  poster: fakeMovieApiResponse.Poster,
                  releaseYear: Number(fakeMovieApiResponse.Year),
                  runTime: fakeMovieApiResponse.Runtime,
                  title: fakeMovieApiResponse.Title
                }
              })
              expect(database.movie.create).toHaveBeenCalledTimes(1)
            })

            it('should try create a favorite movie', () => {
              expect(database.favorite.create).toHaveBeenCalledWith({
                data: {
                  userId: fakeRequest.params.id,
                  movieId: 1
                }
              })
              expect(database.favorite.create).toHaveBeenCalledTimes(1)
            })

            it('should return an error', () => {
              expect(console.log).toHaveBeenCalledWith(fakeError)
              expect(mockResponse.status).toHaveBeenCalledWith(500)
              expect(mockJson).toHaveBeenCalledWith({ error: 'Erro ao favoritar o filme!' })
            })

          })
        })

        describe('and the movie was not located in the movie api', () => {
          const fakeRequest = {
            params: {
              id: 1
            },
            body: {
              imdbId: 'fake-movie-imdb-id'
            }
          }
          const mockJson = jest.fn()
          const mockStatus = jest.fn(() => ({ json: mockJson }))
          const mockResponse = {
            status: mockStatus
          }

          beforeAll(async () => {
            database.movie.findUnique.mockResolvedValue(null)
            axios.get.mockResolvedValue({
              data: { Response: 'False' }
            })

            await createFavoriteMovie(fakeRequest, mockResponse)
          })

          afterAll(() => {
            jest.clearAllMocks()
          })

          it('should try find movie in database', () => {
            expect(database.movie.findUnique).toHaveBeenCalledWith({
              where: {
                imdbId: fakeRequest.body.imdbId
              }
            })
            expect(database.movie.findUnique).toHaveBeenCalledTimes(1)
          })

          it('should try localize movie in external api', () => {
            expect(axios.get).toHaveBeenCalledWith(`http://www.omdbapi.com/?i=${fakeRequest.body.imdbId}&apikey=fake-api-key`)
            expect(axios.get).toHaveBeenCalledTimes(1)
          })

          it('should return an error message when the movie is not found in the API', () => {
            expect(mockResponse.status).toHaveBeenCalledWith(404)
            expect(mockJson).toHaveBeenCalledWith({ data: { message: 'Filme não encontrado!' } })
          })
        })
      })
    })
  })
})
