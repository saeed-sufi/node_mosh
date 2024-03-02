const auth = require("../middleware/auth")
const express = require("express")
const sequelize = require("../dbConfig")
const router = express.Router()
const { Rental, validate } = require("../models/rental")
const { Movie } = require("../models/movie")
const { Customer } = require("../models/customer")

router.get("/", async (req, res) => {
  const rentals = await Rental.findAll({
    attributes: ["id", "dateOut", "dateReturned", "rentalFee"],
    order: [["dateOut", "DESC"]],
  })
  res.send(rentals)
})

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const customer = await Customer.findOne({
    where: { id: req.body.customerId },
  })
  if (!customer) return res.status(400).send("Invalid customer")

  const movie = await Movie.findOne({
    where: { id: req.body.movieId },
  })
  if (!movie) return res.status(400).send("Invalid movie")

  try {
    await sequelize.transaction(async (t) => {
      if (movie.numberInStock > 0) {
        await movie.decrement("numberInStock", { by: 1, transaction: t })
      } else {
        return res
          .status(400)
          .send("Stock is out of movie id " + movie.id + ".")
      }

      const rental = await Rental.create(
        {
          customerId: req.body.customerId,
          movieId: req.body.movieId,
        },
        { transaction: t }
      )
      res.send(rental)
    })
  } catch (error) {
    res.status(500).send("Saving to database failed.")
  }
})

module.exports = router
