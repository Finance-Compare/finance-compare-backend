const connection = require('../config/db_connection')
const { StatusCode } = require('status-code-enum')

const Authentication = require('../services/Authentication')
const Message = require('../enum/message')

module.exports = {

	async index(request, response) {

		const email = await Authentication.discoverUser(request, response)
		
		const login = await connection('login')
			.where('email', email)
			.first()

		if (login.type == 'customer')  {
			return response.status(StatusCode.ClientErrorUnauthorized).json({ message: Message.Session.UserWithoutPermission })
		}

		const logins = await connection('login').select('*')

		if (logins != null) {
			return response.status(StatusCode.ClientErrorNotFound).json(logins)
		} else {
			return response.status(StatusCode.ClientErrorNotFound).json({ message: Message.Session.NoUserRegistered })
		}
	},

	async auth(request, response) {
		const { email, password } = request.body

		const login = await connection('login')
			.where('email', email)
			.first()

		if (!login) {
			return response.status(StatusCode.ClientErrorNotFound).json({ message: Message.Session.UserNotFound })
		}
		if (password == login.password) {
			const token = Authentication.generateAccessToken(email)
			const user =  { id: login.id, name: login.name, email: login.email, permission: login.type }
			return response.json({user, token })
		} else {
			return response.status(StatusCode.ClientErrorUnauthorized).json({ message: Message.Session.InvalidPassword })
		}
	},

	async create(request, response) {
		const { name, email, password } = request.body

		var type = request.body.type

		if (request.body.type == null) {
			type = 'customer'
		}

		const login = await connection('login')
			.where('email', email)
			.first()

		if (!login) {
			await connection('login').insert({
				name,
				email,
				password,
				type
			})
			return response.json({ name, email, permission: type, message: Message.Session.UserCreatedSuccessfully })
		} else {
			return response.status(StatusCode.ClientErrorUnauthorized).json({ message: Message.Session.UserIsAlreadyRegistered })
		}
	},

	async delete(request, response) {
        
		const email = await Authentication.discoverUser(request, response)
		const login = await connection('login')
			.where('email', email)
			.first()

		if (login != undefined) {
			await connection('login').where('email', email).del()
			return response.status(StatusCode.SuccessOK).json({ message: Message.Session.UserDeletedSuccessfully })
		} else {
			return response.status(StatusCode.ClientErrorNotFound).json({ message: Message.Session.NoUserFoundWithEmail + email })
		}
	},

	async info_user(request, response) {
		const email = await Authentication.discoverUser(request, response)
		return response.status(StatusCode.SuccessOK).json({ email })
	},
}