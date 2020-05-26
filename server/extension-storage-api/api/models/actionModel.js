'use strict';
var mongoose = require('mongoose');
var idValidator = require('mongoose-id-validator');
var Schema = mongoose.Schema;


var ActionSchema = new Schema({
    user_id: { type: Number, default: false},
    action: { type: String, default: 'url', required: true, enum: ['url','mouse','key','tab_opened','tab_closed','tab_switch']},
    tab: { type: String},
    url: { type: String},
    mouse_x: { type: Number},
    mouse_y: { type: Number},
    keys: { type: String}
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', currentTime: () => Date.now()}, // [TODO] This may not work. Revisit
});

ActionSchema.plugin(idValidator);
module.exports = mongoose.model('Actions', ActionSchema);
