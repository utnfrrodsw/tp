const express = require('express');

const userRouter = require ('./user.router');

const countryRouter = require ('./country.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/countries', countryRouter);
    router.use('/users', userRouter);

}

module.exports = routerApi;