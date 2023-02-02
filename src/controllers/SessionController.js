const connection = require('../database/connection')
const { StatusCode } = require('status-code-enum')
const Authentication = require('../services/Authentication')

const Message = require('../enum/message')

module.exports = {

	async index(request, response) {
		const logins = await connection('login').select('*')

		if (logins != null) {
			return response.status(StatusCode.ClientErrorNotFound).json(logins)
		} else {
			return response.status(StatusCode.ClientErrorNotFound).json({ message: Message.Session.NoUserRegistered })
		}
	},

	async auth(request, response) {
		const { email, password } = request.body

		const login = await connection('login').where('email', email).first()

		if (!login) {
			return response.status(StatusCode.ClientErrorNotFound).json({ message: Message.Session.UserNotFound })
		}
		if (password == password) {
			const token = Authentication.generateAccessToken(email)
			return response.json({ user: login, token })
		} else {
			return response.status(StatusCode.ClientErrorUnauthorized).json({ message: Message.Session.InvalidPassword })
		}
	},

	async create(request, response) {
		const { name, email, password, type } = request.body

		const login = await connection('login').where('email', email).select('email').first()

		if (!login) {
			await connection('login').insert({
				name,
				email,
				password,
				type
			})
			return response.json({ name: name, email: email, type: type, message: 'Usuário criado com sucesso' })
		} else {
			return response.status(StatusCode.ClientErrorUnauthorized).json({ error: 'Usuário já cadastrado' })
		}
	},

	async delete(request, response) {
        
		const email = await Authentication.discoverUser(request, response)
		const login = await connection('login').where('email', email).first()

		if (login != undefined) {
			await connection('login').where('email', email).del()
			return response.status(StatusCode.SuccessOK).json({ message: 'Deletado com sucesso' })
		} else {
			return response.status(StatusCode.ClientErrorNotFound).json({ message: 'Nenhum usuário encontrado com o e-mail: ' + email })
		}
	},

	async info_user(request, response) {
		const email = await Authentication.discoverUser(request, response)
		return response.status(StatusCode.SuccessOK).json({ email })
	},
}