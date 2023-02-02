const express = require('express')
const router = express.Router()

const WalletController = require('../controllers/WalletController')
const Authentication = require('../services/Authentication')

router.get(
	'/',
	Authentication.authenticateToken, 
	WalletController.index
)

router.post(
	'/create',
	Authentication.authenticateToken, 
	WalletController.create
)

router.get(
	'/history',
	Authentication.authenticateToken, 
	WalletController.history
)

module.exports = router