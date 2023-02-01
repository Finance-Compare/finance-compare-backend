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
                    const title = $('title').text();
                    const value = $('fin-streamer[data-test="qsp-price"]').attr('value');
                    const dividend_yield = $('td[data-test="DIVIDEND_AND_YIELD-value"]').text().replace(/\s*\([^\)]*\)/g, '');
                    const values = { stock, title, value, dividend_yield }
                    resolve(values);
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
}