const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const SessionController = require('./controllers/SessionController');
const InvestmentsController = require('./controllers/InvestmentsController');
const DetailsController = require('./controllers/DetailsController');

const Authentication = require('./services/Authentication');

const routes = express.Router();

routes.post(
    '/session/auth',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().required(),
            password: Joi.string().required()
        })
    }),
    SessionController.auth
);

routes.post(
    '/session/create',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            type: Joi.string().required()
        })
    }),
    SessionController.create
);

routes.get(
    '/investments',
    celebrate({
        [Segments.QUERY]: Joi.object().keys({
            user_email: Joi.string().required()
        })
    }),
    Authentication.authenticateToken, 
    InvestmentsController.index
);

routes.post(
    '/investment/create',
    Authentication.authenticateToken, 
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            user_email: Joi.string().required(),
            stock: Joi.string().required()
        })
    }),
    InvestmentsController.create
);

routes.delete(
    '/investment/delete',
    Authentication.authenticateToken,
    celebrate({
        [Segments.QUERY]: Joi.object().keys({
            user_email: Joi.string().required(),
            stock: Joi.string().required()
        })
    }),
    InvestmentsController.delete
);

routes.post(
    '/investment/details',
    Authentication.authenticateToken,
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            stocks: Joi.array().items(Joi.string()).required(),
            stock_exchange: Joi.string().required()
        })
    }),
    DetailsController.details
);

module.exports = routes;