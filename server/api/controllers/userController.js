'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('Users');
const common = require('../utilities/common');
const consolePrefix = '[USER][CONTROLLER]';

// exports.create_new_user = (req, res) => {
//     console.log("%s Creating new user", consolePrefix);
//     console.log("%s Request body : ", consolePrefix, req.body);
//     var newUser = new User(req.body);
//     newUser.save((err, saveRes) => {
//         if (err) return common.error_send(res, err, 404);
//         let response = JSON.parse(JSON.stringify(saveRes)); // Cannot directly modify the saveRes object
//         delete response['is_admin'];
//         console.log('%s Save response modified : ', consolePrefix, response);
//         return common.result_send(res, response, null, undefined, 'New user created');
//     });
// };


exports.list_all_users = (req, res) => {
    console.log("%s Showing all users", consolePrefix);
    User.find({}, "-is_admin", (err, users) => {
        if (err) return common.error_send(res, err, 404);
        return common.result_send(res, users, null, 200, "Returning all users");
    });
};