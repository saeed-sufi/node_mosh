const auth = require("../middleware/auth")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const express = require("express")
const router = express.Router()
const { User, validate } = require("../models/user")

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *        - isAdmin
 *      properties:
 *        name:
 *          type: string
 *          description: the user name
 *        email:
 *          type: string
 *          description: The user email address
 *        password:
 *          type: string
 *          description: The user password
 *        isAdmin:
 *          type: boolean
 *          description: Whether the use is an admin or not
 */

router.get("/me", auth, async (req, res) => {
  const user = await User.findOne({
    where: { id: req.user.id },
  })
  res.send(_.pick(user, ["id", "name", "email"]))
})

/**
 * @swagger
 * /api/users:
 *  post:
 *    summary: Registers a new user
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: The user is successfully registered.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 */

router.post("/", async (req, res) => {
  const { value, error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const email = await User.findOne({
    where: _.pick(value, "email"),
  })
  if (email) return res.status(400).send("The email is already registered.")

  value.password = await bcrypt.hash(value.password, 10)
  const user = await User.create(
    _.pick(value, ["name", "email", "password", "isAdmin"])
  )
  const token = User.generateAuthToken(
    user.dataValues.id,
    user.dataValues.isAdmin
  )
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["id", "name", "email", "isAdmin"]))
})

module.exports = router
