const connection = require('../database/connection')


module.exports = {

	async addNewItemHistory(stock, email, amount, acquisition_price, acquisition_price_date) {
		await connection('wallet_history').insert({
			stock,
			email,
			amount,
			acquisition_price,
			acquisition_price_date
		})
	}
}