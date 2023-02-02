const connection = require('../database/connection')
const { StatusCode } = require('status-code-enum')
const Authentication = require('../services/Authentication')

module.exports = {

	async index(request, response) {

		const email = await Authentication.discoverUser(request, response)
		const investments = await connection('investments').where('email', email)

		if (investments.length > 0) {
			return response.status(StatusCode.SuccessOK).json(investments)
		} else {
			return response.status(StatusCode.SuccessOK).json({ message: 'Nenhum investimento cadastrado', email: email })
		}
	},

	async delete(request, response) {

		const email = await Authentication.discoverUser(request, response)
		const stock = request.query.stock

		const investment = await connection('investments')
			.where('email', email)
			.andWhere('stock', stock)
			.first()

		if (investment != undefined) {
			await connection('investments')
				.where('email', email)
				.andWhere('stock', stock)
				.del()
			return response.status(StatusCode.SuccessOK).json({ message: 'Deletado com sucesso' })
		} else {
			return response.status(StatusCode.ClientErrorNotFound).json({ message: 'Nenhum investimento encontrado' })
		}
	},

	async create(request, response) {
		const { stock } = request.body
        
		const email = await Authentication.discoverUser(request, response)
		const login = await connection('login').where('email', email).first()

		const investment = await connection('investments').where('stock', stock).first()

		if (investment == undefined) {

			if (login != undefined) {

				await connection('investments').insert({
					stock,
					email
				})

				return response.status(StatusCode.SuccessOK).json({ email, message: 'Investimento cadastrado com sucesso' })
			} else {
				return response.status(StatusCode.ClientErrorUnauthorized).json({ message: 'Usuário não cadastrado' })
			}
		} else {
			return response.status(StatusCode.ClientErrorUnauthorized).json({ message: 'Investimento já cadastrado' })

		}
	}
}