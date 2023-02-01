const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {

    async details(stock, exchange) {
        const stock_exchange = stock + '.' + exchange
        const fullPath = 'https://finance.yahoo.com/quote/' + stock_exchange

        console.log(fullPath)
        return await new Promise((resolve, reject) => {
            axios.get(fullPath)
                .then(resp => {
                    const html = resp.data;
                    const $ = cheerio.load(html);
                    const current_value = parseFloat($('fin-streamer[data-test="qsp-price"]').attr('value'));
                    const dividend_yield = parseFloat($('td[data-test="DIVIDEND_AND_YIELD-value"]').text().replace(/\s*\([^\)]*\)/g, ''));
                    const prev_close_value = parseFloat($('td[data-test="PREV_CLOSE-value"]').text());

                    const current_open_difference = current_value - prev_close_value
                    const percent_change_value = ((current_open_difference * 100) / prev_close_value).toFixed(2)

                    const values = { stock, current_value, dividend_yield, prev_close_value, percent_change_value }
                    resolve(values);
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
}