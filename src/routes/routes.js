const express = require('express')
const router = express.Router()

const session_routes = require('./session_routes')
const investments_routes = require('./investments_routes')
const wallet_routes = require('./wallet_routes')

router.use('/session', session_routes)
router.use('/investments', investments_routes)
router.use('/wallet', wallet_routes)

module.exports = router