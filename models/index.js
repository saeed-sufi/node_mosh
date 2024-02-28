const { MovieGenre } = require("./movieGenre")
const { Genre } = require("./genre")
const { Customer } = require("./customer")
const { Movie } = require("./movie")
const { Rental } = require("./rental")
const { Users } = require("./user")

Genre.belongsToMany(Movie, { through: MovieGenre })
Movie.belongsToMany(Genre, { through: MovieGenre })

module.exports = {
  MovieGenre,
  Genre,
  Customer,
  Rental,
  Movie,
  Users
}
