const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

module.exports.checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    // console.log(' TOKEN CREATE :', req.cookies.jwt);
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(' err quand token valid :', err);
                res.locals.user = null;
                res.cookie('jwt', '', { maxAge: 1 });
                next();
            } else {
                // console.log(' decodedToken checkUser :', decodedToken);
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;

                // console.log(' user:', res.locals.user);
                next()
            }
        })
    } else {
        res.locals.user = null;
        next()
    }
}

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {

                console.log(' err apres token valid:', err);
            } else {
                console.log(' decodedToken requireAuth :', decodedToken.id);
                next();
            }
        })
    }else{

        console.log('No token :', );
    }
}