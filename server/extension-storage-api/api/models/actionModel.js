'use strict';
var mongoose = require('mongoose');
var idValidator = require('mongoose-id-validator');
var Schema = mongoose.Schema;

const actionTypes = Object.freeze({'url':'url','mouse':'mouse','key':'key','tabOpen':'tab_opened','tabClose':'tab_closed','tabSwitch':'tab_switch'});

var ActionSchema = new Schema({
    user_id: { type: Number, default: false },
    action: { type: String, default: 'url', required: true, enum: Object.values(actionTypes)},
    tab: { type: String, required: function(){ return [actionTypes.tabOpen, actionTypes.tabClose, actionTypes.tabSwitch].includes(this.action) }},
    url: { type: String, required: function(){ return this.action == actionTypes.url }},
    mouse_x: { type: Number, required: function(){ return this.action == actionTypes.mouse }},
    mouse_y: { type: Number, required: function(){ return this.action == actionTypes.mouse }},
    keys: { type: String, required: function(){ return this.action == actionTypes.key }}
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', currentTime: () => Date.now()}, // [TODO] This may not work. Revisit
});

ActionSchema.plugin(idValidator);
module.exports = mongoose.model('Actions', ActionSchema);
