const express = require('express')
const router = express.Router()
const { Customer, validate } = require('../models/customer')

router.get('/', async (req, res) => {
  const customers = await Customer.findAll({
    order: [['name', 'DESC']],
    attributes: ['id', 'name', 'isGold', 'phone']
  })
  res.send(customers)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const customer = await Customer.create({ name: req.body.name, isGold: req.body.isGold, phone: req.body.phone })
  res.send(customer)
})


module.exports = router