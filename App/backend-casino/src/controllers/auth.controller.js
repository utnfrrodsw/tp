const authService = require('../services/auth.service')
const service = new authService();
const bcrypt = require('bcrypt')

const saltRounds = 10;

const registerUser = async(req,res) => {
    const { username, first_name, last_name, birthday, phone, email, password, id_country } = req.body;

     //Check if email exists
     const emailExist = await service.findMail(email)
     if (emailExist) {
        return res.status(400).send('Email is already associated with an account');
     }

     //Check if username exists
     const usernameExist = await service.findUser(username)
     if (usernameExist) {
        return res.status(400).send('Username already in use');
     }

     //Check if phone exists
     const phoneExist = await service.findPhone(phone)
     if (phoneExist) {
        return res.status(400).send('Phone is already associated with an account');
     }

     //Hash password
     const salt = bcrypt.genSaltSync(saltRounds);
     const hash = bcrypt.hashSync(password, salt);

    //Register User; INSERT into BD
    try{
        const response = await service.create({
            username,
            first_name,
            last_name,
            birthday,
            phone,
            email,
            password: hash,
            id_country,
            "role": "user",
            "balance": 0
        }
        );
        res.status(200).send('Registrado Correctamente');
    } catch(err){
        res.status(500).json('Ocurrio un error al registrarse')
        console.log(err)
    }
}

module.exports =  { registerUser };