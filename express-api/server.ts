import express from 'express'
import "./config/dotenv"

const app = express()

const PORT = process.env.PORT

app.use(express.json())

app.get('/api', (req, res) => {
  console.log('/api was called')

  res.status(200).json({
    hello: "world",
  })
})

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))