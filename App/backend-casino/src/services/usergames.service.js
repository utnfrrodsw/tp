const { QueryTypes } = require('sequelize');
const { models } = require('../libs/sequelize');

class UsersGamesService{
    constructor(){

    }

    async find(){
        const res = await models.UserGame.findAll()
        return res;
    }

    async create(data){
        const res = await models.UserGame.create(data)
        return res;
    }

    async query1(){
        const res = await models.UserGame.sequelize.query('select * from usergames', {
            type: QueryTypes.SELECT
        })
        return res;
    }
}

module.exports = UsersGamesService;
