const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');
const { database } = require('./keys');
const multer = require('multer');
const { extname } = require('path');
const livereload = require("livereload")
const connectLivereload = require("connect-livereload")

const publicDirectory = path.join(__dirname, 'public');
const livereloadServer = livereload.createServer();
const viewsDir = path.join(__dirname, 'views');
livereloadServer.watch(publicDirectory);
livereloadServer.server.once("connection", () => {
    setTimeout(()=>{
        livereloadServer.refresh("/");
    }, 100);
})

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        //acá al segundo parámetro, poner el nombre con el que se guardará el archivo
        cb(null, file.originalname)
    }
})
// Initializations
const app = express();


require('./lib/passport');

// settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));

const hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
})

app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

// Middlewares
app.use(session({
    secret: 'asdfasdfdas',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database),
    maxAge: null
}))
app.use(multer({
    //--Se podría usar storage nada más y crearía una propiedad que dirige a la variable const que tiene el mismo nombre
    //storage,
    storage: storage,
    //--ya no usamos lo de abajo porque lo contiene "storage" arriba ↑
    // dest: path.join(__dirname, 'public/uploads')
    //un mega por 5, por ejemplo para el límite de file size
    // limits: {fileSize: 1000000 * 5}
    // fileFilter: (req, file, cb) =>{
    //     const fileTypes = /jpeg|jpg|png/;
    //     const mimetype = fileTypes.test(file.mimetype) 
    //     const extName = fileTypes.test(path.extname(file.originalname.toLowerCase()));
    //     if(mimetype && extName){
    //         return cb(null, true);
    //     }
    //     cb("Error: Wrong file type")
    // }
}).single('image'));
app.use(flash());
app.use(morgan('dev'));
require('./lib/passport')
//urlencoded es para aceptar datos que envien los usuarios de los formularios
//extended false es para solo aceptar datos de texto y no imagenes
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(connectLivereload());

// Global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});
// Routes
app.use(require('./routes'));
app.use(require('./routes/adminRouts'));
app.use(require('./routes/authentication'));
// app.use(require('./routes/gps'));
// app.use('/links', require('./routes/links'));
app.use(require('./routes/shopping-cart'));


// Public
app.use(express.static(publicDirectory));
// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})