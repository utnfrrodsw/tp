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
        const res = await models.UserGame.sequelize.query('select usergames.id_user, usergames.id_game, usergames.bet, usergames.winning, usergames.createdAt, users.first_name, users.last_name, games.name from usergames inner join users on users.id_user = usergames.id_user inner join games on games.id_game = usergames.id_game', {
            type: QueryTypes.SELECT
        })
        return res;
    }
}

module.exports = UsersGamesService;
