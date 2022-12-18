const { dirname } = require('path');
const appDir = dirname(require.main.filename)

function getRoot(req, res) {
    res.send('Bienvenido');
}

// .isAuthenticated es un metodo de passport - si el usuario esta logueado lo re direccionamos a vista login-ok, de lo contrario lo re direccionamos a login.html
function getLogin(req, res) {
    if (req.isAuthenticated()) {

        var user = req.user;
        res.render('login-ok', {
            usuario: user.username,
            nombre: user.firstName,
            apellido: user.lastName,
            email: user.email
        });
    }
    else {
        res.sendFile(`${ appDir }/views/login.html`);
    }
}

function getSignUp(req, res) {
    res.sendFile(`${ appDir }/views/signup.html`);
}


function postLogin(req, res) {
    const user = req.user;
    console.log(user);
    res.sendFile(`${ appDir }/views/index.html`);
}

function postSignup(req, res) {
    const user = req.user;
    console.log(user);
    res.sendFile(`${ appDir }/views/index.html`);
}

function getFailLogin(req, res) {
    console.log('error en login');
    res.render('login-error', {
    });
}

function getFailsignup(req, res) {
    console.log('error en signup');
    res.render('signup-error', {
    });
}


// el .logout es un metodo de passport
function getLogout(req, res) {
    req.logout((err) => {
        if (err) { return next(err); }
        res.sendFile(`${ appDir }/views/index.html`);
    });
}

module.exports = {
    getRoot,
    getLogin,
    postLogin,
    getFailLogin,
    getLogout,
    getSignUp,
    postSignup,
    getFailsignup
}