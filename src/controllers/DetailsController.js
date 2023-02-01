const { StatusCode } = require('status-code-enum');
const StockDetails = require('../services/StockDetails');

module.exports = {

    async details(request, response) {
        const { stocks, stock_exchange } = request.body

        var investments = new Array();

        await Promise.all(
            stocks.map(async item => {
                const investment = await StockDetails.details(item, stock_exchange)
                investments.push(investment);
            })
        );

        return response.status(StatusCode.SuccessOK).json( investments );
    },
};