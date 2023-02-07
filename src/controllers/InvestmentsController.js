const connection = require('../config/db_connection')
const { StatusCode } = require('status-code-enum')

const Authentication = require('../services/Authentication')
const YahooStockDetails = require('../services/YahooStockDetails')
const Message = require('../enum/message')

module.exports = {

	async create(request, response) {
		const { stock, exchange} = request.body
		const email = await Authentication.discoverUser(request, response)

		try {
			const stock_details = await YahooStockDetails.details(stock, exchange)
			const investment = await connection('investments')
				.where('stock', stock)
				.andWhere('email', email)
				.first()
	
			if (investment != undefined || investment != null) {
				return response.status(StatusCode.ClientErrorUnprocessableEntity).json({ message: Message.Investiment.ActiveAlreadyRegistered })
			}else {
				await connection('investments').insert({ stock ,email })
				return response.status(StatusCode.SuccessOK).json({ stock_details, message: Message.Investiment.StockAddedSuccessfully })
			}
		} catch {
			return response.status(StatusCode.ClientErrorUnprocessableEntity).json({ message: Message.Investiment.StockNotFound })
		}
	},

	async delete(request, response) {
		const email = await Authentication.discoverUser(request, response)
		const stock = request.query.stock

		const investment = await connection('investments')
			.where('email', email)
			.andWhere('stock', stock)
			.first()

		if (investment != undefined || investment != null) {
			await connection('investments')
				.where('email', email)
				.andWhere('stock', stock)
				.del()
			return response.status(StatusCode.SuccessOK).json({ message: Message.General.DeletedSuccessfully })
		} else {
			return response.status(StatusCode.ClientErrorNotFound).json({ message: 'Nenhum ativo encontrado' })
		}
	},

	async index(request, response) {
		const email = await Authentication.discoverUser(request, response)
		const investments = await connection('investments').where('email', email)

		if (investments.length > 0) {
			return response.status(StatusCode.SuccessOK).json(investments)
		} else {
			return response.status(StatusCode.SuccessOK).json({ message: 'Nenhum ativo cadastrado', email: email })
		}
	},

	async reset(request, response) {
		const email = await Authentication.discoverUser(request, response)
		const investments = await connection('investments').where('email', email)

		await Promise.all(
			investments.map(async item => {
				await connection('investments')
					.where('email', email)
					.andWhere('stock', item.stock)
					.del()
			})
		)

		return response.status(StatusCode.SuccessOK).json({message: 'Simulação reiniciada com sucesso' })
	},
}