import "./config/dotenv"
import express from 'express'
import { PrismaClient } from "@prisma/client"

const app = express()
const prisma = new PrismaClient()

const PORT = process.env.PORT

app.use(express.json())

app.get('/api', async (req, res) => {
  console.log('/api was called')

  const movies = await prisma.movie.findMany()

  console.log('movies', movies)

  res.status(200).json({
    hello: "world",
  })
})

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))