const { models } = require('../libs/sequelize');

class UsersGamesService{
    constructor(){

    }

    async find(){
        const res = await models.UsersGamesService.findAll()
        return res;
    }

    async create(data){
        const res = await models.UsersGamesService.create(data)
        return res;
    }
}

module.exports = UsersGamesService;
