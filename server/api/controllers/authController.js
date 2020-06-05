'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const common = require('../utilities/common');
const authRepo = require('../repositories/authRepository');
const secretValue = 'mySecret'; // [TODO] Change the location of secret to a config file

exports.login_user = async (req, res) => {  //ToDO: wrap into a result model
    try {
        var user = await authRepo.findUserByEmail(req.body.email);
        if (!user) {
            return common.error_send(res,{message: "Invalid login credentials"},403);
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return common.error_send(res,{message: "Invalid login credentials"},403);
        }

        jwt.sign({ userId: user._id }, secretValue, (err, token) => {
            if(err) return common.error_send(res, err, 403);
            // res.json({ token });
            return common.result_send(res, {token: token} , null);
        });
    }
    catch(e) {
        return common.error_send(res, e, 404);
    }   
}

exports.register_user = async (req, res) => { //ToDO: wrap into a result model
    try{
        let user = req.body;
        let existingUser = await authRepo.findUserByEmail(user.email);
        if (existingUser) {
            // res.send('user exists');
            return common.error_send(res, {message: 'Existing user'}, 400);
        }

        if (!validateEmail(user.email)) {
            // res.send('invalid email');
            return common.error_send(res, {message: 'Invalid email'}, 400);
        }

        let passHash = bcrypt.hashSync(user.password, 10);
        user.password = passHash;
        user = await authRepo.createUser(user);
        console.log("[AUTH][REGISTER] User : ", user);
        jwt.sign({ userId: user._id }, secretValue, (err, token) => {
            if(err) return common.error_send(res, err, 403);
            // res.json({ token });
            return common.result_send(res, {token: token}, null);
        });
    } catch(e) {
        return common.error_send(res, e, 404);
    }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

exports.verifyToken = (req, res, next) => {
    let bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        // [TODO] Improve this header retrieval of the token
        // Current format: Bearer <token>
        let token = bearerHeader.split(' ')[1];
        req.token = token;
        jwt.verify(req.token, secretValue, (err, data) => {
            if (err) {
                return common.error_send(res, err, 403);
            } else {
                req.userId = data.userId;
                console.log('Authorized user id is: ', req.userId);
                next();
            }
        });

    } else {
        return common.error_send(res, {message: "Invalid token"}, 403);
    }
}