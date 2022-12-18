//express y otras librerias
const express = require('express');
const app = express();
const bCrypt = require('bcrypt')
const session = require('express-session');
const argv = require('argv')
const ParseArgs = require('minimist')
const compression = require('compression')

//DotEnv
if(process.env.NODE_ENV !='Production'){
    require('dotenv').config();
}
const PORT = process.env.PORT || 8080;
const dotenv = require('dotenv')
dotenv.config()


//hbs
const exphbs = require('express-handlebars');

//passport
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const cookieParser = require('cookie-parser');

//importaciones otros archivos 
// const createHash = require('./helpers')
// const isValidPassword = require('./helpers')
const User = require('./models');

//configuraciones
const config = require('./config')
const controllersdb = require('./controllersdb')
const routes = require('./routers/routes');
const router = require('./routers/router') 


// Configuracion de las vistas
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main.hbs' }));
app.set('view engine', '.hbs');
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/views'));


//session
app.use(cookieParser('my secret'));

app.use(session({
    secret: 'my secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: config.TIEMPO_EXPIRACION
    }
}));

// funcion para encriptar la Clave
function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
// funcion para validar la Clave que se encripto con bCrypt
function isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password);
}
passport.use('signup', new LocalStrategy({
    passReqToCallback: true
},
    // los parametros de username y password que le pasamos a passport son los que se definen en la plantilla signup.html en el atributo name, debe ser el mismo nombre de lo contrario nos va dar error
    (req, username, password, done) => {

        // hacemos la busqueda en la DB y validamos si el usuario existe
        User.findOne({ 'username': username }, (err, user) => {
            if (err) {
                return done(err);
            };

            // si el user ya exite cortamos el flujo
            if (user) {
                return done(null, false);
            }

            // Si llegamos a este punto, quiere decir que el usuario no existe, entonces le damos de alta al usuario
            const newUser = {
                username: username,
                password: createHash(password), //usamos bCrypt para encriptar la contraseña          
            };

            // insertamos en mongo el nuevo usuario que creamos y validamos
            User.create(newUser, (err, userWithId) => {
                if (err) {
                    return done(err);
                }
                return done(null, userWithId);
            })
        });
    }
));
// validamos si el usuario existe y ademas si la contraseña conincide 
passport.use('login', new LocalStrategy(
    {passReqToCallback:true},
    (req,username, password, done) => {
        User.findOne({ username }, (err, user) => {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            if (!isValidPassword(user, password)) {
                return done(null, false);
            }

            return done(null, user);
        })
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(function(id,done){
    User.findById(id, done);
})


//inicializamos passport
app.use(passport.initialize());
app.use(passport.session());


//LOGIN
app.get('/login', routes.getLogin);
//Aqui usamos la estrategia que configuramos, que se llama 'login', si este falla redireccionamos a getFailLogin, si no falla redireccionamos a postLogin
app.post('/login', passport.authenticate('login', {
    failureRedirect: '/faillogin'
}), routes.postLogin);
app.get('/faillogin', routes.getFailLogin);



//SIGNUP
app.get('/signup', routes.getSignUp);
app.post('/signup', passport.authenticate('signup', {
    failureRedirect: '/failsignup'
}), routes.postSignup);
app.get('/failsignup', routes.getFailsignup);

//Last part
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

// simulamos una ruta protegida usando como middleware checkAuthentication
app.get('/ruta-protegida', checkAuthentication, (req, res) => {
    const { user } = req;
    console.log(user);
    res.send('<h1>Ruta OK!</h1>');
});

//LOGOUT
app.get('/logout', routes.getLogout);

//Desafío con y sin compression

app.get('/info',router,compression(),(req,res)=>{
    res.send(data)
})

// app.get('/info',router,compression(),(req,res)=>{
//     res.send(data)
// })


app.get('/randoms',router,(req,res)=>{

    res.send().status(200);

})

const options ={
    alias:{
        m:"modo",
        p:"port",
        d:"debug"
    },
    default:{
        modo:'prod',
        port:'8080',
        debug: false
    }
}



// ------------------------------------------------------------------------------
//  LISTEN SERVER
// ------------------------------------------------------------------------------

//usando env
controllersdb.conectarDB(process.env.URL_BASE_DE_DATOS, err => {

    if (err) return console.log('error en conexión de base de datos', err);
    console.log('BASE DE DATOS CONECTADA');

    app.listen(PORT, (err) => {
        if (err) return console.log('error en listen server', err);
        console.log(`Server running on port 8080`);
    });
});
