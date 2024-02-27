const Joi = require("joi")
const sequelize = require("../dbConfig")
const { DataTypes } = require("sequelize")

const Movie = sequelize.define(
  "Movie",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dailyRentalRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    numberInStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "movies",
  }
)

async function syncMovie() {
  await Movie.sync()
}

syncMovie()

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    dailyRentalRate: Joi.number().positive().precision(2).required(),
    numberInStock: Joi.number().integer().positive().required(),
    genres: Joi.array()
      .items(Joi.string().min(3).lowercase())
      .unique()
      .required(),
  })

  return schema.validate(movie)
}

module.exports.validate = validateMovie
module.exports.Movie = Movie
