const { models } = require('../libs/sequelize');

class ProvinceService{
    constructor(){

    }

    async find(){
        const res = await models.Province.findAll()
        return res;
    }

    async findOne(id){
        const res = await models.Province.findByPk(id);
        return res;
    }
    
    async findByCountry(id){
        const res = await models.Province.findAll({
            where: {
                id_country: id,
            },
        });
        return res;
    }

    async create(data){
        const res = await models.Province.create(data);
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

module.exports = ProvinceService;