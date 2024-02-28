const bcrypt = require("bcrypt")
const _ = require("lodash")
const express = require("express")
const router = express.Router()
const { User, validate } = require("../models/user")

router.get("/", async (req, res) => {
  const users = await User.findAll({
    order: [["name", "DESC"]],
    attributes: ["id", "name", "email"],
  })
  res.send(users)
})

router.post("/", async (req, res) => {
  const { value, error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const email = await User.findOne({
    where: _.pick(value, "email"),
  })
  if (email) return res.status(400).send("The email is already registered.")

  value.password = await bcrypt.hash(value.password, 10)
  const user = await User.create(_.pick(value, ["name", "email", "password"]))

  res.send(_.pick(user, ["id", "name", "email"]))
})


module.exports = router
