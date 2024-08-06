const { models } = require('../libs/sequelize');

class CityService{
    constructor(){

    }

    async find(){
        const res = await models.City.findAll()
        return res;
    }

    async findOne(id){
        const res = await models.City.findByPk(id);
        return res;
    }

    async create(data){
        const res = await models.City.create(data);
        return res;
    }

    async findByProvince(id){
        const res = await models.City.findAll({
            where: {
                id_province: id 
            },
        });
        return res;
    }

    async findByCountry(id){
        const res = await models.City.findAll({
            where: {
                id_country: id,
            },
        });
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
        return { deleted: true};
    }
}

module.exports = CityService;