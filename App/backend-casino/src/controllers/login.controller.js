const loginService = require('../services/login.service')
const service = new loginService();
require('dotenv').config();

const userService = require('../services/user.service')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const signInUser = async (req, res) => {
    try{
        const { username, password } = req.body;

        //Verificar Usuario
        const user = await service.findUser(username)
        const data = {
        id_user: user.id_user,
        role: user.role,
        username: user.username,
        email: user.email,
        phone: user.phone,

        }

        if (!user) {
            return res.status(404).json('Username not found');
        }

        //Verificar Password
        const match = bcrypt.compareSync(password, user.password)
        if (!match) {
            return res.status(404).json('Incorrect Username and Password combinations')
        }

        //Autentificar con JWT
        const token = jwt.sign({data}, process.env.TOKEN_KEY, { expiresIn: '72h'});

        //Send status
        res.status(200).send({ message: 'success', accessToken: token })
    } catch (err) {
        return res.status(500).json('Sign in error')
    }
}

module.exports = { signInUser }