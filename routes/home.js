const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  res.render('index', { title: "Hola", message: "Hi Everybody!" })
})

module.exports = router