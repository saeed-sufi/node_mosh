const Joi = require("joi")
const sequelize = require("../dbConfig")
const { DataTypes } = require("sequelize")

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
  }
)

async function syncUser() {
  await User.sync()
}

syncUser()

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).lowercase().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
  })

  return schema.validate(user)
}

module.exports.validate = validateUser
module.exports.User = User
