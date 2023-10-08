const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('refreshToken');
});

module.exports = router;