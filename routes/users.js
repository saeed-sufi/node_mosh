const auth = require("../middleware/auth")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const express = require("express")
const router = express.Router()
const { User, validate } = require("../models/user")

router.get("/me", auth, async (req, res) => {
  const user = await User.findOne({
    where: { id: req.user.id },
  })
  res.send(_.pick(user, ["id", "name", "email"]))
})

router.post("/", async (req, res) => {
  const { value, error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const email = await User.findOne({
    where: _.pick(value, "email"),
  })
  if (email) return res.status(400).send("The email is already registered.")

  value.password = await bcrypt.hash(value.password, 10)
  const user = await User.create(_.pick(value, ["name", "email", "password", "isAdmin"]))
  const token = User.generateAuthToken(user.dataValues.id, user.dataValues.isAdmin)
  res.header("x-auth-token", token).send(_.pick(user, ["id", "name", "email", "isAdmin"]))
})

module.exports = router
