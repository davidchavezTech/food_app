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

router.post('/admin-upload', async (req, res) =>{
    //check if it was an image that they uploaded
    if(req.file){
        res.send({"Response":"File received, reload page"})
    }else if(req.body["category-type-selected"]){
        let newCategoryType = req.body["category-type-selected"]
        let title, subtitle
        //Get the row with the highest number in the order column in the databas
        const dataAcquired = await pool.query('SELECT * FROM categories WHERE order_number=(select max(order_number) from categories)')
        //Add 1 to it
        let newOrderNumber = dataAcquired[0]['order_number']+1
        if(newCategoryType == 1){
            title = "Postre"
            subtitle = "...compártelo con alguien especial"
        }
        if(newCategoryType == 2){
            title = "Salad"
            subtitle = "super fresh!"
        }
        if(newCategoryType == 3){
            title = "Grilled"
            subtitle = "...and well seasoned"
        }
        if(newCategoryType == 4){
            title = "Drinks"
            subtitle = ""
        }
        const newCat = {
            "order_number":newOrderNumber,
            "category_type":newCategoryType,
            "Title":title,
            "Subtitle":subtitle
        }
        await pool.query('INSERT INTO categories set ?', [newCat])
        res.send({"Response":"Category creation made"});
    }
        
})

router.get('/draggable', async (req, res) => {
    
    res.render('admin/draggable', {layout: 'adminLayout'});
});

router.post('/adminCategories', async (req, res) => {
    
    res.render('admin/draggable', {layout: 'adminLayout'});
});


module.exports = router;