const express = require('express');

const userRouter = require ('./user.router');
const countryRouter = require ('./country.router');
const stateRouter = require ('./state.router');
const locationRouter = require ('./location.router');
const categoryRouter = require ('./category.router');
const gameRouter = require ('./game.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/countries', countryRouter);
    router.use('/users', userRouter);
    router.use('/states', stateRouter);
    router.use('/locations', locationRouter);
    router.use('/categories', categoryRouter);
    router.use('/games', gameRouter);
}

module.exports = routerApi;