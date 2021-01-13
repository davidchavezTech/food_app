const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database')
const likes_db_connection = require('../likes_database_export')
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pwd',
    passReqToCallback: true
}, async (req, username, password, done) => {
    
    const rows = await pool.query( 'SELECT * FROM users WHERE email = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        user.id = user.user_ID
        const validPassword = await helpers.matchPassword(password, user.pwd);
        if (validPassword) {
            done(null, user);
            // done(null, user, req.flash('success', 'Welcome ' + user.name));
            // done(null, user);
        }else {
            done(null, false, req.flash('message', 'Incorrect Password'));
            // done(null, false);
        }
    } else {
        
        return done(null, false, req.flash("message", "The username doesn't exist"));
        // return done(null, false);
    }
}))

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pwd',
    passReqToCallback: true
}, async (req, username, password, done) => {
    let today = new Date().toLocaleDateString()
    var fulldate = Date()
    var newDateToSend = fulldate.substring(16, 24);
    var date = today + " " + newDateToSend;
    const { name,
            last,
            number,
            address,
            email,
            pwd
    } = req.body;
    const newUser = {
        date,
        name,
        last,
        number,
        address,
        email,
        pwd,
    }
    newUser.pwd = await helpers.encryptPassword(pwd)
    const result = await pool.query('INSERT INTO users SET ?', [newUser])
    newUser.id = result.insertId;
    tablename = newUser.id + "_" + name + "_" + last
    //CREATE user's likes database
    var sql = "CREATE TABLE " + tablename + " (dish VARCHAR(255), like_status INT(1))";
    const worked = await likes_db_connection.query(sql);
    // //El primer parámetro (null) es para los errores, en este caso, enviamos un null, luego enviamos el usuario para la sesión
    return done(null, newUser);   
}));

// //serialize guarda el usuario en la sesión
passport.serializeUser((user, done) => {
    done(null, user.id);
});
// deserialize buscará al usuario en la base de datos para ver si existe
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE user_ID = ?', [id]);
    done(null, rows);
});