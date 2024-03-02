const auth = require("../middleware/auth")
const express = require("express")
const router = express.Router()
const { Movie, validate } = require("../models/movie")
const { Genre } = require("../models/genre")
const { MovieGenre } = require("../models")

router.get("/", async (req, res) => {
  const movies = await Movie.findAll({
    order: [["title", "DESC"]],
    attributes: ["id", "title", "dailyRentalRate", "numberInStock"],
  })
  res.send(movies)
})

router.post("/", auth, async (req, res) => {
  const { value, error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const movie = await Movie.create({
    title: req.body.title,
    dailyRentalRate: req.body.dailyRentalRate,
    numberInStock: req.body.numberInStock,
  })

  for (const genreName of value.genres) {
    const [genre, created] = await Genre.findOrCreate({
      where: { name: genreName },
    })

    await MovieGenre.create({ MovieId: movie.id, GenreId: genre.id })
  }
  res.send(movie)
})

module.exports = router
