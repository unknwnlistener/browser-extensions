'use strict';
var mongoose = require('mongoose');
var idValidator = require('mongoose-id-validator');
const autoIncrement = require('mongoose-sequence')(mongoose);

var Schema = mongoose.Schema;

//_id hidden from the front end. Will be using userID for all transactional processes
var userSchema = new Schema({
    // userId: {type: Number, } // [TODO] Generated on creation somehow
    name: {type: String, required: [true, 'Name is required']}, 
    password: {type: String, required: [true, 'Password is required']}, 
    email: {type: String, required: [true, 'Email is required'], unique: true},
    is_admin: {type: Boolean, default: false}
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', currentTime: () => Date.now()}
});

userSchema.plugin(idValidator);
 //Plugin automatically creates field userID which will be auto-incremented
userSchema.plugin(autoIncrement, {inc_field: 'user_id'});

module.exports = mongoose.model('Users', userSchema);