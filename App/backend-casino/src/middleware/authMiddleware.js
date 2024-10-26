const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const {token} = req.body

    console.log(token)

    if (token) {
        jwt.verify(token, 'UTimbaN', (err) => {
            if (err) {
                console.log('error');
                res.redirect('/register');
            } else {
                console.log('bien xd');
                next();
            }
        })
    } else {
        console.log('minecraft');
        res.redirect('/register');
    }

}
module.exports = requireAuth