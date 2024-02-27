const sequelize = require("../dbConfig")
const { MovieGenre } = require("./movieGenre")
const { Genre } = require("./genre")
const { Customer } = require("./customer")
const { Movie } = require("./movie")

Genre.belongsToMany(Movie, { through: MovieGenre })
Movie.belongsToMany(Genre, { through: MovieGenre })

module.exports = {
  MovieGenre,
  Movie,
  Genre,
  Customer,
}
