const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.query.token
    let role = req.query.role

    console.log(token)
    console.log(role)

    if (token) {
        jwt.verify(token, 'UTimbaN', (err) => {
            if (err) {
                console.log('');
            } else {
                console.log('');
                if (role == 'admin'){
                    console.log('')
                    next()
                }
                else {
                    console.log('')
                }
            }
        })
    } else {
        console.log('minecraft');
    }

}
module.exports = requireAuth