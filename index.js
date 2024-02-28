const debug = require('debug')('app:startup')
const express = require('express')
const config = require('config')
const morgan = require('morgan')
const logger = require('./middleware/logger')
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const auth = require('./routes/auth')
const home = require('./routes/home')
require('./dbConfig')
require('./models/index')
const helmet = require('helmet')

const app = express()

// console.log(app.get('env'))
// console.log("NODE_ENV: " + process.env.NODE_ENV)

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
app.use(logger)
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/', home)

// PORT
const port = process.env.PORT || 3000
app.listen(port, () => console.log('Listening on port ' + port))