const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('login');
});

module.exports = router;