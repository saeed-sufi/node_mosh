const { DataTypes } = require("sequelize")
const sequelize = require("../dbConfig")

const MovieGenre = sequelize.define(
  "MovieGenre",
  {
    GenreId: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    MovieId: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
  },
  {
    tableName: "movie_genre",
  }
)

async function syncMovieGenre() {
  await MovieGenre.sync()
}

syncMovieGenre()

module.exports.MovieGenre = MovieGenre
