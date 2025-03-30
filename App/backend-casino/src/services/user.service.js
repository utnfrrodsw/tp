const { QueryTypes } = require('sequelize');
const { models } = require('../libs/sequelize');

class UserService{
    constructor(){

    }

    async find(){
        const res = await models.User.findAll()
        return res;
    }

    async findOne(id){
        const res = await models.User.findByPk(id);
        return res;
    }

    async create(data){
        const res = await models.User.create(data);
        return res;
    }

    async update(id, data) {
        const model = await this.findOne(id);
        const res = await model.update(data);
        return res;
    }

    async delete(id){
        const model = await this.findOne(id);
        await model.destroy();
        return { deleted: true };
    }

    async read(id) {
        const res = await models.User.sequelize.query(
            `select u.id_user, u.username, u.first_name, u.last_name, u.birthday, u.phone, u.balance, u.createdAt, u.email, co.nice_name as "Country" from Users u
            inner join Countries co on u.id_country = co.id_country
            where u.id_user =` + id, {type: QueryTypes.SELECT})
        return res;
    }

    async readBalance(id) {
        const res = await models.User.sequelize.query(
            `select balance from Users
            where id_user =` + id, {type: QueryTypes.SELECT})
        return res;
    }

}

module.exports = UserService;