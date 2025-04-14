const { models } = require('../libs/sequelize');

class loginService{
    constructor(){

    }

    async findUser(user){
        const res = await models.User.findOne({
            where: {
                username : user,
            },
        });
        return res
    }

    async compare(user, pass){
        const res = await models.User.findOne({
            where: {
                username: user,
                password: pass,
            }
        })
        return res
    }
}

module.exports = loginService;