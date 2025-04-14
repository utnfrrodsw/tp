const jwt = require('jsonwebtoken');
require('dotenv').config();


const userAuth = (req, res, next) => {
    const token = req.query.token
    const role = req.query.role

    if (token) {
        jwt.verify(token, 'UTimbaN', (err) => {
            if (err) {
            } else {
                if (role == 'user' || role == 'admin'){
                    next()
                }
                else {
                return res.status(400).send("Register to access")
                }
            }
        })
    } else {
        return res.status(400).send("Register to access")
    }
}

const postAuth = (req, res, next) => {
    const token = req.body.token
    const role = req.body.role

    if(token){
        jwt.verify(token, process.env.TOKEN_KEY, (err) => {
            if (err){
            } else {
                if (role === 'user' || role === 'admin'){
                    next()
                } else {
                    return res.status(400).send("Error al verificar Usuario")
                }
            }
        })
    } else {
        return res.status(400).send("Error al verificar Usuario")
    }
}


module.exports = { userAuth, postAuth }