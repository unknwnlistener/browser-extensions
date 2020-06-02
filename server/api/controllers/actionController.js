'use strict';

const mongoose = require('mongoose');
const Action = mongoose.model('Actions');
const common = require('../utilities/common');
const consolePrefix = '[ACTION][CONTROLLER]';

/* #region  GET calls */
/* Read all user actions of all userids (max output of 10,000 entries) 
in temporal order (latest entry first, first entry last): 
*/
exports.list_all_actions = (req, res) => {
    console.log("%s GET call invoked", consolePrefix);
    Action.find({}, { limit: 5, sort: 'created_at'}, function (err, action) { //[TODO] Update limit of this call. Testing = 5
        common.result_send(res, action, err);
    });
};

exports.list_user_actions = (req, res) => {
    let userId = req.params.userId;
    console.log("%s GET user id: %d actions", consolePrefix, userId);
    
    Action.find({ user_id: userId }, (err, actions) => {
        if (err) return common.error_send(res, err, 404);
        return common.result_send(res, actions, null, 200, "Returning specific user\'s actions");
    });
}

exports.list_all_users = (req,res) => {
    console.log("%s GET all users", consolePrefix);

    //[TODO] This can only be done if a separate user model is established and connected
}

/* #endregion */

/* #region  POST calls */

exports.create_new_action = (req, res) => {
    console.log("%s POST call invoked", consolePrefix);
    // let reqBody = req.body;
    console.log(consolePrefix + "New action : ", req.body);
    if (!req.params.userId) {
        return common.error_send(res, { message: 'Invalid parameters passed' }, 400);
        //[TODO] COnnect this call to the userModel DB structure for new users
    }
    req.body.user_id = req.params.userId;
    let new_action = new Action(req.body);
    new_action.save((err, saveRes) => {
        if (err) return common.error_send(res, err, 400);
        return common.result_send(res, saveRes, null, undefined, 'New action created');
    });

};
/* #endregion */