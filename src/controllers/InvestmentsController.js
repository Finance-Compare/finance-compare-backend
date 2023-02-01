const connection = require('../database/connection');
const { StatusCode } = require('status-code-enum')


module.exports = {

    async index(request, response) {

        const user_email = request.query.user_email
        const investments = await connection('user_investments').where('user_email', user_email)

        if (investments.length > 0) {
            return response.status(StatusCode.SuccessOK).json(investments);
        } else {
            return response.status(StatusCode.SuccessOK).json({ message: "Nenhum investimento cadastrado", email: user_email });
        }
    },

    async delete(request, response) {

        const user_email = request.query.user_email
        const stock = request.query.stock

        const investment = await connection('user_investments')
            .where('user_email', user_email)
            .andWhere('stock', stock)
            .first();

        if (investment != undefined) {
            const investment = await connection('user_investments')
                .where('user_email', user_email)
                .andWhere('stock', stock)
                .del();
            return response.status(StatusCode.SuccessOK).json({ message: "Deletado com sucesso" });
        } else {
            return response.status(StatusCode.ClientErrorNotFound).json({ message: "Nenhum investimento encontrado" });
        }
    },

    async create(request, response) {
        const { user_email, stock } = request.body;

        const login = await connection('login').where('email', user_email).first();

        const investment = await connection('user_investments').where('stock', stock).first();

        if (investment == undefined) {

            if (login != undefined) {

                await connection('user_investments').insert({
                    stock,
                    user_email
                });

                return response.status(StatusCode.SuccessOK).json({ user_email, message: "Investimento cadastrado com sucesso" });
            } else {
                return response.status(StatusCode.ClientErrorUnauthorized).json({ message: "Usuário não cadastrado" });
            }
        } else {
            return response.status(StatusCode.ClientErrorUnauthorized).json({ message: "Investimento já cadastrado" });

        }
    }
};