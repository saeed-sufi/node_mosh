const auth  = require("../middleware/auth")
const admin = require("../middleware/admin")
const express = require('express')
const router = express.Router()
const { Genre, validate } = require('../models/genre')

router.get('/', async (req, res) => {
  const genres = await Genre.findAll({
    order: [['name', 'DESC']],
    attributes: ['id', 'name']
  })
  res.send(genres)
})

router.get('/:id', async (req, res) => {

  let genre = await Genre.findOne({
    where: { id: req.params.id }
  })

  if (!genre) return res.status(400).send('The genre with the given ID does not exist.')

  res.send(genre)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const genre = await Genre.create({ name: req.body.name })
  res.send(genre)
})

router.put("/:id", auth, async (req, res) => {
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

router.delete("/:id", [auth, admin], async (req, res) => {
  let genre = await Genre.findOne({ where: { id: req.params.id } })

  if (!genre)
    return res.status(400).send("The genre with the given ID does not exist.")

  await Genre.destroy({ where: { id: req.params.id } })

  res.send(genre)
})



module.exports = router