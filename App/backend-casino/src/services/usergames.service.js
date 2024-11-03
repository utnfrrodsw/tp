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

    async leaderboard(){
        const res = await models.UserGame.sequelize.query(`select ug.id_user, us.username, ug.bet, max(ug.winning) as winning, ga.name as game
        from usergames ug
        inner join users us on ug.id_user = us.id_user
        inner join games ga on ug.id_game = ga.id_game
        where ug.winning > 0 and ga.id_game in (1, 3)
        group by ug.id_user, us.username, ga.name, ug.bet
        limit 10;`, {
            type: QueryTypes.SELECT
        })
        return res;
    }

    async history(id) {
        const res = await models.UserGame.sequelize.query(`select ug.bet, ug.winning, g.name, ug.createdAt
                                                    from usergames ug
                                                    inner join games g on ug.id_game = g.id_game
                                                    where ug.id_user = ` + id + ` order by ug.createdAt DESC`, {type: QueryTypes.SELECT})
                                                    return res;
    }
}

module.exports = UsersGamesService;
