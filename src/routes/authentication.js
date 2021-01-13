const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup')
})

//An example of ANOTHER way of doing what's directly underneath.
//-------------------------------------------
// router.post('/signup', (req, res) => {
//     passport.authenticate('local.signup', {
//         successRedirect: '/profile',
//         failureRedirect: '/signup'
//         //failureFlash: true
//     })
//     res.send('received');
// });
//--------------------------------------------

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
        successRedirect: '/food_app',
        failureRedirect: '/register'
        //failureFlash: true
}))
router.post('/register', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/register',
    // failureFlash: true
}))

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
})

router.post('/signin', isNotLoggedIn, (req, res, next) => {

    passport.authenticate('local.signin',{
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
})
router.post('/login', isNotLoggedIn, (req, res, next) => {

    passport.authenticate('local.signin',{
        successRedirect: '/categories',
        failureRedirect: '/food_app',
        failureFlash: true
    })(req, res, next);
})
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile')
});

router.get('/logout',  isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/food_app');
})
module.exports = router;