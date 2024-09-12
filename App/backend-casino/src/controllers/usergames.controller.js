const UsersGamesService = require('../services/usergames.service');
const service = new UsersGamesService();

const create = async(req, res) => {
    try{
        const response = await service.create(req.body)
        res.json({ success: true, data: response })
    } catch(error) {
        res.status(500).send({ success: false, message: error.message })
    }
}

const get = async(req, res) => {
    try{
        const response = await service.find();
        res.json(response);
    } catch(error) {
        res.status(500).send({ success: false, message: error.message })
    }
}

const query1 = async(req, res) => {
    try{
        const response = await service.query1();
        res.json(response);
    } catch(error) {
        res.status(500).send({ success: false, message: error.message })
    }
}

module.exports = {
    create, get, query1
};