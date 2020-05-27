'use strict';

const mongoose = require('mongoose');
const Action = mongoose.model('Actions');
const common = require('../utilities/common');
const consolePrefix = '[ACTION][CONTROLLER]';

/* #region  Actions */
/* Read all user actions of all userids (max output of 10,000 entries) 
in temporal order (latest entry first, first entry last): 
*/
exports.list_all_actions = (req, res) => {
    console.log("%s GET call invoked", consolePrefix);
    Action.find({}, function (err, action) {
        common.result_send(res, action, err);
    });
};


exports.create_new_action = function (req, res) {
    console.log("%s POST call invoked", consolePrefix);
    // let reqBody = req.body;
    console.log(consolePrefix + "New action : ", req.body);
    let new_action = new Action(req.body);
    new_action.save((err, saveRes) => {
        if(err) return common.result_send(res, null, err, 400, err.message);
        return common.result_send(res, saveRes, null, undefined, 'New action created');
    });
    
};

/* #endregion */

