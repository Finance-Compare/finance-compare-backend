const express = require('express')
const cors = require('cors')
const { errors } = require('celebrate')
const routes = require('../routes/routes')
const morgan = require('morgan')

const app = express()

app.use(morgan('combined'))
app.use(cors())
app.use(express.json())
app.use(routes)
app.use(errors())

module.exports = app