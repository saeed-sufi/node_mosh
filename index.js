const error = require('./middleware/error')
const debug = require('debug')('app:startup')
const express = require('express')
const config = require('config')
const morgan = require('morgan')
require('./dbConfig')
require('./models/index')
const helmet = require('helmet')

const app = express()

// console.log(app.get('env'))
// console.log("NODE_ENV: " + process.env.NODE_ENV)

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwrPrivateKey is not defined.')
  process.exit(1)
}
console.log('Application Name: ' + config.get('name'))

app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.json()) // req.body
app.use(express.urlencoded({ extended: true })) //key=value -> req.body
app.use(express.static('public'))
app.use(helmet())

if (app.get('env') === 'development') {
  app.use(morgan('tiny'))
  debug('Morgan enabled...')
}
require('./startup/routes')(app)
app.use(error)

// PORT
const port = process.env.PORT || 3000
app.listen(port, () => console.log('Listening on port ' + port))