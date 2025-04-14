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

const leaderboard = async(req, res) => {
    try{
        const response = await service.leaderboard();
        res.json(response);
    } catch(error) {
        res.status(500).send({ success: false, message: error.message })
    }
}

const history = async(req, res) => {
    try{
        const { id } = req.params;
        const response = await service.history(id);
        res.json(response);
    } catch(error) {
        res.status(500).send({ success: false, message: error.message })
    }
}

module.exports = {
    create, get, leaderboard, history
};