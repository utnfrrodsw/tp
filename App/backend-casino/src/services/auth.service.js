const { models } = require('../libs/sequelize');

class authService{
    constructor(){

    }

    async create(user, first, last, birth, str, pho, mail, pass, role, country, province, city){
        const res = await models.User.create(
           user, 
            first, 
            last, 
            birth, 
            str, 
            pho, 
            mail, 
            pass,
            role ,
            country,
            province,
            city
        );
        return res;
    }

    async findMail(req){
        const res = await models.User.findOne({
            where: {
                email : req,
            },
        });
        return res
    }

    async findUser(req){
        const res = await models.User.findOne({
            where: {
                username : req,
            },
        });
        return res
    }

    async findPhone(req){
        const res = await models.User.findOne({
            where: {
                phone : req,
            },
        });
        return res
    }
}

module.exports = authService;