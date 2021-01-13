const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../lib/auth');

router.get('/gps', isLoggedIn, (req, res) => {
    res.render('navigation/gps')
})

module.exports = router;