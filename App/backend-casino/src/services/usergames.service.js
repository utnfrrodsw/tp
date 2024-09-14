const { QueryTypes } = require('sequelize');
const { models } = require('../libs/sequelize');

class UsersGamesService{
    constructor(){

    }

    async find(){
        const res = await models.UserGame.sequelize.query(`select ug.bet, ug.winning as winning, ga.name as game
            from UserGames ug
            inner join Games ga on ug.id_game = ga.id_game
            where ug.winning > 0
            `, {
                type: QueryTypes.SELECT
            })
        return res;
    }

    async create(data){
        const res = await models.UserGame.create(data)
        return res;
    }

    async query1(){
        const res = await models.UserGame.sequelize.query(`select ug.id_user, us.username, ug.bet, max(ug.winning) as winning, ga.name as game
        from UserGames ug
        inner join Users us on ug.id_user = us.id_user
        inner join Games ga on ug.id_game = ga.id_game
        where ug.winning > 0
        group by ug.id_user, us.username, ga.name, ug.bet`, {
            type: QueryTypes.SELECT
        })
        return res;
    }
}

module.exports = UsersGamesService;
