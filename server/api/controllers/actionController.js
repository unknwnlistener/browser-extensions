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
    console.log("%s Returning all actions for all users", consolePrefix);
    Action.find({}, null, {limit: 10000, sort: '-created_at'}, (err, actions) => { 
        if(err) return common.error_send(res, err, 404);
        return common.result_send(res, actions, null, 200, "Returning actions for all users");
    });
};

exports.list_user_actions = (req, res) => {
    let userId = req.params.userId;
    
    Action.find({ userId: userId }, (err, actions) => {
        if (err) return common.error_send(res, err, 404);
        return common.result_send(res, actions, null, 200, "Returning specific user\'s actions");
    });
}

/* #endregion */

/* #region  POST calls */

exports.create_new_action = async (req, res) => {
    let currentUser = req.userId;
    // console.log("%s POST call invoked", consolePrefix);
    // console.log(consolePrefix + "New action : ", req.body);
    if(req.body.action === 'screenshot') {
        let url = await getImageUrl(req, res);
        // console.log("%s URL of image : ", consolePrefix, url);
        req.body.imageUrl = url;
    }
    req.body.userId = currentUser;
    let new_action = new Action(req.body);
    new_action.save((err, saveRes) => {
        if (err) {
            console.warn('Action could not be saved', err);
            return common.error_send(res, err, 400);
        }
        return common.result_send(res, saveRes, null, 201, 'New action created');
    });

};
/* #endregion */

async function getImageUrl(req, res) {
    if (!req.file) return common.error_send(res, { message: 'Image file not found'}, 404);
    const result = await common.uploader(req);
    return result.url;
}