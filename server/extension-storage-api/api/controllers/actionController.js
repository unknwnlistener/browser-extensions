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
    console.log(consolePrefix + "Updating database with new sites", req.body);

    common.result_send(res, { message: 'Post call invoked' }, null);
};

/* #endregion */

