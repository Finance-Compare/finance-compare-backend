const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { StatusCode } = require('status-code-enum')

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

	authenticateToken(req, res, next) {
		const authHeader = req.headers['authorization']
		const token = authHeader && authHeader.split(' ')[1]

		if (token == null) {
			return res.sendStatus(401)
		}

		try {
			jwt.verify(token, process.env.TOKEN_SECRET)
			next()
		} catch (e) {
			if (e instanceof jwt.JsonWebTokenError) {
				return res.status(StatusCode.ClientErrorUnauthorized).end()
			}
			return res.status(StatusCode.ClientErrorBadRequest).end()
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