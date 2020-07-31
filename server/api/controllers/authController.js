'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const mongoose = require('mongoose');

const common = require('../utilities/common');
const secretValue = process.env.JWT_SECRET; 

const User = mongoose.model('Users');
const Token = mongoose.model('Tokens');

let fs = require('fs');
const path = require('path');

exports.login_user = async (req, res) => {  //ToDO: wrap into a result model
    try {
        const { email, password } = req.body;
        var user = await User.findOne({email: email});
        if (!user) {
            return common.error_send(res,{message: "The email address is not associated with any account. Please check and try again."},403);
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return common.error_send(res,{message: "Invalid email or password"},401);
        }

        // Checking if user is verified
        if (!user.isVerified) {
            return common.error_send(res, {message: "Your account has not been verified"}, 401);
        }

        jwt.sign({ userId: user._id }, secretValue, {
            expiresIn: 86400 //1 day
        }, (err, token) => {
            if(err) return common.error_send(res, err, 403);
            // res.json({ token });
            return common.result_send(res, {token: token}, null, 202);
        });
    }
    catch(e) {
        return common.error_send(res, e, 404);
    }   
}

exports.register_user = async (req, res) => { 
    try{
        let user = req.body;
        let existingUser = await User.findOne({email: user.email});
        if (existingUser) {
            return common.error_send(res, {message: 'The email address you have entered is already associated with another account'}, 401);
        }

        if (!validateEmail(user.email)) {
            return common.error_send(res, {message: 'Email format is invalid'}, 400);
        }

        let passHash = bcrypt.hashSync(user.password, 10);
        user.password = passHash;
        user.isVerified = true;
        
        let newUser = new User(user);
        
        // Verify and save the new user
        await newUser.save(function (err) {
            if (err) return common.error_send(res, {message:err.message}, 500);
            
            common.result_send(res, {message: "The account has been verified. Please log in."}, null, 201);
        });
        
        // const user_ = await newUser.save();
        // await sendVerificationEmail(user_, req, res);
    } catch(e) {
        return common.error_send(res, e, 500);
    }
}

exports.verify_user = async (req, res) => {
    if(!req.params.token) {
        return common.error_send(res, {message: "We were unable to find a user for this token."}, 400);
    }

    try {
        // Find a matching token
        const token = await Token.findOne({ token: req.params.token });

        if (!token) return common.error_send(res, { message: 'We were unable to find a valid token. Your token my have expired.'}, 400);

        // If we found a token, find a matching user
        User.findById(token.userId, (err, user) => {
            if (!user) {
                return common.error_send(res, { message: 'We were unable to find a user for this token.' }, 400);
            }

            if (user.isVerified) {
                return common.error_send(res, { message: 'This user has already been verified.' }, 400);
            }

            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) return common.error_send(res, {message:err.message}, 500);

                common.result_send(res, {message: "The account has been verified. Please log in."});
            });
        });
    } catch(e) {
        return common.error_send(res, e, 500);
    }
}

exports.resendToken = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) return common.error_send(res, { message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'}, 401);

        if (user.isVerified) return common.error_send(res, { message: 'This account has already been verified. Please log in.'}, 400);
        console.log("Before sending");
        await sendVerificationEmail(user, req, res);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

async function sendVerificationEmail(user, req, res){
    try{
        // const token = user.generateVerificationToken();
        let payload = {
            userId: user._id,
            token: crypto.randomBytes(20).toString('hex')
        }
        const token = new Token(payload);

        // Save the verification token
        await token.save();

        let subject = "Account Verification Token";
        let to = user.email;
        let from = process.env.FROM_EMAIL;
        let link="http://"+req.headers.host+"/api/auth/verify/"+token.token;
        let html = `<p>Hi ${user.username}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
                  <br><p>If you did not request this, please ignore this email.</p>`;

        await common.sendEmail({to: to, from: from, subject: subject, html: html});

        common.result_send(res, {message: 'A verification email has been sent to ' + user.email + '.'});
    }catch (error) {
        common.error_send(res, {message: error}, 500);
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
                console.log("Error in token verification", req.token, err);
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

exports.get_config = (req, res) => {
    // console.log("CONFIG path : ", path.join(__dirname,'../../', 'config.json'));
    try {
        let configJson = JSON.parse(fs.readFileSync(path.join(__dirname,'../../', 'config.json')));
        // console.log("CONFIG : ", configJson);
        return common.result_send(res, configJson, null, 200, "Config data successfully passed"); 
    } catch (e) {
        return common.error_send(res, e, 404);
    }
}

exports.update_config = (req, res) => {
    let config = req.body;
    console.log("Begin updating config");
    try {
        console.log("Updated config file", config);
        fs.writeFileSync(path.join(__dirname,'../../', 'config.json'), JSON.stringify(config.actions), 'utf-8');
        return common.result_send(res, config.actions, null);
    } catch (e) {
        console.log("Error", e);
        return common.error_send(res, e, 404);
    }
    // return common.result_send(res, null, null);
}