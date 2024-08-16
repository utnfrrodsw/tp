const loginService = require('../services/login.service')
const service = new loginService();

const userService = require('../services/user.service')
const service2 = new userService();

const jwt = require('jsonwebtoken')


const signInUser = async (req, res) => {
    try{
        const { username, password } = req.body;

        //Verificar Usuario
        const user = await service.findUser(username)
        if (!user) {
            return res.status(404).json('Username not found');
        }

        //Verificar Password
        const passwordValid = await service.compare(username, password)
        if (!passwordValid) {
            return res.status(404).json('Incorrect Username and Password combinations')
        }


        //Autentificar con JWT
        const token = jwt.sign({ foo: 'bar' }, 'agus');

        /* const token = jwt.sign({ id: user.id_user }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION
        }); */

        //send status
        res.status(200).send("Succesfull sign in")
    } catch (err) {
        return res.status(500).send('Sign in error')
    }
}

module.exports = { signInUser }