const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const express = require("express")
const router = express.Router()
const { Genre, validate } = require("../models/genre")

/**
 * @swagger
 * components:
 *  schemas:
 *    Genre:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          description: the genre name
 */

/**
 * @swagger
 * components:
 *  parameters:
 *    - in: path
 *      name: id
 *      schema:
 *        type: string
 *      required: true
 *      description: The genre id
 */

/**
 * @swagger
 * /api/genres:
 *  get:
 *    summary: Get all the genres.
 *    tags: [Genres]
 *    responses:
 *      200:
 *        description: Returns all the genres
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Genre'
 */

router.get("/", async (req, res, next) => {
  try {
    const genres = await Genre.findAll({
      order: [["name", "DESC"]],
      attributes: ["id", "name"],
    })
    res.send(genres)
  } catch (ex) {
    next(ex)
  }
})

/**
 * @swagger
 * /api/genres/{id}:
 *  get:
 *    summary: Get the genre by id
 *    tags: [Genres]
 *    $ref: '#/components/parameters'
 *    responses:
 *      200:
 *        description: The genre description by id
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Genre'
 *      404:
 *        description: The genre with the given id was not found.
 */
router.get("/:id", async (req, res) => {
  let genre = await Genre.findOne({
    where: { id: req.params.id },
  })

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.")
  res.send(genre)
})

/**
 * @swagger
 * /api/genres:
 *  post:
 *    summary: Create a new genre
 *    tags: [Genres]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Genre'
 *    responses:
 *      200:
 *        description: The genre was successfully created.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Genre'
 *      500:
 *        description: 'Server error'
 */
router.post("/",  async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const genre = await Genre.create({ name: req.body.name })
  res.send(genre)
})

/**
 * @swagger
 *  /api/genres/{id}:
 *    put:
 *      summary: Update the genre by the id
 *      tags: [Genres]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The genre id
 *      requestBody:
 *        required: true
 *        content: 
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Genre'
 *      responses:
 *        200:
 *          description: The genre was updated.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Genre'
 *        404:
 *          description: The genre with the given ID does not exist.
 *        500:
 *          description: Horrible server error
 */
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body)
  if (error) {
    // 400 Bad Request
    return res.status(400).send(error.details[0].message)
  }

  let genre = await Genre.findOne({
    where: { id: req.params.id },
  })

  if (!genre)
    return res.status(400).send("The genre with the given ID does not exist.")

  genre = await Genre.update(
    { name: req.body.name },
    {
      where: { id: req.params.id },
      returning: true,
    }
  )
  res.send(genre)
})

/**
 * @swagger
 *  /api/genres/{id}:
 *    delete:
 *      summary: Remove the genre by the id
 *      tags: [Genres]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The genre id
 *      responses:
 *        200:
 *          description: The genre was deleted.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Genre'
 *        400:
 *          description: The genre with the given ID does not exist
 */

router.delete("/:id", [auth, admin], async (req, res) => {
  let genre = await Genre.findOne({ where: { id: req.params.id } })

  if (!genre)
    return res.status(404).send("The genre with the given ID does not exist.")

  await Genre.destroy({ where: { id: req.params.id } })

  res.send(genre)
})

module.exports = router
