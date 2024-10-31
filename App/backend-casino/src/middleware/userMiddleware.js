const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    const token = req.query.token
    const role = req.query.role

    if (token) {
        jwt.verify(token, 'UTimbaN', (err) => {
            if (err) {
                console.log(err);
            } else {
                if (role == 'user' || role == 'admin'){
                    next()
                }
                else {
                console.log('error al verificar usuario')
                }
            }
        })
    } else {
        console.log('error al verificar token')
    }
}

const postAuth = (req, res, next) => {
    const token = req.body.token
    const role = req.body.role

    if(token){
        jwt.verify(token, 'UTimbaN', (err) => {
            if (err){
                console.log(err)
            } else {
                if (role == 'user'){
                    next()
                } else {
                    console.log('error al verificar usuario')
                }
            }
        })
    } else {
        console.log('error al verificar token')
    }
}


module.exports = { userAuth, postAuth }