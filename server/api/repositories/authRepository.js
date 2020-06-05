'use strict';

/* Repositories are used for all functions that directly interact with the DB model and schema. 
This allows us to separate the logic between Controller and DB as Route -> Controller -> Repository -> DB
*/

const mongoose = require('mongoose');
const Users = mongoose.model('Users');

exports.findUserByEmail = async (email) =>{
    return await Users.findOne({ email: email }, (err, user) => {
        if(err) throw err;
        return user;
    });
}

exports.createUser = async (user) => {
    let newUser = new Users(user);
    await newUser.save();
    return newUser;
}
