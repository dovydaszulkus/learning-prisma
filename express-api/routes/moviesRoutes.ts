import express from 'express'
import { addMovie, getAllMovies, getSingleMovie, deleteMovie, updateMovie } from '../controllers/moviesController'

const router = express.Router()

router
  .route("/")
  .get(getAllMovies)
  .post(addMovie)

router
  .route("/:id")
  .get(getSingleMovie)
  .put(updateMovie)
  .delete(deleteMovie)

export default router