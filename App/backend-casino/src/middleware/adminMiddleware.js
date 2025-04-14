const jwt = require('jsonwebtoken');
require('dotenv').config();

const adminAuth = (req, res, next) => {
    const token = req.query.token
    let role = req.query.role

    if (token) {
        jwt.verify(token, 'UTimbaN', (err) => {
            if (err) {
                console.log(err);
            } else {
                if (role == 'admin'){
                        next()
                }
                else {
                    return res.status(400).send("Error al verificar Admin")
                }
            }
        })
    } else {
        return res.status(400).send("Error al verificar Admin")
    }
}

const adminPost = (req, res, next) => {
    const token = req.body.token
    const role = req.body.role

    if(token){
        jwt.verify(token, process.env.TOKEN_KEY, (err) => {
            if (err){
                console.log(err)
            } else {
                if (role == 'admin'){
                    next()
                } else {
                    return res.status(400).send("Error al verificar Admin")
                }
            }
        })
    } else {
        return res.status(400).send("Error al verificar Admin")
    }
}

module.exports = { adminAuth, adminPost }