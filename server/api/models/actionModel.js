'use strict';
var mongoose = require('mongoose');
var idValidator = require('mongoose-id-validator');
var Schema = mongoose.Schema;

const actionTypes = Object.freeze({'url':'url','mouse':'mouse_click','keystrokes':'keystrokes','tabOpen':'tab_opened','tabClose':'tab_closed', 'screenshot':'screenshot'});

var ActionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: [true, 'User is required'] },
    action: { type: String, default: 'url', required: true, enum: Object.values(actionTypes)},
    tabId: { type: Number, required: true},
    url: { type: String, required: function(){ return this.action == actionTypes.url }},
    mouse_x: { type: Number, required: function(){ return this.action == actionTypes.mouse }},
    mouse_y: { type: Number, required: function(){ return this.action == actionTypes.mouse }},
    keys: { type: String, required: function(){ return this.action == actionTypes.key }},
    windowId: {type: Number, required: true},
    client_timestamp: {type: Date, required: true},
    imageUrl: {type: String, requied: function(){ return this.action == actionTypes.screenshot }}
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', currentTime: () => Date.now()}, 
});

ActionSchema.plugin(idValidator);
module.exports = mongoose.model('Actions', ActionSchema);
