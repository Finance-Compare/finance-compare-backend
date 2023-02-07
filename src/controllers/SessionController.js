const connection = require('../config/db_connection')
const { StatusCode } = require('status-code-enum')

const Authentication = require('../services/Authentication')
const User = require('../models/User')

const Message = require('../enum/message')

module.exports = {

	async index(request, response) {
		const email = Authentication.findTokenEmail(request)
		const isAdmin = await User.checkIfAdmin(email)

		if (!isAdmin) {
			return response.status(StatusCode.ClientErrorUnauthorized).json({ message: Message.Session.UserWithoutPermission })
		}

		const users = await User.allUsers()
		return response.status(StatusCode.SuccessOK).json(users)
	},

	async auth(request, response) {
		const { email, password } = request.body
		const login = await User.findByEmail(email)

		if (!login) {
			return response.status(StatusCode.ClientErrorNotFound).json({ message: Message.Session.UserNotFound })
		}

		if (password != login.password) {
			return response.status(StatusCode.ClientErrorUnauthorized).json({ message: Message.Session.InvalidPassword })
		}
		
		const token = Authentication.generateAccessToken(email)
		const user =  { id: login.id, name: login.name, email: login.email, permission: login.type }
		return response.json({user, token })
	},

	async create(request, response) {
		const { name, email, password, type } = request.body
		const isExists = await User.checkIfExists(email)

		if (isExists) {
			return response.status(StatusCode.ClientErrorUnauthorized).json({ message: Message.Session.UserIsAlreadyRegistered })
		}

		const user = await User.addNewUser(name, email, password, type)

		return response.json({ user, message: Message.Session.UserCreatedSuccessfully })
	},

	async delete(request, response) {
        
		const email = await Authentication.discoverUser(request, response)
		const login = await connection('login')
			.where('email', email)
			.first()

		if (login != undefined) {
			await connection('login').where('email', email).del()
			return response.status(StatusCode.SuccessOK).json({ message: Message.General.DeletedSuccessfully })
		} else {
			return response.status(StatusCode.ClientErrorNotFound).json({ message: Message.Session.NoUserFoundWithEmail + email })
		}
	},

	async info_user(request, response) {
		const email = await Authentication.discoverUser(request, response)
		return response.status(StatusCode.SuccessOK).json({ email })
	},
}