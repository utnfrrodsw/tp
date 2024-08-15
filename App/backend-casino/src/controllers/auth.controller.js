const authService = require('../services/auth.service')
const service = new authService();

const registerUser = async(req,res) => {
    const { username, first_name, last_name, birthday, street, phone, email, password } = req.body;

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


    //Register User; INSERT into BD
    try{
        const response = await service.create({
            username,
            first_name,
            last_name,
            birthday,
            street,
            phone,
            email,
            password,
            "role": "user",

            // Esto se va a cambiar para que el usuario eliga su pais, provincia y ciudad
            "id_country": "1",
            "id_province": "1",
            "id_city": "1"
        }
        );
        res.status(200).send('Registrado Correctamente');
    } catch(err){
        res.status(500).send('Ocurrio un error al registrarse')
        console.log(err)
    }
}

module.exports =  { registerUser };