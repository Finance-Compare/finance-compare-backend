const express = require('express')
const router = express.Router()
const { celebrate, Segments, Joi } = require('celebrate')

const DetailsController = require('../controllers/DetailsController')
const InvestmentsController = require('../controllers/InvestmentsController')
const Authentication = require('../services/Authentication')

router.get(
	'/',
	Authentication.authenticateToken, 
	InvestmentsController.index
)

router.post(
	'/create',
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			stock: Joi.string().required(),
			exchange: Joi.string().required()
		})
	}),
	Authentication.authenticateToken, 
	InvestmentsController.create
)

router.delete(
	'/delete',
	celebrate({
		[Segments.QUERY]: Joi.object().keys({
			stock: Joi.string().required()
		})
	}),
	Authentication.authenticateToken,
	InvestmentsController.delete
)

router.post(
	'/details',
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			stocks: Joi.array().items(Joi.string()).required(),
			stock_exchange: Joi.string().required()
		})
	}),
	Authentication.authenticateToken,
	DetailsController.details
)

module.exports = router