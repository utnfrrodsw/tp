const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('singout');
});

module.exports = router;