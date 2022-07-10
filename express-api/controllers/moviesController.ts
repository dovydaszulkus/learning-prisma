import type { Request, Response, NextFunction } from "express"
import fetch from 'node-fetch'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const getAllMovies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        genres: true
      }
    })
    res.status(200).json({ data: movies })
  } catch (error) {
    res.status(500)
    next(error)
  }
}

const addMovie = async (req: Request, res: Response, next: NextFunction) => {
  const movieId = req.body.movieId

  if (!movieId) {
    return res.status(400).json({ message: "Missing movieId in the request. Please add movieId to the request body and try again."})
  }

  try {
    const apiResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`)
    const movieData = await apiResponse.json()

    const { backdrop_path, overview, poster_path, release_date, runtime, status, tagline, title, id, vote_average, vote_count, genres } = movieData

    const added = await prisma.movie.create({
      data: {
        backdrop_path,
        description: overview,
        poster_path,
        release_date,
        runtime,
        status,
        tagline,
        title,
        tmdb_id: id,
        vote_average,
        vote_count,
        genres: {
          connectOrCreate: genres.map((genre: { name: string }) => ({
              where: { name: genre.name },
              create: { name: genre.name },
          }))
        }
      }
    })

    res.status(200).json({ data: added })
  } catch (error) {
    res.status(500)
    next(error)
  }
}

const getSingleMovie = async (req: Request, res: Response, next: NextFunction) => {
  const movieId = Number(req.params.id)

  if (!movieId) {
    return res.status(400).json({ message: "Missing movieId in the request. Please add movieId to the request body and try again."})
  }

  try {
    const movie = await prisma.movie.findFirst({
      where: { id: movieId },
      include: { genres: true }
    })
  
    res.status(200).json({ data: movie })
  } catch (error) {
    res.status(500)
    next(error)
  }
}

const deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
  const movieId = Number(req.params.id)

  if (!movieId) {
    return res.status(400).json({ message: "Missing movieId in the request. Please add movieId to the request body and try again."})
  }

  try {
    const deletedMovie = await prisma.movie.delete({
      where: { id: movieId }
    })
  
    res.status(200).json({ data: deletedMovie }) 
  } catch (error) {
    res.status(500)
    next(error)
  }
}

const updateMovie = async (req: Request, res: Response, next: NextFunction) => {
  const movieId = Number(req.params.id)
  const updates = req.body

  if (!movieId) {
    return res.status(400).json({ message: "Missing movieId in the request. Please add movieId to the request body and try again."})
  }

  if (!updates) {
    return res.status(400).json({ message: "Missing fields in the request. Please add fields that need to be updated."})
  }

  try {
    const updatedMovie = await prisma.movie.update({
      where: {
        id: movieId,
      },
      include: {
        genres: true
      },
      data: {
          ...updates,
          genres: {
            set: updates.genres
          }
        }
      }
    )
  
    res.status(200).json({ data: updatedMovie })
  } catch (error) {
    res.status(500)
    next(error)
  }
}

export {
  getAllMovies,
  addMovie,
  getSingleMovie,
  deleteMovie,
  updateMovie,
}