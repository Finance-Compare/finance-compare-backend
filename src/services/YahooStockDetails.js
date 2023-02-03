const yahooFinance = require('yahoo-finance')

module.exports = {

	async details(stock, exchange) {
		const stock_exchange = stock + '.' + exchange

		return new Promise((resolve, reject) => {
			yahooFinance.quote(
				{symbol: stock_exchange}, 
				(err, quote) => {
					if (err) {
						reject(err)
						return
					}
					const values = this.processStockQuote(quote)
					resolve(values)
				}
			)
		})
	},

	processStockQuote(quote) {
		const { summaryDetail, price }  = quote
		const { dividendRate, dividendYield , regularMarketPreviousClose} = summaryDetail
		const { regularMarketPrice, symbol , longName} = price
        
		const percentChange =  this.calculatePercentChangeValue(regularMarketPrice, regularMarketPreviousClose)

		const values = { 
			stock: symbol, 
			name: longName, 
			current_value: regularMarketPrice, 
			previous_close: regularMarketPreviousClose,
			dividendRate,
			dividendYield,
			percentChange
		}

		return values
	},

	calculatePercentChangeValue(current_value, previous_value) {
		const current_open_difference = current_value - previous_value
		const result = ((current_open_difference * 100) / previous_value).toFixed(2)
		return parseFloat(result)
	}
}