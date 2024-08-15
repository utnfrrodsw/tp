const loginService = require('../services/login.service')
const service = new loginService();


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

        //send status
        res.status(200).json('Sesion iniciada')


    } catch (err) {
        return res.status(500).send('Sign in error')
    }
}

module.exports = { signInUser }