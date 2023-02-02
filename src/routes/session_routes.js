const express = require('express')
const router = express.Router()
const { celebrate, Segments, Joi } = require('celebrate')

const SessionController = require('../controllers/SessionController')
const Authentication = require('../services/Authentication')

router.post(
	'/auth',
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			email: Joi.string().required(),
			password: Joi.string().required()
		})
	}),
	SessionController.auth
)

router.post(
	'/create',
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			name: Joi.string().required(),
			email: Joi.string().required(),
			password: Joi.string().required(),
			type: Joi.string().required()
		})
	}),
	SessionController.create
)

router.delete(
	'/delete',
	Authentication.authenticateToken,
	SessionController.delete
)

router.get(
	'/all',
	SessionController.index
)

router.get(
	'/info_user',
	Authentication.authenticateToken,
	SessionController.info_user
)

module.exports = router