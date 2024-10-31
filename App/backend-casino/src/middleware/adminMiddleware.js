const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    const token = req.query.token
    let role = req.query.role

    if (token) {
        jwt.verify(token, 'UTimbaN', (err) => {
            if (err) {
                console.log(err);
            } else {
                if (role == 'admin'){
                    console.log('')
                    next()
                }
                else {
                    console.log('error al verificar admin')
                }
            }
        })
    } else {
        console.log('error al verificar token');
    }
}

const adminPost = (req, res, next) => {
    const token = req.body.token
    const role = req.body.role

    if(token){
        jwt.verify(token, 'UTimbaN', (err) => {
            if (err){
                console.log(err)
            } else {
                if (role == 'admin'){
                    next()
                } else {
                    console.log('error al verificar admin')
                }
            }
        })
    } else {
        console.log('error al verificar token')
    }
}

module.exports = { adminAuth, adminPost }