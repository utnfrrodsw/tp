const express = require('express');

const userRouter = require ('./user.router');
const countryRouter = require ('./country.router');
const stateRouter = require ('./state.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/countries', countryRouter);
    router.use('/users', userRouter);
    router.use('/states', stateRouter);
}

module.exports = routerApi;