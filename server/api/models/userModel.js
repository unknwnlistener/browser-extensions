'use strict';
var mongoose = require('mongoose');
var idValidator = require('mongoose-id-validator');
// [TODO] AUto incremented field may be detrimental
// const autoIncrement = require('mongoose-sequence')(mongoose);

var Schema = mongoose.Schema;

//_id hidden from the front end. Will be using userID for all transactional processes
const UserSchema = new Schema({
    
    password: { 
        type: String, 
        required: [true, 'Password is required'] 
    },
    
    email: {
        type: String, 
        required: [true, 'Email is required'], 
        unique: true,
        trim: true,
        validate: {
            validator: (v) => {
                /^([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)@(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/.test(v);
            }
        }, 
        set: x => x.toLowerCase()
    }, //Email validation includes check for email format and converts all case to lowercase
    
    firstName: { 
        type: String,
        max: 100
    },
    
    lastName: {
        type: String,
        max: 100
    },

    isAdmin: { 
        type: Boolean, 
        default: false 
    },

    isVerified: {
        type: Boolean,
        default: false
    },
    
    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type: Date,
        required: false
    }
},
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt', currentTime: () => Date.now() }
    });
    
UserSchema.plugin(idValidator);
//Plugin automatically creates field userID which will be auto-incremented
// userSchema.plugin(autoIncrement, {inc_field: 'userId'});

module.exports = mongoose.model('Users', UserSchema);