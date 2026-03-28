const { models } = require('../libs/sequelize');

class GameService{
    constructor(){

    }

    async find(){
        const res = await models.Game.findAll()
        return res;
    }

    async findOne(id){
        const res = await models.Game.findByPk(id);
        return res;
    }

    async create(data){
        const res = await models.Game.create(data);
        return res;
    }

    async findByCategory(id){
        const res = await models.Game.findAll({
            where: {
                id_category : id,
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

module.exports = GameService;