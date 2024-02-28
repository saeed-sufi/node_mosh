const bcrypt= require("bcrypt")
const express = require("express")
const Joi = require("joi")
const _ = require("lodash")
const router = express.Router()
const { User } = require("../models/user")

router.post("/", async (req, res) => {
    const { value, error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({
      where: _.pick(value, "email"),
    })
    if (!user) return res.status(400).send("Invalid email or password.")

    const isValidPassword = await bcrypt.compare(value.password, user.password)
    if (!isValidPassword) res.status(400).send("Invalid email or password.")

    res.send(true)
  
})

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
  })

  return schema.validate(user)
}

module.exports = router
