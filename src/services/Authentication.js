const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { StatusCode } = require('status-code-enum')
const connection = require('../config/db_connection')
const Message = require('../enum/message')

dotenv.config()

const jwtKey = process.env.TOKEN_SECRET
const jwtExpirySeconds = 86400
const jwtRefreshExpirySeconds = jwtExpirySeconds * 7

module.exports = {

	generateAccessToken(email) {
		const accessToken = jwt.sign({ email }, jwtKey, {
			algorithm: 'HS256',
			expiresIn: jwtExpirySeconds,
		})

		const refreshToken = jwt.sign({ email }, jwtKey, {
			algorithm: 'HS256',
			expiresIn: jwtRefreshExpirySeconds,
		})

		const token_expires_in_date = new Date()
		token_expires_in_date.setSeconds(token_expires_in_date.getSeconds() + jwtExpirySeconds)
		const token_expires_in_str = token_expires_in_date.toISOString()

		const refresh_token_expires_in_date = new Date()
		refresh_token_expires_in_date.setSeconds(refresh_token_expires_in_date.getSeconds() + jwtExpirySeconds)
		const refresh_token_expires_in_str = refresh_token_expires_in_date.toISOString()

		return { accessToken, token_expires_in: token_expires_in_str, refreshToken, refresh_token_expires_in: refresh_token_expires_in_str }
	},

	async authenticateToken(req, res, next) {
		const authHeader = req.headers['authorization']
		const token = authHeader && authHeader.split(' ')[1]

		if (token == null) {
			return res.sendStatus(401)
		}

		try {
			const payload = jwt.verify(token, process.env.TOKEN_SECRET)
			const email = payload.email
			const login = await connection('login').where('email', email).first()
			if (login != undefined && login != null ){
				next()
			}else {
				return res.status(StatusCode.ClientErrorUnauthorized).json({ message: Message.Session.UserNotFound }).end()
			}
		} catch (error) {
			return res.status(StatusCode.ClientErrorUnauthorized).json({ message: Message.Session.ExpiredSession }).end()
		}
	},

	async discoverUser(req) {
		const authHeader = req.headers['authorization']
		const token = authHeader && authHeader.split(' ')[1]

		if (token == undefined) {
			return null
		}
       
		const payload = jwt.verify(token, process.env.TOKEN_SECRET)

		return payload.email
	}
}