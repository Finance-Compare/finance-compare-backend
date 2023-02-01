const axios = require('axios');
const cheerio = require('cheerio');
const { StatusCode } = require('status-code-enum');

module.exports = {

    async details(stock, exchange) {
        try {
            const stock_exchange = stock + '.' + exchange
            const url = 'https://finance.yahoo.com/quote/' + stock_exchange

            let result = await axios({url: url})

            if (result.status == StatusCode.SuccessOK) {
                let values = this.processResponseHTML(result.data, stock)
                return values
            } else {
                return nil
            }
        }
        catch (error) {
            return error
        }
    },

    processResponseHTML(html, stock) {
        const $ = cheerio.load(html);
        const current_value = parseFloat($('fin-streamer[data-test="qsp-price"]').attr('value'));
        const dividend_yield = parseFloat($('td[data-test="DIVIDEND_AND_YIELD-value"]').text().replace(/\s*\([^\)]*\)/g, ''));
        const prev_close_value = parseFloat($('td[data-test="PREV_CLOSE-value"]').text());
        const percent_change_value = this.calculatePercentChangeValue(current_value, prev_close_value)

        return { stock, current_value, dividend_yield, prev_close_value, percent_change_value }
    }, 

    calculatePercentChangeValue(current_value, previous_value) {
        const current_open_difference = current_value - previous_value
        return ((current_open_difference * 100) / previous_value).toFixed(2)
    }
}