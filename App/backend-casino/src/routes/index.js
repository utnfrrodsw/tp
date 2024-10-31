const express = require('express');

const userRouter = require ('./user.router');
const countryRouter = require ('./country.router');
const categoryRouter = require ('./category.router');
const gameRouter = require ('./game.router');
const userGamesRouter = require ('./usergames.router');

const loginRouter = require ('./login.router');

const authRouter = require ('./auth.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/countries', countryRouter);
    router.use('/users', userRouter);
    router.use('/categories', categoryRouter);
    router.use('/games', gameRouter);
    router.use('/userGames', userGamesRouter);
    router.use('/login', loginRouter);
    router.use('/register', authRouter);
}

module.exports = routerApi;