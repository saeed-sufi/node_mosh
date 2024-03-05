const Joi = require("joi")
const sequelize = require("../dbConfig")
const { DataTypes } = require("sequelize")
const { Customer } = require("./customer")
const { Movie } = require("./movie")

const Rental = sequelize.define(
  "Rental",
  {
    customerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    movieId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOut: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_DATE"),
    },
    dateReturned: {
      type: DataTypes.DATE,
    },
    rentalFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        len: [0, 1000],
      },
    },
  },
  {
    tableName: "rentals",
  }
)

Rental.associate = (models) => {
  Rental.belongsTo(models.Customer, {
    foreignKey: Customer.primaryKeyAttribute,
    onDelete: "NO ACTION",
  })

  Rental.belongsTo(models.Movie, {
    foreignKey: Movie.primaryKeyAttribute,
    onDelete: "NO ACTION",
  })
}

async function syncRental() {
  await Rental.sync()
}

syncRental()

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  })

  return schema.validate(rental)
}

module.exports.validate = validateRental
module.exports.Rental = Rental
