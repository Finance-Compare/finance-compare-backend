const connection = require('../database/connection')
const { StatusCode } = require('status-code-enum')
const Authentication = require('../services/Authentication')
const WalletHistory = require('../services/WalletHistory')

module.exports = {

	async create(request, response) {
		const { stock, amount, price, acquisition_price_date } = request.body

		const email = await Authentication.discoverUser(request, response)
		const login = await connection('login').where('email', email).first()

		const investment = await connection('wallet')
			.where('stock', stock)
			.andWhere('email', email)
			.first()

		const date = new Date()
		const last_update = date.toISOString()

		if (login == undefined) {
			return response.status(StatusCode.ClientErrorBadRequest).json({ message: 'Usuário não cadastrado' })
		}

		if (investment == undefined) {

			await connection('wallet').insert({
				stock,
				email,
				amount,
				last_update
			})

			await WalletHistory.addNewItemHistory(stock, email, amount, price, acquisition_price_date)
			return response.status(StatusCode.SuccessOK).json(stock)
		} else {

			await connection('wallet')
				.update({
					amount: investment.amount + amount,
					last_update: last_update
				})
				.where('stock', stock)
				.andWhere('email', email)

			await WalletHistory.addNewItemHistory(stock, email, amount, price, acquisition_price_date)
			return response.status(StatusCode.SuccessOK).json({ message: 'Atualizado', stock })
		}
	},

	async history(request, response) {

		const email = await Authentication.discoverUser(request)
		const investments = await connection('wallet_history').where('email', email)

		if (investments.length > 0) {
			return response.status(StatusCode.SuccessOK).json(investments)
		} else {
			return response.status(StatusCode.SuccessOK).json({ message: 'O usuário ' + email + ' não tem ativos cadastrados' })
		}
	},

	async index(request, response) {

		const email = await Authentication.discoverUser(request)
		const investments = await connection('wallet').where('email', email)

		if (investments.length > 0) {
			return response.status(StatusCode.SuccessOK).json(investments)
		} else {
			return response.status(StatusCode.SuccessOK).json({ message: 'O usuário ' + email + ' não tem ativos cadastrados' })
		}
	},
}