require("dotenv").config()
const { Sequelize } = require("sequelize")

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
const sequelize = new Sequelize(connectionString, {
  logging: false,
  dialect: "postgres",
})

async function connectDb() {
  try {
    await sequelize.authenticate()
    console.log("DB connection has been established successfully.")
  } catch (error) {
    console.error("Database connection error:", error)
  }
}
connectDb()
// sequelize.sync({force: true})
module.exports = sequelize