const { StatusCode } = require('status-code-enum')
const YahooStockDetails = require('../services/YahooStockDetails')

module.exports = {

	async details(request, response) {
		const { stocks, stock_exchange } = request.body

		var investments = new Array()

		await Promise.all(
			stocks.map(async item => {
				await YahooStockDetails.details(item, stock_exchange).then((quote)=> {
					investments.push(quote)
				})
			})
		)

		return response.status(StatusCode.SuccessOK).json( investments )
	},
}