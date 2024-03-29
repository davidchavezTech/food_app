const express = require('express');
const router = express.Router();
const pool = require('../database')
const likes_db_connection = require('../likes_database_export')

const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/choose-role', (req, res) => {
    res.render('navigation/choose-role');
});

router.get('/food_app', isNotLoggedIn, (req, res) => {
    res.render('navigation/food_app');
});

router.get('/register', isNotLoggedIn, (req, res) => {
    res.render('navigation/register');
});
router.get('/categories', isLoggedIn, async (req, res) => {
    let result = await pool.query('SELECT * FROM categories');
    let loopForCategories = {
        categories: result
    }
    res.render('navigation/categories', loopForCategories);
});
router.get('/cat-1', isLoggedIn, async (req, res) => {

    let result = await pool.query('SELECT * FROM cat_1');
    let loopForDishes = {
        dishes: result
    }
    // console.log(loopForDishes)
    res.render('navigation/categories/cat-1/cat-1', loopForDishes);
});
router.get('/cat-1-dish-1', isLoggedIn, async (req, res) => {

    let result = await pool.query('SELECT * FROM cat_1 WHERE id = 1');

    const user = req.user
    let likes_db_table_name = user[0].user_ID + "_" + user[0].name + "_" + user[0].last
    likes_db_table_name = likes_db_table_name.toLowerCase();
    let likes_db_result = await likes_db_connection.query('SELECT * FROM ' + likes_db_table_name + ' WHERE id = ' + user[0].user_ID);
    let data = {
        dishes: result[0]
    }
    if(likes_db_result == ""){
        data.like_status = "empty"
    }
    else{
        data.like_status = likes_db_result[0].like_status
    }
    res.render('navigation/categories/cat-1/cat-1-dish-1', data);
});

router.get('/cat-1-dish-2', isLoggedIn, async (req, res) => {

    let result = await pool.query('SELECT * FROM cat_1 WHERE id = 1');

    const user = req.user
    let likes_db_table_name = user[0].user_ID + "_" + user[0].name + "_" + user[0].last
    likes_db_table_name = likes_db_table_name.toLowerCase();
    let likes_db_result = await likes_db_connection.query('SELECT * FROM ' + likes_db_table_name + ' WHERE id = ' + user[0].user_ID);
    let data = {
        dishes: result[0]
    }
    if(likes_db_result == ""){
        data.like_status = "empty"
    }
    else{
        data.like_status = likes_db_result[0].like_status
    }
    console.log(data)
    console.log(result[0])
    console.log(req.user)
    res.render('navigation/categories/cat-1/cat-1-dish-2', data);
});
router.get('/cart', isLoggedIn, (req, res) => {
    res.render('navigation/cart');
});
// router.get('/admin', (req, res) => {
//     res.render('admin/admin', {layout: 'adminLayout'});
// });
router.get('/checkout-button', isLoggedIn, (req, res) => {
    res.render('navigation/orders-history');
});

module.exports = router;