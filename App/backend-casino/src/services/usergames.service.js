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
}

module.exports = UsersGamesService;
