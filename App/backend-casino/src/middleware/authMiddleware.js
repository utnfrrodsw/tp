const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.query.token
    let role = req.query.role

    console.log(token)
    console.log(role)

    if (token) {
        jwt.verify(token, 'UTimbaN', (err) => {
            if (err) {
                console.log('error');
            } else {
                console.log('token verificado');
                if (role == 'admin'){
                    console.log('admin')
                    next()
                }
                else {
                    console.log('no sos admin jaja xd')
                }
            }
        })
    } else {
        console.log('minecraft');
    }

}
module.exports = requireAuth