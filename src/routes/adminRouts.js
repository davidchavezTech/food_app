const express = require('express');
const router = express.Router();
const pool = require('../database')
const likes_db_connection = require('../likes_database_export')

router.get('/admin', (req, res) => {
    res.render('admin/admin', {layout: 'adminLayout'});
});
router.get('/adminCategories', async (req, res) => {
    let result = await pool.query('SELECT * FROM categories');
    let loopForCategories = {
        categories: result,
        layout: 'adminLayout'
    }
    console.log(loopForCategories)
    res.render('admin/admin-cat', loopForCategories);
});
router.get('/admin-cat1', async (req, res) => {
    let result = await pool.query('SELECT * FROM cat_1');
    let loopForDishes = {
        dishes: result,
        layout: 'adminLayout'
    }
    console.log(loopForDishes)
    res.render('admin/admin-cat1', loopForDishes);
});

router.get('/admin-upload', async (req, res) => {
    
    res.render('admin/upload', {layout: 'adminLayout'});
});

router.post('/admin-upload', (req, res) =>{
    console.log(req.file)
    res.send('uploaded')
})

router.get('/draggable', async (req, res) => {
    
    res.render('admin/draggable', {layout: 'adminLayout'});
});

router.post('/adminCategories', async (req, res) => {
    
    res.render('admin/draggable', {layout: 'adminLayout'});
});


module.exports = router;