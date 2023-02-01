const connection = require('../database/connection');
const { StatusCode } = require('status-code-enum')
const Authentication = require('../services/Authentication')

module.exports = {
    async auth(request, response) {
        const {email, password } = request.body;

        const login = await connection('login').where('email', email).first();
        
        if (!login) {
            return response.status(StatusCode.ClientErrorNotFound).json({error : 'Usuário não encontrado'});
        }
        if (password == password) {
            const token = Authentication.generateAccessToken(email);
            return response.json({user: login, token});
        } else {
            return response.status(StatusCode.ClientErrorUnauthorized).json({error : 'Senha inválida'});
        }
    },

    async create(request, response) {
        const {name, email, password, type} = request.body;
        
        const login = await connection('login').where('email', email).select('email').first();
        
        if (!login) {
            await connection('login').insert({
                name, 
                email,
                password, 
                type
            });
            return response.json({name: name, email: email, type: type, message: 'Usuário criado com sucesso'});
        } else {
            return response.status(StatusCode.ClientErrorUnauthorized).json({error : 'Usuário já cadastrado'});
        }
    }
};