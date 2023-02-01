const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const jwtKey = process.env.TOKEN_SECRET
const jwtExpirySeconds = 1800
const jwtRefreshExpirySeconds = 3600

module.exports = {

    generateAccessToken(email) {
        const token = jwt.sign({ email }, jwtKey, {
            algorithm: "HS256",
            expiresIn: jwtExpirySeconds,
        })

        const refreshToken = jwt.sign({ email }, jwtKey, {
            algorithm: "HS256",
            expiresIn: jwtRefreshExpirySeconds,
        })

        return { accessToken: token, refreshToken, expiresIn: jwtExpirySeconds }
    },

    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) {
            return res.sendStatus(401);
        }

        var payload
        try {
            payload = jwt.verify(token, process.env.TOKEN_SECRET)
            next()
        } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                return res.status(401).end()
            }
            return res.status(400).end()
        }
    }
}