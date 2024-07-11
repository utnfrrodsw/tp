const express = require('express');

const userRouter = require ('./user.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/users', userRouter);
}

module.exports = routerApi;