const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/shopping-cart', isLoggedIn, (req, res) => {
    res.render('navigation/carrito');
})
router.post('/shopping-cart', isLoggedIn, async (req, res) => {
    const {user_ID, cliente, orden, driver, total, estado} = req.body
    var fecha = new Date();
    const timmy = {
        user_ID,
        fecha,
        cliente,
        orden,
        driver,
        total,
        estado
    };
    await pool.query('INSERT INTO orders set ?', [timmy]);
    req.flash('success', 'Agregado correctamente');
    res.redirect('/empty');
});
router.get('/empty', isLoggedIn, async (req, res) => {
    const dataAcquired = await pool.query('SELECT * FROM orders WHERE user_ID = ?', [req.user[0].user_ID])
    console.log(req.user[0])
    res.render('navigation/ShoppingCart', {ordenes: dataAcquired});
})
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    // console.log(req.params.id);
    const { id } = req.params;
    await pool.query('DELETE FROM orders WHERE id = ?', [id]);
    req.flash('success', 'Borrado satisfactoriamente');
    res.redirect('/empty');
})
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const infoForEdit = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    res.render('navigation/edit', {infoForEdit: infoForEdit[0]});
});
router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const {user_ID, cliente, orden, driver, total, estado} = req.body;
    const infoForUpdate = {
        user_ID,
        cliente,
        orden,
        driver,
        total,
        estado
    }
    await pool.query('UPDATE orders set ? WHERE id = ?', [infoForUpdate, id]);
    req.flash('success', 'Actualizacion correcta')
    res.redirect('/empty');
});
module.exports = router;