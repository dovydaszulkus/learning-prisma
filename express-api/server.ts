import "./config/dotenv"
import express from 'express'
import errorHandler from "./middleware/errorMiddleware"
import moviesRouter from "./routes/moviesRoutes"

const app = express()

const PORT = process.env.PORT

app.use(express.json())


app.use("/api/movies", moviesRouter)

app.use(errorHandler)

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))