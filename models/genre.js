const Joi = require('joi')
const sequelize = require('../dbConfig')
const { DataTypes } = require('sequelize')

const Genre = sequelize.define('Genre', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isTooLong(value) {
        if (value.length > 60) {
          throw new Error('The provided name is too long.')
        }
      }
    }
  }
}, {
  tableName: "genres"
});

async function syncGenre() {
  await Genre.sync();
};

syncGenre()

function validateGenre(genre) {

  const schema = Joi.object({
    name: Joi.string().min(3).lowercase().required()
  })

  return schema.validate(genre)
}

module.exports.validate = validateGenre
module.exports.Genre = Genre